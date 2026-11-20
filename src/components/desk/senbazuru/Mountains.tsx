/**
 * Minimal Japanese-style backdrop: layered ink-wash ridges, a Fuji-like peak
 * with a snow cap, a faint red sun, and a small vermilion arched bridge
 * (taiko-bashi) over a strip of water. Depth comes only from opacity —
 * farther = fainter — like sumi-e washes on paper.
 *
 * Sizing: the box keeps the drawing's own aspect ratio (1440:280), so on wide
 * screens it grows taller instead of cropping the sun off the top. Only below
 * the min-height (phones) does `slice` kick in, trimming the left/right edges
 * — the peak and bridge sit near the middle so they stay in view.
 */
const INK = (alpha: number) => `oklch(0.45 0.02 250 / ${alpha})`;
const VERMILION = (alpha: number) => `oklch(0.6 0.17 32 / ${alpha})`;

// The bridge is two quadratic curves (deck and handrail) joined by posts.
// Point on a quadratic Bézier: (1-t)²·P0 + 2(1-t)t·P1 + t²·P2.
const quad = (p0: number, p1: number, p2: number, t: number) =>
  (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
const DECK = { x: [300, 425, 550], y: [250, 206, 250] };
const RAIL = { x: [306, 425, 544], y: [240, 194, 240] };
const POSTS = [0.08, 0.27, 0.5, 0.73, 0.92].map((t) => ({
  x1: quad(DECK.x[0], DECK.x[1], DECK.x[2], t),
  y1: quad(DECK.y[0], DECK.y[1], DECK.y[2], t),
  x2: quad(RAIL.x[0], RAIL.x[1], RAIL.x[2], t),
  y2: quad(RAIL.y[0], RAIL.y[1], RAIL.y[2], t),
}));

export function Mountains() {
  return (
    <svg
      viewBox="0 0 1440 280"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-0 bottom-0 w-full"
      style={{ aspectRatio: "1440 / 280", minHeight: 170 }}
      aria-hidden
    >
      <defs>
        {/* low mist where the far mountains meet the hills */}
        <linearGradient id="senbazuru-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--background)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--background)" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* sun */}
      <circle cx="1010" cy="74" r="38" fill="oklch(0.68 0.15 25 / 0.22)" />

      {/* far ridge */}
      <path
        d="M0 190 L90 172 L170 182 L260 150 L360 176 L450 160 L540 182 L640 166 L720 184 L820 160 L1100 150 L1200 170 L1300 156 L1440 174 V280 H0 Z"
        fill={INK(0.08)}
      />

      {/* the peak + snow cap (runs down to the ground so its base never shows through the hills) */}
      <path
        d="M620 280 C760 232 850 140 902 104 L950 104 C1002 140 1092 232 1232 280 Z"
        fill={INK(0.15)}
      />
      <path
        d="M902 104 L950 104 C962 112 974 121 986 131 L970 127 L956 138 L942 125 L926 137 L912 125 L890 132 C894 122 898 113 902 104 Z"
        fill="oklch(0.985 0.004 85 / 0.95)"
      />

      <rect x="0" y="190" width="1440" height="60" fill="url(#senbazuru-mist)" />

      {/* rolling middle hills */}
      <path
        d="M0 226 C140 196 260 200 380 218 C500 236 600 206 740 222 C880 238 980 226 1100 232 C1220 238 1330 214 1440 220 V280 H0 Z"
        fill={INK(0.11)}
      />

      {/* nearest hills, with a single brush-like ink line on the crest */}
      <path
        d="M0 258 C200 240 380 252 560 246 C760 240 940 258 1140 250 C1280 245 1380 250 1440 248 V280 H0 Z"
        fill={INK(0.1)}
        stroke={INK(0.3)}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />

      {/* water under the bridge */}
      <path
        d="M240 266 C320 254 530 254 610 266 C530 277 320 277 240 266 Z"
        fill="oklch(0.72 0.04 230 / 0.22)"
      />
      <path
        d="M330 268 H380 M450 271 H520 M395 275 H430"
        stroke="oklch(0.6 0.04 230 / 0.35)"
        strokeWidth="1"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* arched bridge */}
      <g stroke={VERMILION(0.8)} strokeLinecap="round" fill="none">
        <path
          d={`M${DECK.x[0]} ${DECK.y[0]} Q${DECK.x[1]} ${DECK.y[1]} ${DECK.x[2]} ${DECK.y[2]}`}
          strokeWidth="5"
        />
        <path
          d={`M${RAIL.x[0]} ${RAIL.y[0]} Q${RAIL.x[1]} ${RAIL.y[1]} ${RAIL.x[2]} ${RAIL.y[2]}`}
          strokeWidth="2"
        />
        {POSTS.map((p, i) => (
          <line key={i} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} strokeWidth="2" />
        ))}
        {/* legs down into the water */}
        <path d="M318 245 V264 M532 245 V264" strokeWidth="3" />
      </g>
    </svg>
  );
}
