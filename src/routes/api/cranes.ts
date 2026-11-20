import { createFileRoute } from "@tanstack/react-router";
import { foldCrane, getCraneState, networkId, readVisitor, visitorCookie } from "@/server/cranes";

/**
 * GET  /api/cranes → { count, foldedToday }
 * POST /api/cranes → { count, limited, reason? }   (folds today's crane)
 *
 * Both hand out the anonymous visitor cookie if the browser doesn't have one yet.
 */
export const Route = createFileRoute("/api/cranes")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const existing = readVisitor(request);
        const headers = new Headers({ "Cache-Control": "no-store" });
        if (!existing) headers.append("Set-Cookie", visitorCookie(crypto.randomUUID(), request));
        try {
          return Response.json(await getCraneState(existing), { headers });
        } catch (error) {
          console.error("[cranes] GET failed", error);
          return Response.json({ error: "unavailable" }, { status: 503 });
        }
      },

      POST: async ({ request }) => {
        // A bodiless POST is a "simple request", so any other site could submit
        // one from a visitor's browser. Only accept folds from our own pages.
        // (Behind Vercel's proxy the public host arrives in x-forwarded-host.)
        const origin = request.headers.get("origin");
        const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
        if (origin && host && new URL(origin).host !== host) {
          return Response.json({ error: "forbidden" }, { status: 403 });
        }

        const existing = readVisitor(request);
        const visitor = existing ?? crypto.randomUUID();
        const headers = new Headers({ "Cache-Control": "no-store" });
        if (!existing) headers.append("Set-Cookie", visitorCookie(visitor, request));

        try {
          const result = await foldCrane(visitor, await networkId(request));
          return Response.json(result, { status: result.limited ? 429 : 200, headers });
        } catch (error) {
          console.error("[cranes] POST failed", error);
          return Response.json({ error: "unavailable" }, { status: 503 });
        }
      },
    },
  },
});
