import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Draggable } from "./Draggable";
import { FOOTBALL_HIGHLIGHTS } from "@/data/footballHighlights";
import tvImg from "@/assets/desk/tv.jpg";
import { CutoutImage } from "./CutoutImage";

export function FootballTV() {
  const [active, setActive] = useState(FOOTBALL_HIGHLIGHTS[0]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Draggable initial={{ x: 1020, y: 790 }} rotate={-1.2} className="w-[120px] pointer-events-auto">
        <button type="button" onClick={() => setOpen(true)} className="block">
          <motion.div layoutId="football-tv" className="relative">
            <CutoutImage
              src={tvImg}
              alt="Vintage TV"
              className="w-full h-auto desk-image-soft"
              draggable={false}
              style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.2))" }}
            />
            <p
              className="absolute left-[41%] top-[46%] -translate-x-1/2 -translate-y-1/2 font-black tracking-wide"
              style={{ fontSize: 8 }}
            >
              <span style={{ color: "#1d4ed8" }}>Forca</span>{" "}
              <span style={{ color: "#dc2626" }}>Barca</span>
              <span style={{ color: "#facc15" }}>!</span>
            </p>
          </motion.div>
        </button>
      </Draggable>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9999] bg-foreground/45 backdrop-blur-[2px] grid place-items-center p-4"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[860px] rounded-xl border border-border bg-paper p-4"
              style={{ boxShadow: "var(--shadow-lift)" }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Messi Highlights TV</p>
                <button type="button" className="font-mono text-xs text-foreground/60" onClick={() => setOpen(false)}>
                  close
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.15fr_1fr]">
                <motion.div layoutId="football-tv" className="relative overflow-hidden rounded-lg border border-border bg-muted/30 p-3">
                  <CutoutImage src={tvImg} alt="Vintage TV enlarged" className="w-full h-auto" draggable={false} />
                  <p
                    className="absolute left-[31%] top-[30%] -translate-x-1/2 -translate-y-1/2 font-black tracking-wide"
                    style={{ fontSize: 22 }}
                  >
                    <span style={{ color: "#1d4ed8" }}>Forca</span>{" "}
                    <span style={{ color: "#dc2626" }}>Barca</span>
                    <span style={{ color: "#facc15" }}>!</span>
                  </p>
                  <div className="mt-3 rounded-md border border-foreground/12 bg-black/70 p-3 text-white">
                    <p className="font-mono text-[12px]">{active.game}</p>
                    <p className="mt-1 font-mono text-[12px] text-emerald-300">Score: {active.score}</p>
                    <p className="mt-1 text-[12px] text-white/85">{active.scorers}</p>
                    <a
                      href={active.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block rounded-sm border border-white/35 bg-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </motion.div>

                <div className="rounded-lg border border-border bg-paper-warm p-2.5">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Hover a match</p>
                  <div className="max-h-[390px] space-y-1 overflow-y-auto no-scrollbar pr-1">
                    {FOOTBALL_HIGHLIGHTS.map((item) => (
                      <div
                        key={item.game}
                        onMouseEnter={() => setActive(item)}
                        className="rounded px-2 py-1 text-[11px] text-foreground/80 transition"
                        style={{
                          background: item.game === active.game ? "oklch(0.9 0.02 85 / 0.45)" : "transparent",
                          border: item.game === active.game ? "1px solid oklch(0.76 0.03 85 / 0.35)" : "1px solid transparent",
                        }}
                      >
                        {item.game}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
