import { useEffect, useRef, useState } from "react";
import { Draggable } from "./Draggable";

type Line = { kind: "in" | "out" | "sys"; text: string };

const HELP = `Available commands:
  help        — show this menu
  about       — who I am
  projects    — list projects
  skills      — tech I work with
  contact     — how to reach me
  play        — launch snake game
  clear       — wipe the screen`;

const PROJECTS = `• bittorrent-go      — peer-to-peer client (Go)
• chess-engine       — bitboard engine + UCI (C++)
• desk-os            — this portfolio (React + TS)
• vibe-coder         — lofi pomodoro PWA`;

const SKILLS = `Languages : TypeScript · Go · C++ · Python · Rust
Systems   : Distributed · Networking · Compilers
Frontend  : React · TanStack · Tailwind · Three.js
Backend   : Node · Postgres · Redis · gRPC`;

const CONTACT = `email   : ayush@kashyap.dev
github  : github.com/ayushkashyap
x       : @ayushbuilds
site    : ayush.dev`;

const ABOUT = `Engineer. Tinkerer. Late-night shipper.
Currently building developer-first tooling.`;

const WHOAMI = `Software Engineer with 4+ years experience
Currently shipping developer-first tooling.`;

interface TerminalProps {
  onPlay: () => void;
}

export function Terminal({ onPlay }: TerminalProps) {
  const [history, setHistory] = useState<Line[]>([
    { kind: "in",  text: "whoami" },
    { kind: "out", text: WHOAMI },
    { kind: "in",  text: "ls interests/" },
    { kind: "out", text: "AI/  designs/  doodles/  photography/" },
    { kind: "sys", text: "type 'help' to begin" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const out: Line[] = [{ kind: "in", text: raw }];
    switch (cmd) {
      case "":
        break;
      case "help": out.push({ kind: "out", text: HELP }); break;
      case "about": case "whoami": out.push({ kind: "out", text: ABOUT }); break;
      case "projects": out.push({ kind: "out", text: PROJECTS }); break;
      case "skills": out.push({ kind: "out", text: SKILLS }); break;
      case "contact": out.push({ kind: "out", text: CONTACT }); break;
      case "play":
        out.push({ kind: "out", text: "→ launching snake.exe" });
        onPlay();
        break;
      case "clear":
        setHistory([]);
        return;
      default:
        out.push({ kind: "out", text: `command not found: ${cmd} — try 'help'` });
    }
    setHistory((h) => [...h, ...out]);
  };

  return (
    <Draggable initial={{ x: 430, y: 940 }} rotate={-0.7} className="w-[440px] max-w-[92vw]">
      <div className="rounded-lg overflow-hidden bg-paper" style={{ boxShadow: "var(--shadow-lift)", border: "1px solid var(--border)" }}>
        {/* macOS title bar */}
        <div className="flex items-center gap-2 px-3.5 py-2 border-b border-border bg-[oklch(0.96_0.005_75)]">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[oklch(0.74_0.16_25)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.85_0.14_85)]" />
            <span className="h-3 w-3 rounded-full bg-[oklch(0.78_0.13_150)]" />
          </div>
          <div className="flex-1 text-center text-[11px] font-mono text-muted-foreground">
            ayush — zsh
          </div>
          <div className="w-12" />
        </div>
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="bg-paper font-mono text-[12.5px] leading-relaxed p-4 h-[260px] overflow-y-auto no-scrollbar cursor-text text-foreground/85"
        >
          {history.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {l.kind === "in" && (
                <span><span className="text-terminal-green">~</span>{" "}<span className="text-primary">$</span>{" "}<span className="text-foreground">{l.text}</span></span>
              )}
              {l.kind === "out" && <span className="text-foreground/80">{l.text}</span>}
              {l.kind === "sys" && <span className="text-muted-foreground italic">{l.text}</span>}
            </div>
          ))}
          <form
            onSubmit={(e) => { e.preventDefault(); run(input); setInput(""); }}
            className="flex items-center gap-2 mt-1"
          >
            <span className="text-terminal-green">~</span>
            <span className="text-primary">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-transparent outline-none border-none text-foreground placeholder:text-muted-foreground/50"
              placeholder="type a command…"
            />
          </form>
        </div>
      </div>
    </Draggable>
  );
}
