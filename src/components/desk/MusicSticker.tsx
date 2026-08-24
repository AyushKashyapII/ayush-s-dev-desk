import { Draggable } from "./Draggable";
import musicImg from "@/assets/desk/music.webp";

export function MusicSticker() {
  return (
    <Draggable initial={{ x: 890, y: 140 }} rotate={-7.5} className="w-[118px]" zIndex={15}>
      <img
        src={musicImg}
        alt="Music"
        className="w-full h-auto pointer-events-none desk-image-soft"
        style={{ filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.16))" }}
        draggable={false}
      />
    </Draggable>
  );
}
