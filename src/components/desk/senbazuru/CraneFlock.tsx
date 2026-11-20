import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type Ref,
  type RefObject,
} from "react";
import { useReducedMotion } from "framer-motion";
import { CRANE_HUES } from "../birdGeometry";
import { OrigamiBird } from "../OrigamiBird";

/**
 * A flock of paper cranes using the classic "boids" rules (Craig Reynolds, 1986).
 * Each crane only looks at its neighbours and steers by three rules:
 *   separation — don't crowd the cranes right next to you
 *   alignment  — fly roughly the same direction as nearby cranes
 *   cohesion   — drift toward the centre of the nearby group
 * plus a soft pull toward the cursor and a push away from the edges.
 * No crane knows about "the flock" — the flocking emerges from those local rules.
 *
 * Positions live in a ref and are written straight to each element's
 * `transform` every frame; React state only changes when a crane is added.
 */

export type NewCrane = { x: number; y: number; vx: number; vy: number; hue: number; size: number };
export type FlockHandle = { add: (crane: NewCrane) => void };
export type Pointer = { x: number; y: number; active: boolean };

type Body = NewCrane & { dir: 1 | -1 };
type Meta = { id: number; hue: number; size: number; delay: number; duration: number };

// Tuned in px per 60fps-frame.
const MIN_SPEED = 0.6;
const MAX_SPEED = 2.1;
const NEIGHBOUR_RADIUS = 110;
const SEPARATION_RADIUS = 42;
const EDGE_MARGIN = 56;

let nextId = 1;

function transformFor(b: Body) {
  // tilt with the climb/descent, but never more than ±25°
  const angle = Math.max(-25, Math.min(25, (Math.atan2(b.vy, Math.abs(b.vx)) * 180) / Math.PI));
  return `translate3d(${b.x - b.size / 2}px, ${b.y - b.size * 0.375}px, 0) scaleX(${b.dir}) rotate(${angle}deg)`;
}

