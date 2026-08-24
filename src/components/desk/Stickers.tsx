import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Draggable } from "./Draggable";
//import flower from "@/assets/desk/sticker-flower.webp";
import laptop from "@/assets/desk/sticker-laptop.webp";
import books from "@/assets/desk/sticker-books.webp";
import folderOpenImg from "@/assets/desk/folderopen.webp";
import folderCloseImg from "@/assets/desk/folderclose.webp";
import { CutoutImage } from "./CutoutImage";

type PanelType = "laptop" | "books" | null;

export function Stickers() {
  const [folderOpen, setFolderOpen] = useState(false);
  const [panel, setPanel] = useState<PanelType>(null);

  return (
    <>
      {/* <Draggable initial={{ x: 520, y: 250 }} rotate={-8} className="pointer-events-auto">
        <CutoutImage
          src={flower}
          alt="flower sticker"
          style={{ width: 80 }}
          className="h-auto pointer-events-none desk-image-soft drop-shadow-[0_3px_5px_rgba(0,0,0,0.1)]"
          draggable={false}
        />
      </Draggable> */}

      <Draggable initial={{ x: 610, y: 598 }} rotate={6} className="pointer-events-auto">
        <div
          onMouseEnter={() => setFolderOpen(true)}
          onMouseLeave={() => setFolderOpen(false)}
          className="relative"
        >
          <CutoutImage
            src={folderOpen ? folderOpenImg : folderCloseImg}
            alt="folder sticker"
            style={{ width: 88 }}
            className="h-auto desk-image-soft drop-shadow-[0_3px_5px_rgba(0,0,0,0.1)]"
            draggable={false}
          />

          <motion.button
            type="button"
            onClick={() => setPanel("laptop")}
            animate={{ opacity: folderOpen ? 1 : 0, y: folderOpen ? -56 : -26, x: folderOpen ? 66 : 42, scale: folderOpen ? 1 : 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{ pointerEvents: folderOpen ? "auto" : "none" }}
          >
            <CutoutImage
              src={laptop}
              alt="laptop token"
              style={{ width: 72 }}
              className="h-auto desk-image-soft drop-shadow-[0_3px_5px_rgba(0,0,0,0.15)]"
              draggable={false}
            />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setPanel("books")}
            animate={{ opacity: folderOpen ? 1 : 0, y: folderOpen ? 20 : -4, x: folderOpen ? -70 : -40, scale: folderOpen ? 1 : 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{ pointerEvents: folderOpen ? "auto" : "none" }}
          >
            <CutoutImage
              src={books}
              alt="books token"
              style={{ width: 66 }}
              className="h-auto desk-image-soft drop-shadow-[0_3px_5px_rgba(0,0,0,0.15)]"
              draggable={false}
            />
          </motion.button>
        </div>
      </Draggable>

      <AnimatePresence>
        {panel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPanel(null)}
            className="fixed inset-0 z-[9999] bg-foreground/30 backdrop-blur-[2px] grid place-items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl rounded-lg border border-border bg-paper p-6"
              style={{ boxShadow: "var(--shadow-lift)" }}
            >
              {panel === "laptop" ? (
                <>
                  <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Current Laptop Specs</p>
                  <h3 className="mt-2 handwritten text-4xl text-foreground">My Setup</h3>
                  <div className="mt-4 space-y-2 text-sm text-foreground/80">
                    <p><strong>CPU:</strong> Apple M2 Pro / Intel i7 class</p>
                    <p><strong>RAM:</strong> 16-32GB</p>
                    <p><strong>Storage:</strong> 1TB SSD</p>
                    <p><strong>Primary Work:</strong> TypeScript, React, systems code, design tooling</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Books & Notes</p>
                  <h3 className="mt-2 handwritten text-4xl text-foreground">What I Read</h3>
                  <div className="mt-4 space-y-3 text-sm text-foreground/80">
                    <p><strong>Atomic Habits</strong> — Practical systems beat motivation.</p>
                    <p><strong>Deep Work</strong> — Focus is a career superpower.</p>
                    <p><strong>Clean Code</strong> — Readability pays compounding returns.</p>
                    <p><strong>The Pragmatic Programmer</strong> — Think in tools and feedback loops.</p>
                  </div>
                </>
              )}
              <button
                onClick={() => setPanel(null)}
                className="mt-6 text-xs font-mono text-foreground/60"
              >
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
