/**
 * Shared senbazuru counter — one crane per visitor per day.
 *
 * WHERE THE COUNT LIVES
 * Production (Vercel) runs on serverless functions: no shared memory and no
 * writable disk between requests, so the count lives in Upstash Redis, talked
 * to over its REST API with plain fetch (no SDK needed).
 *
 * Env vars — either naming works (the Vercel ↔ Upstash integration sets KV_*):
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 *   KV_REST_API_URL        / KV_REST_API_TOKEN
 *   CRANES_SALT (optional) — salt for hashing visitor IPs
 * Without them it falls back to an in-memory store: fine for `npm run dev`,
 * but on Vercel every function instance would keep its own count.
 *
 * WHO COUNTS AS "ONE VISITOR"
 * Without logins there is no perfect answer, so two checks work together:
 *   1. visitor cookie — a random id in an httpOnly cookie. One fold per id per
 *      day. This is what "unique visitor" means here.
 *   2. network cap — a salted hash of the IP may fold at most IP_DAILY_CAP
 *      cranes a day. Stops someone clearing cookies / using incognito to fold
 *      hundreds, while still letting a whole college or office (many people,
 *      one shared IP) take part.
 * Days are calendar days in UTC.
 */

const COUNT_KEY = "cranes:count";
export const IP_DAILY_CAP = 25;
const DAY_TTL_SECONDS = 2 * 86_400; // keep daily keys a bit past midnight, then Redis deletes them

export type LimitReason = "already-folded" | "network-limit";
export type FoldResult =
  | { count: number; limited: false; yours: number }
  | { count: number; limited: true; reason: LimitReason };

const today = () => new Date().toISOString().slice(0, 10); // "2026-11-21" (UTC)
const visitorKey = (visitor: string) => `cranes:v:${visitor}:${today()}`;
const networkKey = (network: string) => `cranes:ip:${network}:${today()}`;
/** lifetime total for one visitor — no expiry, it's what "you've folded N" shows */
const mineKey = (visitor: string) => `cranes:mine:${visitor}`;

// ---------------------------------------------------------------- redis (REST)

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

type Command = (string | number)[];

/** Runs several commands in one round trip; returns each command's result. */
async function pipeline(cfg: { url: string; token: string }, commands: Command[]) {
  const res = await fetch(`${cfg.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}` },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
  const data = (await res.json()) as { result?: unknown; error?: string }[];
  return data.map((d) => {
    if (d.error) throw new Error(d.error);
    return d.result;
  });
}

// ------------------------------------------------------------ memory fallback

const memory = { count: 0, keys: new Map<string, number>() };
let warnedAboutMemory = false;

function warnMemory() {
  if (warnedAboutMemory) return;
  warnedAboutMemory = true;
  console.warn("[cranes] No Upstash env vars set — using in-memory counter (dev only).");
}

// --------------------------------------------------------------------- public

export async function getCraneState(visitor: string | null) {
  const cfg = redisConfig();
  if (!cfg) {
    warnMemory();
    return {
      count: memory.count,
      foldedToday: !!visitor && memory.keys.has(visitorKey(visitor)),
      yours: visitor ? (memory.keys.get(mineKey(visitor)) ?? 0) : 0,
    };
  }
  if (!visitor) {
    const [count] = await pipeline(cfg, [["GET", COUNT_KEY]]);
    return { count: Number(count ?? 0), foldedToday: false, yours: 0 };
  }
  const [count, folded, yours] = await pipeline(cfg, [
    ["GET", COUNT_KEY],
    ["EXISTS", visitorKey(visitor)],
    ["GET", mineKey(visitor)],
  ]);
  return {
    count: Number(count ?? 0),
    foldedToday: Number(folded) === 1,
    yours: Number(yours ?? 0),
  };
}

export async function foldCrane(visitor: string, network: string): Promise<FoldResult> {
  const vKey = visitorKey(visitor);
  const nKey = networkKey(network);
  const cfg = redisConfig();

  if (!cfg) {
    warnMemory();
    if (memory.keys.has(vKey))
      return { count: memory.count, limited: true, reason: "already-folded" };
    memory.keys.set(vKey, 1);
    const n = (memory.keys.get(nKey) ?? 0) + 1;
    memory.keys.set(nKey, n);
    if (n > IP_DAILY_CAP) return { count: memory.count, limited: true, reason: "network-limit" };
    const yours = (memory.keys.get(mineKey(visitor)) ?? 0) + 1;
    memory.keys.set(mineKey(visitor), yours);
    return { count: ++memory.count, limited: false, yours };
  }

  // SET … NX only succeeds if the key doesn't exist yet, and it's atomic — so
  // even two requests racing each other can't both claim today's crane.
  const [claimed, current] = await pipeline(cfg, [
    ["SET", vKey, 1, "EX", DAY_TTL_SECONDS, "NX"],
    ["GET", COUNT_KEY],
  ]);
  if (claimed !== "OK")
    return { count: Number(current ?? 0), limited: true, reason: "already-folded" };

  const [fromNetwork] = await pipeline(cfg, [
    ["INCR", nKey],
    ["EXPIRE", nKey, DAY_TTL_SECONDS],
  ]);
  if (Number(fromNetwork) > IP_DAILY_CAP) {
    return { count: Number(current ?? 0), limited: true, reason: "network-limit" };
  }

  const [count, yours] = await pipeline(cfg, [
    ["INCR", COUNT_KEY],
    ["INCR", mineKey(visitor)],
  ]);
  return { count: Number(count), limited: false, yours: Number(yours) };
}

// ------------------------------------------------------------------- identity

export const VISITOR_COOKIE = "crane_vid";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** Reads the visitor id cookie; ignores anything that isn't a UUID we issued. */
export function readVisitor(request: Request): string | null {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${VISITOR_COOKIE}=([^;]+)`));
  return match && UUID.test(match[1]) ? match[1] : null;
}

export function visitorCookie(id: string, request: Request) {
  const https =
    request.headers.get("x-forwarded-proto") === "https" || request.url.startsWith("https:");
  return `${VISITOR_COOKIE}=${id}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${https ? "; Secure" : ""}`;
}

/** Raw IPs are personal data — only a salted SHA-256 hash is ever stored. */
export async function networkId(request: Request): Promise<string> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const salt = process.env.CRANES_SALT ?? "senbazuru";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${ip}`));
  return Array.from(new Uint8Array(digest).slice(0, 12), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
