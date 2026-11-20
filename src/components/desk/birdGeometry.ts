/**
 * Shape + colour data for the origami bird, shared by OrigamiBird (static /
 * flapping) and FoldingCrane (folds a square sheet into exactly these faces).
 * Lives outside the component files so React fast refresh keeps working.
 */

// One hue, different lightness per facet: faces turned toward the light are
// lighter, faces turned away are darker. Change DEFAULT_HUE to recolour the bird.
export const DEFAULT_HUE = 25; // red
export const birdColor = (hue: number, l: number, ch: number, alpha?: number) =>
  `oklch(${l} ${ch} ${hue}${alpha !== undefined ? ` / ${alpha}` : ""})`;

/** One flat face of the folded paper: a triangle plus its lightness/chroma. */
export type Facet = { points: string; l: number; ch: number };

// far wing — sits behind the body, darker because it faces away
export const FAR_WING: Facet[] = [
  { points: "52,61 74,61 40,8", l: 0.45, ch: 0.15 },
  { points: "52,61 60,61 40,8", l: 0.4, ch: 0.14 },
];
export const BODY: Facet[] = [
  { points: "6,38 46,61 52,66", l: 0.66, ch: 0.17 }, // tail
  { points: "6,38 52,66 56,72", l: 0.5, ch: 0.16 },
  { points: "46,61 80,61 62,84", l: 0.58, ch: 0.18 }, // belly
  { points: "46,61 62,84 56,72", l: 0.48, ch: 0.16 },
  { points: "72,61 82,61 100,28", l: 0.56, ch: 0.18 }, // neck
  { points: "78,61 82,61 100,28", l: 0.46, ch: 0.16 },
  { points: "100,28 113,35 98,33", l: 0.5, ch: 0.17 }, // head
];
// near wing — two facets split by the centre crease
export const NEAR_WING: Facet[] = [
  { points: "48,61 63,61 67,4", l: 0.7, ch: 0.16 },
  { points: "63,61 78,61 67,4", l: 0.6, ch: 0.18 },
];
/** All faces in paint order (back to front). FoldingCrane morphs into exactly these. */
export const BIRD_FACETS: Facet[] = [...FAR_WING, ...BODY, ...NEAR_WING];

/** Paper colours for the senbazuru flock. */
export const CRANE_HUES = [25, 145, 250, 85, 340, 55, 195, 290];
