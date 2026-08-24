import { Draggable } from "./Draggable";
import tokyoImg from "@/assets/desk/tokyo.webp";
import coffeeImg from "@/assets/desk/coffee.webp";
import libertyImg from "@/assets/desk/liberty.webp";

function PolaroidFrame({ src, alt, width }: { src: string; alt: string; width: number }) {
  return (
    <div
      className="relative rounded-[2px] bg-[oklch(0.99_0.005_90)] pt-2 px-2 pb-8"
      style={{
        width,
        boxShadow:
          "0 10px 22px rgba(0,0,0,0.22), 0 1px 0 oklch(0 0 0 / 0.04), inset 0 0 0 1px oklch(0.9 0.01 85)",
      }}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-[1px]">
        <img
          src={src}
          alt={alt}
          className="h-full w-full rounded-[1px] object-cover pointer-events-none desk-image"
          draggable={false}
        />
      </div>
      <span
        className="absolute -top-0.5 left-1/2 h-3 w-9 -translate-x-1/2 rotate-[-5deg]"
        style={{
          background: "oklch(0.93 0.02 82 / 0.82)",
          border: "1px solid oklch(0.78 0.03 80 / 0.45)",
        }}
        aria-hidden
      />
    </div>
  );
}

type ExtraPhotoPolaroid = {
  display: "polaroid";
  id: string;
  src: string;
  alt: string;
  initial: { x?: number; y?: number; right?: number | string; left?: number | string };
  rotate: number;
  z: number;
  w: number;
};

type ExtraPhotoPlain = {
  display: "plain";
  id: string;
  src: string;
  alt: string;
  initial: { x?: number; y?: number; right?: number | string; left?: number | string };
  rotate: number;
  z: number;
  w: number;
};

const EXTRA_PHOTOS: ReadonlyArray<ExtraPhotoPolaroid | ExtraPhotoPlain> = [
  {
    display: "polaroid",
    id: "tokyo",
    src: tokyoImg,
    alt: "Tokyo streets",
    initial: { x: 450, y: 150 },
    rotate: -4.1,
    z: 12,
    w: 152,
  },
  {
    display: "plain",
    id: "coffee",
    src: coffeeImg,
    alt: "Coffee cup",
    initial: { x: 740, y: 200 },
    rotate: -3.1,
    z: 18,
    w: 108,
  },
  {
    display: "plain",
    id: "liberty",
    src: libertyImg,
    alt: "Statue of Liberty",
    initial: { x: 1070, y: -30 },
    rotate: 3.4,
    z: 25,
    w: 280,
  },
];

export function DeskExtraPhotos() {
  return (
    <>
      {EXTRA_PHOTOS.map((p) => (
        <Draggable key={p.id} initial={p.initial} rotate={p.rotate} zIndex={p.z} className="pointer-events-auto">
          <div style={{ width: p.w }}>
            {p.display === "plain" ? (
              <img
                src={p.src}
                alt={p.alt}
                className="w-full h-auto rounded-sm pointer-events-none desk-image-soft"
                style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.2))" }}
                draggable={false}
              />
            ) : (
              <PolaroidFrame src={p.src} alt={p.alt} width={p.w} />
            )}
          </div>
        </Draggable>
      ))}
    </>
  );
}
