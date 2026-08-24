import { Draggable } from "./Draggable";
import polaroid1 from "@/assets/desk/Polaroid.webp";
import polaroid2 from "@/assets/desk/Polaroid2.webp";
import polaroid3 from "@/assets/desk/Polaroid3.webp";
import polaroid4 from "@/assets/desk/Polaroid4.webp";

const POLAROIDS = [
  { src: polaroid1, alt: "polaroid image 1", x: -4, y: 6, r: -5, z: 4, w: 188 },
  { src: polaroid2, alt: "polaroid image 2", x: 164, y: 8, r: 4, z: 5, w: 138 },
  { src: polaroid3, alt: "polaroid image 3", x: 26, y: 165, r: 7, z: 6, w: 148 },
  { src: polaroid4, alt: "polaroid image 4", x: 184, y: 176, r: -6, z: 7, w: 138 },
];

export function Moodboard() {
  return (
    <Draggable initial={{ right: 120, y: 92 }} rotate={0.8} className="w-[372px]" zIndex={16}>
      {/* Cork board */}
      <div
        className="relative rounded-md p-4 pb-10"
        style={{
          width: 372,
          height: 372,
          background:
            "radial-gradient(circle at 30% 20%, oklch(0.72 0.08 65) 0%, oklch(0.6 0.09 60) 70%)",
          boxShadow: "var(--shadow-lift), inset 0 0 30px oklch(0 0 0 / 0.1)",
          backgroundImage:
            "radial-gradient(oklch(0.45 0.06 50 / 0.18) 1px, transparent 1.5px), radial-gradient(oklch(0.85 0.04 70 / 0.4) 1px, transparent 1.5px)",
          backgroundSize: "5px 5px, 8px 8px",
          backgroundPosition: "0 0, 2px 2px",
          backgroundColor: "oklch(0.68 0.08 60)",
        }}
      >
        {/* Polaroids */}
        {POLAROIDS.map((p) => (
          <div
            key={p.alt}
            className="absolute"
            style={{
              left: p.x,
              top: p.y,
              transform: `rotate(${p.r}deg)`,
              zIndex: p.z,
              width: p.w ?? 130,
              filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.25))",
            }}
          >
            <img src={p.src} alt={p.alt} className="w-full h-auto pointer-events-none desk-image" draggable={false} />
            {/* tape */}
            <span
              className="absolute -top-1 left-1/2 -translate-x-1/2 rotate-[-6deg]"
              style={{
                width: 40,
                height: 14,
                background: "oklch(0.92 0.02 80 / 0.7)",
                border: "1px solid oklch(0.75 0.03 80 / 0.4)",
              }}
            />
          </div>
        ))}

        {/* handwritten label */}
        {/* <p
          className="handwritten absolute right-4 bottom-2 text-2xl text-foreground/80"
          style={{ zIndex: 10 }}
        >
          capture moments
        </p> */}
      </div>
    </Draggable>
  );
}
