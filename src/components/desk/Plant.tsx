import plantImg from "@/assets/desk/plant.webp";
import vaseImg from "@/assets/desk/vase-flower.webp";
import leafImg from "@/assets/desk/leaf.webp";
import { Draggable } from "./Draggable";
import { CutoutImage } from "./CutoutImage";

export function Plant() {
  return (
    <Draggable initial={{ x: 36, y: 368 }} rotate={-1.2} className="w-[170px]">
      <CutoutImage src={plantImg} alt="Monstera plant" className="w-full h-auto pointer-events-none desk-image" draggable={false} />
    </Draggable>
  );
}

export function Vase() {
  return (
    <Draggable initial={{ right: 540, y: 450 }} rotate={0.4} className="w-[120px]">
      <CutoutImage src={vaseImg} alt="Vase with pink flower" className="w-full h-auto pointer-events-none desk-image-soft" draggable={false} />
    </Draggable>
  );
}

export function Leaf({ x, y, rotate, size = 90 }: { x: number; y: number; rotate: number; size?: number }) {
  return (
    <Draggable initial={{ x, y }} rotate={rotate} className="pointer-events-auto">
      <CutoutImage
        src={leafImg}
        alt=""
        style={{ width: size }}
        className="h-auto pointer-events-none opacity-90 desk-image-soft"
        draggable={false}
      />
    </Draggable>
  );
}
