import { Draggable } from "./Draggable";
import { EdgeMattedImage } from "./CutoutImage";
import tablePlantImg from "@/assets/desk/tableplant.webp";

export function TablePlant() {
  return (
    <Draggable initial={{ x: 540, y: 235 }} rotate={-2.1} className="w-[172px]" zIndex={16}>
      <EdgeMattedImage
        src={tablePlantImg}
        alt="Table plant"
        threshold={36}
        feather={16}
        className="w-full h-auto rounded-sm pointer-events-none desk-image-soft"
        style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.18))" }}
        draggable={false}
      />
    </Draggable>
  );
}
