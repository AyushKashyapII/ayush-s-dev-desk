import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Draggable } from "./Draggable";
import tornPaper from "@/assets/desk/torn-paper.webp";

const RESPONSE = {
  name: "Ayush Kashyap",
  role: "Software Engineer",
  location: "India",
  skills: ["TypeScript", "Go", "C++", "Distributed Systems"],
  interests: ["Compilers", "Lofi", "Football", "Mech Keyboards"],
  status: "shipping",
};

export function CurlPanel() {
  const [shown, setShown] = useState(false);

  return (
    <Draggable initial={{ x: 290, y: 870 }} rotate={0.8} className="w-[360px]">
      <div className="relative" style={{ filter: "drop-shadow(0 10px 16px rgba(60,40,20,0.18))" }}>
        {/* torn paper decorative top */}
        <img
          src={tornPaper}
          alt=""
          className="absolute -top-3 left-0 right-0 w-full pointer-events-none opacity-90"
          draggable={false}
        />
        <div className="relative bg-paper-warm rounded-sm pt-5 pb-4 px-5 font-mono text-[12.5px]">
          <div className="text-center border-b border-dashed border-border pb-2 mb-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">api · receipt</p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">— ayush.dev/about —</p>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-terminal-green">$</span>
            <code className="text-foreground/90">curl ayush.dev/about</code>
            <button
              onClick={() => setShown((s) => !s)}
              className="ml-auto text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-primary/15 text-primary border border-primary/30 transition"
            >
              {shown ? "Reset" : "Run"}
            </button>
          </div>
          <div className="min-h-[170px] text-[12px] leading-[1.65] text-foreground/85">
            <AnimatePresence mode="wait">
              {!shown ? (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-muted-foreground/60 italic"
                >
                  // hit Run to send the request…
                </motion.div>
              ) : (
                <motion.pre
                  key="json"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                  className="whitespace-pre-wrap"
                >
{`{
  "name": `}<span className="text-primary">"{RESPONSE.name}"</span>{`,
  "role": `}<span className="text-primary">"{RESPONSE.role}"</span>{`,
  "location": `}<span className="text-primary">"{RESPONSE.location}"</span>{`,
  "skills": [`}{RESPONSE.skills.map((s, i) => (
    <span key={s}><span className="text-foreground font-medium">"{s}"</span>{i < RESPONSE.skills.length - 1 && ", "}</span>
  ))}{`],
  "interests": [`}{RESPONSE.interests.map((s, i) => (
    <span key={s}><span className="text-foreground font-medium">"{s}"</span>{i < RESPONSE.interests.length - 1 && ", "}</span>
  ))}{`],
  "status": `}<span className="text-terminal-green">"{RESPONSE.status}"</span>{`
}`}
                </motion.pre>
              )}
            </AnimatePresence>
          </div>
          <div className="border-t border-dashed border-border mt-3 pt-2 text-center">
            <p className="text-[10px] text-muted-foreground/70">200 OK · application/json · 42ms</p>
          </div>
        </div>
        {/* torn paper decorative bottom */}
        <img
          src={tornPaper}
          alt=""
          className="absolute -bottom-3 left-0 right-0 w-full pointer-events-none opacity-90 scale-y-[-1]"
          draggable={false}
        />
      </div>
    </Draggable>
  );
}
