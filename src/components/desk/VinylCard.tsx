import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { Draggable } from "./Draggable";
import { CutoutImage } from "./CutoutImage";
import vinyl from "@/assets/desk/record.webp";

const TRACK = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3";

export function VinylCard() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio(TRACK);
    a.loop = true;
    a.volume = 0.45;
    audioRef.current = a;
    return () => { a.pause(); };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setPlaying(!playing);
  };

  return (
    <Draggable initial={{ x: 40, y: 480 }} rotate={-2.2} className="w-[200px]">
      <div
        className="relative bg-paper rounded-md p-5 pt-6 pb-5"
        style={{ boxShadow: "var(--shadow-lift)", border: "1px solid var(--border)" }}
      >
        <div className="relative mx-auto w-[150px] h-[150px]">
          <CutoutImage
            src={vinyl}
            alt="Vinyl record"
            className={`w-full h-full pointer-events-none desk-image ${playing ? "spin-slow" : ""}`}
            draggable={false}
          />
          <button
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="absolute -right-1 -bottom-1 h-11 w-11 rounded-full bg-paper border border-border grid place-items-center transition"
            style={{ boxShadow: "var(--shadow-paper)" }}
          >
            {playing ? <Pause className="h-4 w-4 text-foreground" /> : <Play className="h-4 w-4 text-foreground translate-x-0.5" />}
          </button>
        </div>
        <div className="mt-4 text-center">
          {/* <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">Playlist</p> */}
          <p className="handwritten text-3xl text-foreground leading-none mt-1">Welcome</p>
          {/* <p className="text-xs text-muted-foreground mt-1">21 projects and counting</p>
          <p className="text-[11px] italic text-muted-foreground/70 mt-0.5">learning by building</p> */}
        </div>
      </div>
    </Draggable>
  );
}
