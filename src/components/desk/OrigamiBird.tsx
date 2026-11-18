import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Flat-shaded origami bird drawn as SVG facets.
 *
 * How the flap works: each wing is its own <g> whose transform-origin is pinned
 * to the bottom edge of its bounding box (the fold line along the bird's back,
 * y = 61 in the viewBox). Animating scaleY around that line looks like the wing
 * rotating about the fold — a cheap 2D stand-in for rotateX, which SVG children
 * don't support reliably across browsers. See `.origami-*` rules in styles.css.
 *
 * `flying` switches to a fast, deep flap (wings swing below the body) and hides
 * the contact shadow.
 */

// One hue, different lightness per facet: faces turned toward the light are
// lighter, faces turned away are darker. Change HUE to recolour the whole bird.
const HUE = 25; // red
const c = (l: number, ch: number, alpha?: number) =>
  `oklch(${l} ${ch} ${HUE}${alpha !== undefined ? ` / ${alpha}` : ""})`;

export function OrigamiBird({
  className,
  flying = false,
}: {
  className?: string;
  flying?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 90"
      className={cn("origami-bird overflow-visible", className)}
      data-flying={flying ? "true" : undefined}
      role="img"
      aria-label="Origami paper bird"
    >
      {!flying && <ellipse cx="62" cy="86" rx="16" ry="2.2" fill={c(0.3, 0.05, 0.16)} />}

      <g
        className="origami-body"
        strokeLinejoin="round"
        stroke={c(0.32, 0.1, 0.35)}
        strokeWidth="0.5"
      >
        {/* far wing — sits behind the body, darker because it faces away */}
        <g className="origami-wing-far">
          <polygon points="52,61 74,61 40,8" fill={c(0.45, 0.15)} />
          <polygon points="52,61 60,61 40,8" fill={c(0.4, 0.14)} />
        </g>

        {/* tail */}
        <polygon points="6,38 46,61 52,66" fill={c(0.66, 0.17)} />
        <polygon points="6,38 52,66 56,72" fill={c(0.5, 0.16)} />

        {/* body / belly */}
        <polygon points="46,61 80,61 62,84" fill={c(0.58, 0.18)} />
        <polygon points="46,61 62,84 56,72" fill={c(0.48, 0.16)} />

        {/* neck + head */}
        <polygon points="72,61 82,61 100,28" fill={c(0.56, 0.18)} />
        <polygon points="78,61 82,61 100,28" fill={c(0.46, 0.16)} />
        <polygon points="100,28 113,35 98,33" fill={c(0.5, 0.17)} />

        {/* near wing — two facets split by the centre crease */}
        <g className="origami-wing-near">
          <polygon points="48,61 63,61 67,4" fill={c(0.7, 0.16)} />
          <polygon points="63,61 78,61 67,4" fill={c(0.6, 0.18)} />
          {/* darkens as the wing tilts away from the light */}
          <polygon className="origami-wing-shade" points="48,61 78,61 67,4" fill={c(0.25, 0.08)} />
        </g>
      </g>
    </svg>
  );
}

/**
 * Hovers in place: wings in the flying stroke, whole bird bobbing gently.
 * The bob is slower than the wingbeat (2.4s vs 0.7s) so the motion never
 * looks mechanically in sync.
 */
export function HoveringOrigamiBird({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [-3, 2, -3] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <OrigamiBird flying className="w-full" />
    </motion.div>
  );
}

/**
 * Glides into place from the lower-left the first time it scrolls into view —
 * continuing the exit path of the intro bird — then keeps hovering.
 * Outer div = one-off entrance, inner HoveringOrigamiBird = endless idle;
 * splitting them keeps the two animations from fighting over `y`.
 */
export function FlyInOrigamiBird({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <OrigamiBird className={className} />;

  return (
    <motion.div
      className={className}
      initial={{ x: -140, y: 90, rotate: -14, scale: 0.8, opacity: 0 }}
      whileInView={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <HoveringOrigamiBird className="w-full" />
    </motion.div>
  );
}
