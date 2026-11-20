import { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { BIRD_FACETS, birdColor } from "../birdGeometry";

/**
 * A square sheet of paper that folds itself into the origami crane.
 *
 * Every face of the finished crane is a triangle (see BIRD_FACETS). We give each
 * of those triangles two earlier shapes:
 *   stage 0 FLAT — a piece of a flat square sheet
 *   stage 1 BASE — that piece after the sheet is turned 45° and squeezed into a
 *                  tall diamond (roughly the origami "bird base")
 *   stage 2      — its final position in the crane
 * and interpolate vertex-by-vertex between them. Because vertex k of a stage
 * maps to vertex k of the next, a corner of the paper visibly swings into a
 * wing tip, the neck, the tail, and so on.
 *
 * Interpolating 11 polygons at 60fps through React state would re-render the
 * whole tree every frame, so `animate` drives a plain number and we write the
 * `points` / `fill` attributes straight onto the DOM nodes.
 */

type Pt = [number, number];
const parse = (s: string): Pt[] => s.split(" ").map((p) => p.split(",").map(Number) as Pt);

const FINAL: Pt[][] = BIRD_FACETS.map((f) => parse(f.points));

// Square sheet centred on (60,45), side 64. Same order as BIRD_FACETS:
// far wing ×2, tail ×2, belly ×2, neck ×2, head, near wing ×2.
const FLAT: Pt[][] = [
  [
    [60, 45],
    [60, 13],
    [28, 13],
  ],
  [
    [60, 45],
    [28, 45],
    [28, 13],
  ],
  [
    [28, 77],
    [60, 45],
    [28, 45],
  ],
  [
    [28, 77],
    [60, 45],
    [60, 77],
  ],
  [
    [60, 45],
    [92, 77],
    [60, 77],
  ],
  [
    [60, 45],
    [92, 45],
    [92, 77],
  ],
  [
    [60, 45],
    [92, 45],
    [92, 13],
  ],
  [
    [76, 45],
    [92, 45],
    [92, 13],
  ],
  [
    [88, 17],
    [92, 13],
    [86, 13],
  ],
  [
    [28, 45],
    [60, 45],
    [60, 13],
  ],
  [
    [60, 45],
    [92, 13],
    [60, 13],
  ],
];

// Rotate the sheet 45° about its centre, then squeeze it into a tall diamond.
const BASE: Pt[][] = FLAT.map((tri) =>
  tri.map(([x, y]) => {
    const dx = x - 60;
    const dy = y - 45;
    const rx = (dx - dy) * Math.SQRT1_2;
    const ry = (dx + dy) * Math.SQRT1_2;
    return [60 + rx * 0.45, 45 + ry * 1.1] as Pt;
  }),
);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Lightness/chroma per stage: flat paper is one even tone, creases appear at the base. */
function shade(i: number, stage: 0 | 1 | 2) {
  if (stage === 0) return { l: 0.8, ch: 0.1 };
  if (stage === 1) return { l: i % 2 ? 0.66 : 0.8, ch: 0.13 };
  return BIRD_FACETS[i];
}

export const FOLD_SECONDS = 1.6;
/** the fold plays this many times bigger than the flock bird, then shrinks into it */
const FOLD_SCALE = 2.2;
/** share of FOLD_SECONDS spent folding; the rest is the shrink */
const FOLD_SHARE = 0.75;

export function FoldingCrane({
  x,
  y,
  size,
  hue,
  onDone,
}: {
  /** centre of the crane, px, relative to the positioned parent */
  x: number;
  y: number;
  /** width in px — matches the flock bird it turns into */
  size: number;
  hue: number;
  onDone: () => void;
}) {
  const polys = useRef<(SVGPolygonElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  // keep the latest callback without restarting the animation when it changes
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    // v runs 0 → 2: 0..1 is FLAT → BASE, 1..2 is BASE → FINAL
    const draw = (v: number) => {
      const firstHalf = v <= 1;
      const t = firstHalf ? v : v - 1;
      FINAL.forEach((final, i) => {
        const el = polys.current[i];
        if (!el) return;
        const from = firstHalf ? FLAT[i] : BASE[i];
        const to = firstHalf ? BASE[i] : final;
        el.setAttribute(
          "points",
          from.map((p, k) => `${lerp(p[0], to[k][0], t)},${lerp(p[1], to[k][1], t)}`).join(" "),
        );
        const a = shade(i, firstHalf ? 0 : 1);
        const b = shade(i, firstHalf ? 1 : 2);
        el.setAttribute("fill", birdColor(hue, lerp(a.l, b.l, t), lerp(a.ch, b.ch, t)));
      });
    };

    if (reduceMotion) {
      draw(2);
      onDoneRef.current();
      return;
    }

    draw(0);
    const controls = animate(0, 2, {
      duration: FOLD_SECONDS * FOLD_SHARE,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: draw,
    });
    return () => controls.stop();
  }, [hue, reduceMotion]);

  const big = size * FOLD_SCALE;

  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0"
      style={{
        width: big,
        x: x - big / 2,
        y: y - big * 0.375, // viewBox is 120×90, so half the height is 0.375 × width
        transformPerspective: 600,
        filter: "drop-shadow(0 6px 8px rgba(60,40,30,0.2))",
      }}
      // the sheet pops in, flips over once (paper has two sides), settles, then
      // shrinks to flock size — at which point the flock bird takes its place
      initial={{ scale: 0.6, rotateY: 0, rotate: -20, opacity: 0 }}
      animate={{
        scale: [0.6, 1.06, 1, 1 / FOLD_SCALE],
        rotateY: [0, 180, 360, 360],
        rotate: [-20, 6, 0, 0],
        opacity: 1,
      }}
      transition={{
        duration: FOLD_SECONDS,
        times: [0, FOLD_SHARE * 0.5, FOLD_SHARE, 1],
        ease: "easeInOut",
        opacity: { duration: 0.15 },
      }}
      onAnimationComplete={() => onDoneRef.current()}
      aria-hidden
    >
      <svg viewBox="0 0 120 90" className="w-full overflow-visible">
        <g strokeLinejoin="round" stroke={birdColor(hue, 0.32, 0.1, 0.35)} strokeWidth="0.5">
          {FINAL.map((_, i) => (
            <polygon
              key={i}
              ref={(el) => {
                polys.current[i] = el;
              }}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
}
