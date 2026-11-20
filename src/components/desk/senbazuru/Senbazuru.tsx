import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OrigamiBird } from "../OrigamiBird";
import { CRANE_HUES } from "../birdGeometry";
import { CraneFlock, type FlockHandle, type Pointer } from "./CraneFlock";
import { FoldingCrane } from "./FoldingCrane";
import { Mountains } from "./Mountains";

/**
 * 千羽鶴 · senbazuru — legend says whoever folds a thousand paper cranes is
 * granted a wish. Every visitor can fold one crane a day (click anywhere in
 * the footer); the count is shared by everyone via /api/cranes, which decides
 * who has already folded today (see src/server/cranes.ts).
 *
 * Flow of a fold:
 *   click → FoldingCrane plays at the click point (pure UI, instant)
 *         → POST /api/cranes in parallel (count goes up optimistically)
 *   fold animation ends → the crane is handed to the flock and flies off
 */

const GOAL = 1000;

type Fold = { id: number; x: number; y: number; hue: number; size: number };

let foldId = 0;

export function Senbazuru() {
  const scene = useRef<HTMLElement>(null);
  const flock = useRef<FlockHandle>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, active: false });

  const [count, setCount] = useState<number | null>(null);
  const [folded, setFolded] = useState(0);
  const [folds, setFolds] = useState<Fold[]>([]);
  /** null until the server has told us; true once today's crane is folded */
  const [foldedToday, setFoldedToday] = useState<boolean | null>(null);
  const [networkLimited, setNetworkLimited] = useState(false);

  useEffect(() => {
    fetch("/api/cranes")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { count?: number; foldedToday?: boolean; yours?: number } | null) => {
        if (typeof d?.count === "number") setCount(d.count);
        setFoldedToday(d?.foldedToday ?? false);
        setFolded(d?.yours ?? 0); // from the server, so it can never disagree with the count
      })
      .catch(() => {});
  }, []);

  // one crane per day: ignore clicks until we know, and after today's fold
  const canFold = foldedToday === false;

  const fold = useCallback(
    (x: number, y: number) => {
      if (!canFold) return;
      setFoldedToday(true); // lock immediately so a double-click can't fold twice

      const hue = CRANE_HUES[Math.floor(Math.random() * CRANE_HUES.length)];
      setFolds((prev) => [...prev, { id: ++foldId, x, y, hue, size: 40 + Math.random() * 10 }]);

      // optimistic: show +1 now, then trust whatever the server says
      setCount((c) => (c === null ? c : c + 1));
      fetch("/api/cranes", { method: "POST" })
        .then(async (r) => {
          const d = (await r.json().catch(() => null)) as {
            count?: number;
            limited?: boolean;
            reason?: "already-folded" | "network-limit";
            yours?: number;
          } | null;
          if (typeof d?.count !== "number") throw new Error("no count");
          setCount(d.count);
          if (d.limited) {
            if (d.reason === "network-limit") setNetworkLimited(true);
            return;
          }
          if (typeof d.yours === "number") setFolded(d.yours);
        })
        .catch(() => {
          // server unreachable: undo the optimistic +1 and let them try again
          setCount((c) => (c === null ? c : c - 1));
          setFoldedToday(false);
        });
    },
    [canFold],
  );

  const localPoint = (e: { clientX: number; clientY: number }) => {
    const rect = scene.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) return; // links stay links
    const { x, y } = localPoint(e);
    fold(x, y);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return; // on touch, a tap shouldn't drag the flock
    pointer.current = { ...localPoint(e), active: true };
  };

  // keyboard / screen-reader path: the button folds a crane right above itself
  const foldFromButton = (button: HTMLElement) => {
    const r = button.getBoundingClientRect();
    const { x, y } = localPoint({ clientX: r.left + r.width / 2, clientY: r.top - 40 });
    fold(x, y);
  };

  const progress = Math.min(1, (count ?? 0) / GOAL);
  const wished = (count ?? 0) >= GOAL;

  return (
    <section
      id="senbazuru"
      ref={scene}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerLeave={() => (pointer.current = { ...pointer.current, active: false })}
      className={`relative isolate select-none overflow-hidden border-t border-border/60 text-foreground ${canFold ? "cursor-pointer" : ""}`}
      style={{
        // no background of its own: the site's paper grid shows through, with a
        // soft warm glow underneath the thread, like light on a desk
        backgroundImage:
          "radial-gradient(700px 320px at 50% 45%, oklch(0.95 0.035 80 / 0.7), transparent 70%)",
      }}
      aria-label="Senbazuru: fold a paper crane"
    >
      <Mountains />
      {/* the flock waits for the real count, so 0 folded = an empty sky */}
      <CraneFlock ref={flock} pointer={pointer} ambient={count} max={36} />

      <div className="pointer-events-none relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 pt-16 pb-[clamp(190px,24vw,370px)] text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
          千羽鶴 · senbazuru
        </p>

        <h2 className="handwritten mt-4 text-6xl leading-none sm:text-7xl">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={count ?? "…"}
              className="inline-block"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {count ?? "…"}
            </motion.span>
          </AnimatePresence>
          <span className="text-foreground/35"> / {GOAL}</span>
        </h2>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {wished ? "the wish has been made ✦" : "cranes folded by visitors"}
        </p>

        {/* the thread the cranes are strung on; the red crane sits where we are */}
        <div className="relative mt-14 h-px w-[min(440px,80vw)] bg-foreground/15">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[oklch(0.62_0.18_25)]"
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          />
          {Array.from({ length: 11 }, (_, i) => (
            <span
              key={i}
              className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/25"
              style={{ left: `${i * 10}%` }}
              aria-hidden
            />
          ))}
          <motion.div
            className="absolute bottom-0 w-14 -translate-x-1/2"
            animate={{ left: `${progress * 100}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          >
            <OrigamiBird />
          </motion.div>
        </div>

        <p className="font-newsreader mt-8 max-w-md text-base leading-relaxed text-foreground/75 sm:text-lg">
          An old Japanese legend says whoever folds a thousand paper cranes is granted a wish. Every
          crane flying here was folded by someone who visited. When we reach a thousand, I get to
          make one.
        </p>

        <button
          type="button"
          disabled={!canFold}
          onClick={(e) => foldFromButton(e.currentTarget)}
          className="pointer-events-auto mt-8 rounded-full border border-foreground/20 bg-paper/70 px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground/85 shadow-[0_1px_0_oklch(0_0_0_/0.04)] transition-colors hover:border-primary/60 hover:bg-primary/8 disabled:cursor-default disabled:opacity-60 disabled:hover:border-foreground/20 disabled:hover:bg-paper/70"
        >
          {foldedToday ? "today's crane is folded ✓" : "fold today's crane"}
        </button>
        <p className="mt-3 font-mono text-[11px] text-muted-foreground/80">
          {networkLimited
            ? "lots of cranes from your network today — try again tomorrow"
            : foldedToday
              ? "one crane per person per day · come back tomorrow"
              : "one per person per day · or click anywhere here"}
        </p>
        {folded > 0 && (
          <p className="mt-1 font-mono text-[11px] text-muted-foreground/80">
            you&apos;ve folded {folded} {folded === 1 ? "crane" : "cranes"} so far
          </p>
        )}
      </div>

      {/* cranes mid-fold sit above the text so you can watch them */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {folds.map((f) => (
          <FoldingCrane
            key={f.id}
            {...f}
            onDone={() => {
              setFolds((prev) => prev.filter((p) => p.id !== f.id));
              flock.current?.add({
                x: f.x,
                y: f.y,
                vx: (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random()),
                vy: -1.2,
                hue: f.hue,
                size: f.size,
              });
            }}
          />
        ))}
      </div>
    </section>
  );
}