export function CraneFlock({
  ref,
  pointer,
  ambient,
  max,
}: {
  ref?: Ref<FlockHandle>;
  pointer: RefObject<Pointer>;
  /** cranes folded so far (null = not loaded yet); that many fly, up to what fits */
  ambient: number | null;
  /** oldest cranes leave once the flock is bigger than this */
  max: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const bodies = useRef(new Map<number, Body>());
  const elements = useRef(new Map<number, HTMLDivElement>());
  const [cranes, setCranes] = useState<Meta[]>([]);
  const reduceMotion = useReducedMotion();

  const add = useCallback(
    (crane: NewCrane) => {
      const id = nextId++;
      bodies.current.set(id, { ...crane, dir: crane.vx < 0 ? -1 : 1 });
      setCranes((prev) => {
        const next = [
          ...prev,
          {
            id,
            hue: crane.hue,
            size: crane.size,
            delay: -Math.random() * 0.7, // negative delay = start mid-flap
            duration: 0.6 + Math.random() * 0.25,
          },
        ];
        for (const gone of next.slice(0, Math.max(0, next.length - max)))
          bodies.current.delete(gone.id);
        return next.slice(-max);
      });
    },
    [max],
  );

  useImperativeHandle(ref, () => ({ add }), [add]);

  // seed the ambient flock once we know how big the sky is
  // (the ref guard stops React StrictMode's double-run from seeding twice)
  const seeded = useRef(false);
  useEffect(() => {
    const el = container.current;
    if (!el || ambient === null || seeded.current) return;
    seeded.current = true;
    const { clientWidth: w, clientHeight: h } = el;
    // one bird per real crane, but never more than the sky can hold
    // (fewer on narrow screens)
    const room = Math.max(5, Math.round(16 * Math.min(1, w / 1200)));
    const count = Math.min(ambient, room);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      add({
        x: EDGE_MARGIN + Math.random() * (w - EDGE_MARGIN * 2),
        y: EDGE_MARGIN + Math.random() * (h * 0.6),
        vx: Math.cos(angle) * 1.2,
        vy: Math.sin(angle) * 0.5,
        hue: CRANE_HUES[i % CRANE_HUES.length],
        size: 26 + Math.random() * 18,
      });
    }
  }, [ambient, add]);

  // simulation loop — only runs while the footer is on screen
  useEffect(() => {
    const el = container.current;
    if (!el || reduceMotion) return;

    let frame = 0;
    let last = performance.now();
    let visible = false;

    const step = (now: number) => {
      const f = Math.min(3, (now - last) / 16.67); // frame-rate independent, capped after tab switches
      last = now;
      const w = el.clientWidth;
      const h = el.clientHeight;
      const list = [...bodies.current.values()];
      const p = pointer.current;

      for (const b of list) {
        let sepX = 0,
          sepY = 0,
          aliX = 0,
          aliY = 0,
          cohX = 0,
          cohY = 0,
          n = 0;
        for (const o of list) {
          if (o === b) continue;
          const dx = b.x - o.x;
          const dy = b.y - o.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > NEIGHBOUR_RADIUS * NEIGHBOUR_RADIUS) continue;
          n++;
          aliX += o.vx;
          aliY += o.vy;
          cohX += o.x;
          cohY += o.y;
          if (d2 < SEPARATION_RADIUS * SEPARATION_RADIUS && d2 > 0.01) {
            sepX += dx / d2;
            sepY += dy / d2;
          }
        }
        if (n) {
          b.vx += (aliX / n - b.vx) * 0.03 + (cohX / n - b.x) * 0.0005 + sepX * 1.4;
          b.vy += (aliY / n - b.vy) * 0.03 + (cohY / n - b.y) * 0.0005 + sepY * 1.4;
        }

        // the cursor: drawn in from afar, but pushed off up close so they circle it
        if (p?.active) {
          const dx = p.x - b.x;
          const dy = p.y - b.y;
          const d = Math.hypot(dx, dy) || 1;
          const pull = d < 70 ? -0.04 : 0.012;
          b.vx += (dx / d) * pull;
          b.vy += (dy / d) * pull;
        }

        // wander + soft walls
        b.vx += (Math.random() - 0.5) * 0.06;
        b.vy += (Math.random() - 0.5) * 0.06;
        if (b.x < EDGE_MARGIN) b.vx += 0.05;
        if (b.x > w - EDGE_MARGIN) b.vx -= 0.05;
        if (b.y < EDGE_MARGIN) b.vy += 0.05;
        if (b.y > h - EDGE_MARGIN) b.vy -= 0.05;

        const speed = Math.hypot(b.vx, b.vy) || 1;
        const clamped = Math.max(MIN_SPEED, Math.min(MAX_SPEED, speed));
        b.vx = (b.vx / speed) * clamped;
        b.vy = (b.vy / speed) * clamped;
        b.x += b.vx * f;
        b.y += b.vy * f;

        // only turn around once clearly heading the other way (no flicker)
        if (b.vx > 0.25) b.dir = 1;
        else if (b.vx < -0.25) b.dir = -1;
      }

      for (const [id, b] of bodies.current) {
        const node = elements.current.get(id);
        if (node) node.style.transform = transformFor(b);
      }
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) {
        last = performance.now();
        frame = requestAnimationFrame(step);
      }
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [pointer, reduceMotion]);

  return (
    <div ref={container} className="pointer-events-none absolute inset-0" aria-hidden>
      {cranes.map((c) => (
        <div
          key={c.id}
          className="absolute left-0 top-0 will-change-transform"
          style={{ width: c.size, opacity: 0.55 + (c.size - 26) / 50 }} // smaller = farther = fainter
          ref={(node) => {
            if (node) {
              elements.current.set(c.id, node);
              const body = bodies.current.get(c.id);
              if (body) node.style.transform = transformFor(body); // no flash at (0,0)
            } else {
              elements.current.delete(c.id);
            }
          }}
        >
          <OrigamiBird
            flying
            hue={c.hue}
            className="w-full"
            style={
              {
                "--flap-delay": `${c.delay}s`,
                "--flap-duration": `${c.duration}s`,
              } as CSSProperties
            }
          />
        </div>
      ))}
    </div>
  );
}
