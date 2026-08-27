import { useState, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Crown,
  FileText,
  Folder,
  Gamepad2,
  GitBranch,
  History,
  Mail,
  Network,
  Star,
  Terminal,
  Twitter,
  Github,
  Linkedin,
  type LucideIcon,
} from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiCplusplus,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiGit,
  SiGo,
  SiJavascript,
  SiLangchain,
  SiNextdotjs,
  SiNodedotjs,
  SiOpencv,
  SiPytorch,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiTensorflow,
  SiTypescript,
  SiVercel,
  SiWebassembly,
} from "react-icons/si";
import catImg from "@/assets/desk/cat.webp";
import chessProjectImg from "@/assets/desk/chess.webp";
import laptop from "@/assets/desk/sticker-laptop.webp";
import books from "@/assets/desk/sticker-books.webp";
import folderOpenImg from "@/assets/desk/folderopen.webp";
import folderCloseImg from "@/assets/desk/folderclose.webp";
import pacmanProjectImg from "@/assets/desk/pacman.webp";
import pacmanRlImg from "@/assets/desk/pacmanrl.webp";
import terminalProjectImg from "@/assets/desk/terminal.webp";
import tetrisProjectImg from "@/assets/desk/tetris.webp";
import torrentProjectImg from "@/assets/desk/torrent.webp";
import constructureImg from "@/assets/desk/constructure.webp";
import minimaxImg from "@/assets/desk/minimax.webp";
import minimaxGif from "@/assets/desk/minimax_slower.gif";
import pygitProjectImg from "@/assets/desk/pygit.webp";
import { CutoutImage } from "./CutoutImage";
import { RamenBowl } from "./RamenBowl";

const ABOUT_COPY =
  "Software engineer and systems builder focused on scalable backend infrastructure, AI-powered applications, and developer-first products. Experienced in full-stack development, LLM systems, and performance-driven engineering, with a passion for building thoughtful, high-impact technology.";
const resumePdf = "/resume.pdf";

const SKILL_ICONS: Record<string, IconType> = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Go: SiGo,
  Python: SiPython,
  "C++": SiCplusplus,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  "React Native": SiReact,
  TensorFlow: SiTensorflow,
  PyTorch: SiPytorch,
  OpenCV: SiOpencv,
  LangChain: SiLangchain,
  LangGraph: SiLangchain,
  "Reinforcement Learning": SiTensorflow,
  Git: SiGit,
  Docker: SiDocker,
  Redis: SiRedis,
  PostgreSQL: SiPostgresql,
  Firebase: SiFirebase,
  Vercel: SiVercel,
  WebAssembly: SiWebassembly,
};

const SKILL_GROUPS = [
  {
    title: "Languages",
    items: ["JavaScript", "TypeScript", "Go", "Python", "C++"],
  },
  {
    title: "Frameworks",
    items: ["React", "Next.js", "Node.js", "Express.js", "React Native"],
  },
  {
    title: "AI / ML",
    items: ["TensorFlow", "PyTorch", "OpenCV", "LangChain", "LangGraph", "Reinforcement Learning"],
  },
  {
    title: "Systems & Tools",
    items: ["Git", "Docker", "Redis", "PostgreSQL", "Firebase", "Vercel", "WebAssembly"],
  },
] as const;

function WorkspaceFolderIcon({
  icon: Icon,
  tone,
  title,
}: {
  icon: LucideIcon;
  tone: string;
  title: string;
}) {
  return <Icon aria-label={title} className={`h-8 w-8 ${tone}`} strokeWidth={1.75} />;
}

function SectionShell({
  id,
  title,
  children,
  className,
  containerClassName,
}: {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-2 border-t border-border/60 px-6 py-12 sm:px-10 sm:py-14 ${className ?? ""}`}
    >
      <div className={`mx-auto max-w-3xl ${containerClassName ?? ""}`}>
        <h2 className="handwritten text-4xl text-foreground sm:text-5xl">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export function AboutSection() {
  const isMobile = useIsMobile();
  const [folderOpen, setFolderOpen] = useState(false);
  const [mobileFolderOpen, setMobileFolderOpen] = useState(false);
  const [panel, setPanel] = useState<"laptop" | "books" | null>(null);
  const folderExpanded = isMobile ? mobileFolderOpen : folderOpen;

  return (
    <section
      id="about"
      className="scroll-mt-1 border-t border-border/60 px-6 pt-10 pb-12 sm:px-1 sm:pt-6 sm:pb-14"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-10 lg:grid-cols-[220px_1fr_260px] lg:gap-12">
          <figure className="mx-auto w-[min(220px,78vw)] shrink-0 sm:mx-0 sm:w-[200px] md:w-[228px]">
            <div
              className="relative rounded-[3px] bg-[oklch(0.99_0.005_90)] p-2.5 pb-7 shadow-[0_10px_28px_rgba(40,35,30,0.12),0_1px_0_oklch(0_0_0_/0.05)] ring-1 ring-foreground/[0.06]"
              style={{ transform: "rotate(-2.25deg)" }}
            >
              <span
                className="absolute -top-1 left-1/2 z-[1] h-2.5 w-8 -translate-x-1/2 rotate-[-4deg] rounded-[1px] opacity-90"
                style={{
                  background: "oklch(0.92 0.02 82 / 0.88)",
                  border: "1px solid oklch(0.78 0.03 80 / 0.45)",
                }}
                aria-hidden
              />
              <img
                src={catImg}
                alt="Cat illustration"
                className="aspect-square w-full rounded-[2px] object-cover desk-image-soft"
                style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.08))" }}
                draggable={false}
              />
            </div>
          </figure>

          <div className="min-w-0 flex-1 pt-0 sm:pt-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-muted-foreground/90">
              A little about me
            </p>
            <h2 className="handwritten mt-2 text-4xl leading-[0.95] text-foreground sm:text-5xl md:text-[3.35rem]">
              About
            </h2>
            <p className="font-newsreader mt-6 text-lg leading-[1.82] text-foreground/[0.88] sm:text-xl md:leading-[1.78]">
              {ABOUT_COPY}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[260px] lg:mx-0 lg:pt-4">
            <div
              onMouseEnter={() => !isMobile && setFolderOpen(true)}
              onMouseLeave={() => !isMobile && setFolderOpen(false)}
              onClick={() => isMobile && setMobileFolderOpen((o) => !o)}
              className="relative min-h-[188px] rounded-lg px-3 pt-2 md:h-[170px] md:min-h-0 md:pt-3"
            >
              {isMobile ? (
                <p className="mb-1 text-center font-mono text-[10px] uppercase tracking-wide text-muted-foreground/90">
                  Tap folder to open
                </p>
              ) : null}
              <div className="relative mx-auto w-[118px] pb-1">
                <CutoutImage
                  src={folderExpanded ? folderOpenImg : folderCloseImg}
                  alt="folder sticker"
                  className="w-full h-auto desk-image-soft"
                  draggable={false}
                />
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPanel("laptop");
                  }}
                  animate={{
                    opacity: folderExpanded ? 1 : 0.25,
                    y: folderExpanded ? -48 : -16,
                    x: folderExpanded ? 56 : 24,
                    scale: folderExpanded ? 1 : 0.9,
                  }}
                  whileHover={
                    folderExpanded
                      ? { scale: 1.1, rotate: 6, y: -54 }
                      : undefined
                  }
                  transition={{
                    type: "spring",
                    stiffness: 340,
                    damping: 18,
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ pointerEvents: folderExpanded ? "auto" : "none" }}
                >
                  <CutoutImage
                    src={laptop}
                    alt="Laptop token"
                    className="h-auto w-[68px] desk-image-soft drop-shadow-[0_3px_5px_rgba(0,0,0,0.15)]"
                    draggable={false}
                  />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPanel("books");
                  }}
                  animate={{
                    opacity: folderExpanded ? 1 : 0.25,
                    y: folderExpanded ? 16 : -2,
                    x: folderExpanded ? -56 : -24,
                    scale: folderExpanded ? 1 : 0.9,
                  }}
                  whileHover={
                    folderExpanded
                      ? { scale: 1.1, rotate: -6, y: 12 }
                      : undefined
                  }
                  transition={{
                    type: "spring",
                    stiffness: 340,
                    damping: 18,
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ pointerEvents: folderExpanded ? "auto" : "none" }}
                >
                  <CutoutImage
                    src={books}
                    alt="Books token"
                    className="h-auto w-[62px] desk-image-soft drop-shadow-[0_3px_5px_rgba(0,0,0,0.15)]"
                    draggable={false}
                  />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {panel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPanel(null)}
            className="fixed inset-0 z-[9999] grid place-items-center bg-foreground/30 p-4 backdrop-blur-[2px]"
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
                  <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Current laptop</p>
                  <h3 className="mt-2 handwritten text-4xl text-foreground">My Setup</h3>
                  <div className="mt-4 space-y-2 text-sm text-foreground/80">
                    <p><strong>Model:</strong> HP Pavilion</p>
                    <p><strong>Processor:</strong> 11th Gen Intel Core i5-11300H @ 3.10GHz</p>
                    <p><strong>RAM:</strong> 16 GB</p>
                    <p><strong>System:</strong> 64-bit OS, x64-based processor</p>
                    <p><strong>OS:</strong> Linux Mint 22.3 "Zena" (Cinnamon Edition)</p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Books & Notes</p>
                  <h3 className="mt-2 handwritten text-4xl text-foreground">What I Read</h3>
                  <div className="mt-4 space-y-3 text-sm text-foreground/85">
                    <p>
                      <strong>Designing Data-Intensive Applications</strong>{" "}
                      <span className="rounded bg-primary/12 px-2 py-0.5 text-[11px] font-mono uppercase tracking-wide text-primary">read</span>
                    </p>
                    <p>
                      <strong>Understanding Distributed Systems</strong>{" "}
                      <span className="rounded bg-primary/12 px-2 py-0.5 text-[11px] font-mono uppercase tracking-wide text-primary">read</span>
                    </p>
                    <p>
                      <strong>Designing Macine Learning Systems</strong>{" "}
                      <span className="rounded bg-primary/12 px-2 py-0.5 text-[11px] font-mono uppercase tracking-wide text-primary">read</span>
                    </p>
                    <p>
                      <strong>Computer Systems: A Programmer's Perspective</strong>{" "}
                      <span className="rounded bg-secondary/12 px-2 py-0.5 text-[11px] font-mono uppercase tracking-wide text-primary">want to read</span>
                    </p>
                  </div>
                </>
              )}
              <button onClick={() => setPanel(null)} className="mt-6 text-xs font-mono text-foreground/60">
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function WorkSection() {
  const projectFolders = [
    {
      id: "gochess",
      rank: "FOLDER 01",
      title: "GoChess Engine",
      subtitle:
        "A high-performance chess engine built in Go, designed to bring classical search algorithms, optimization strategies, and browser deployment together in one seamless system.",
      overview:
        "GoChess started as a deep dive into systems thinking, algorithmic optimization, and game engine architecture. Built from scratch, the engine leverages advanced search techniques like Minimax with Alpha-Beta Pruning, Zobrist Hashing, and Transposition Tables to evaluate positions efficiently while minimizing redundant calculations. To push performance further, the engine was compiled to WebAssembly for browser deployment and enhanced with Web Workers for parallelized move computation, allowing strong performance directly in the browser.",
      highlights: [
        "Engineered advanced move-search logic using Minimax + Alpha-Beta pruning",
        "Reduced unnecessary recomputation through Zobrist hashing and transposition caching",
        "Integrated Quiescence Search for improved tactical stability",
        "Deployed engine in-browser using WebAssembly",
        "Improved move generation speed using parallel processing",
      ],
      tech: ["Go", "WebAssembly", "JavaScript", "Chess Algorithms", "Web Workers"],
      previews: [{ src: chessProjectImg, alt: "GoChess engine preview" }],
      learned: [
        "Search optimization",
        "State caching",
        "Browser-native systems deployment",
        "Performance engineering",
        "Low-level algorithm design",
      ],
      showcase: ["Demo gameplay", "Search visualization", "Architecture diagram", "WASM integration"],
      note: null,
      curlCommand: null,
      githubUrl: "https://github.com/AyushKashyapII/Chess",
      liveUrl: "https://chess-inky.vercel.app",
      icon: Crown,
      accent: "bg-[#9ecdf1] ring-[#86badf]/70",
      iconTone: "text-[#2b6289]",
    },
    {
      id: "pygit",
      rank: "FOLDER 02",
      title: "PyGit",
      subtitle:
        "A ground-up reimplementation of Git's internal architecture, focused on understanding version control systems through content-addressable storage and commit graph mechanics.",
      overview:
        "PyGit was built to explore how modern version control systems work beneath the surface. Rather than relying on existing abstractions, this project reconstructs Git's core object model - including blobs, trees, and commits - while implementing SHA-1 hashing, object storage, and commit traversal from scratch. The result is a functional CLI tool capable of initializing repositories, staging changes, creating commits, and traversing commit history while mirroring key Git design principles.",
      highlights: [
        "Rebuilt Git's Blob, Tree, and Commit architecture",
        "Designed SHA-1 based content-addressable storage",
        "Implemented commit DAG traversal",
        "Created command-line support for essential Git operations",
        "Developed practical understanding of versioned file systems",
      ],
      tech: ["Python", "Git Internals", "SHA-1", "CLI Development", "File Systems"],
      previews: [{ src: pygitProjectImg, alt: "PyGit architectural workflow and structure diagram" }],
      learned: [
        "Version control internals",
        "Hashing systems",
        "File system architecture",
        "Commit graph design",
        "Developer tooling",
      ],
      showcase: [
        "Terminal screenshots",
        "Commit tree visualization",
        "Object storage structure",
        "CLI workflows",
      ],
      note: null,
      curlCommand: null,
      githubUrl: "https://github.com/AyushKashyapII/Git_Local",
      liveUrl: null,
      icon: GitBranch,
      accent: "bg-[#eacaa0] ring-[#d6b183]/70",
      iconTone: "text-[#8b6431]",
    },
    {
      id: "pacman-ai",
      rank: "FOLDER 03",
      title: "Pacman AI",
      subtitle:
        "A reinforcement learning project focused on autonomous gameplay through Q-Learning and policy optimization.",
      overview:
        "Pacman AI was built to explore machine learning through practical game environments. By implementing reinforcement learning techniques like Q-Learning and Deep Q-Networks, the project trains an agent to make increasingly intelligent decisions based on environmental rewards, penalties, and state transitions. Special focus was placed on reward shaping, state representation, and policy convergence to improve learning efficiency and overall gameplay performance.",
      highlights: [
        "Developed RL agent for autonomous decision making",
        "Implemented Q-Learning / DQN frameworks",
        "Optimized reward structures for improved convergence",
        "Designed state-action pipelines",
        "Improved policy stability through iterative tuning",
      ],
      tech: ["Python", "TensorFlow", "Reinforcement Learning", "OpenCV"],
      previews: [
        {
          src: pacmanProjectImg,
          alt: "Pacman AI gameplay preview",
          className: "w-full sm:w-[200px] md:w-[240px] h-56 sm:h-72 md:h-80 object-contain mx-auto sm:mx-0 shrink-0",
        },
        {
          src: pacmanRlImg,
          alt: "Pacman AI reinforcement learning training preview",
          className: "flex-1 w-full min-w-0 h-56 sm:h-72 md:h-80 object-contain",
        },
      ],
      learned: [
        "Reinforcement learning systems",
        "Agent optimization",
        "Reward engineering",
        "Policy learning",
        "AI experimentation",
      ],
      showcase: ["Gameplay demo", "Training metrics", "Reward progression graphs", "AI performance comparisons"],
      note: null,
      curlCommand: null,
      githubUrl: "https://github.com/AyushKashyapII/Pacman",
      liveUrl: null,
      icon: Gamepad2,
      accent: "bg-[#c7b7e9] ring-[#b09ad8]/70",
      iconTone: "text-[#5f4c86]",
    },
    {
      id: "terminal-portfolio",
      rank: "FOLDER 04",
      title: "Terminal Portfolio",
      subtitle:
        "A developer-first portfolio built in Go, combining an interactive terminal UI, curl-accessible HTTP mode, and embedded retro gameplay into one cohesive personal system.",
      overview:
        "This project reimagines the traditional developer portfolio as a terminal-native experience. Built using Go and Bubble Tea, the portfolio functions both as a local interactive TUI and a deployable HTTP service, allowing users to either navigate a full-screen terminal interface or access a styled ANSI-rendered portfolio directly through curl. The system blends software engineering, systems design, and playful interactivity by integrating full-screen terminal navigation, resume and portfolio content, browser-openable links, ANSI HTTP rendering, and terminal-based Tetris gameplay.",
      highlights: [
        "Built a full interactive terminal portfolio using Bubble Tea",
        "Created dual-mode architecture: local full-screen TUI and HTTP curl-based public portfolio",
        "Designed ANSI-styled output for remote terminal viewing",
        "Try it: curl.exe -sS https://ayush-terminal.fly.dev/terminal",
        "Added embedded playable Tetris mode directly inside terminal",
        "Included Docker + Fly.io deployment support",
        "Structured the project for future extensibility (games, blog, SSH, themes)",
      ],
      tech: ["Go", "Bubble Tea", "Lip Gloss", "HTTP Servers", "Docker", "Fly.io", "ANSI Rendering"],
      previews: [
        {
          src: terminalProjectImg,
          alt: "Terminal portfolio interface",
          className: "flex-1 w-full min-w-0 h-56 sm:h-72 md:h-80 object-contain",
        },
        {
          src: tetrisProjectImg,
          alt: "Embedded terminal tetris mode",
          className: "w-full sm:w-[200px] md:w-[240px] h-56 sm:h-72 md:h-80 object-contain mx-auto sm:mx-0 shrink-0",
        },
      ],
      learned: [
        "Terminal UI architecture",
        "State-driven CLI design",
        "ANSI rendering systems",
        "HTTP service deployment",
        "Interactive developer tooling",
        "Retro game integration",
        "Product personalization",
      ],
      showcase: ["Interactive TUI", "Curl endpoint", "Terminal Tetris", "Docker deploy setup"],
      note:
        "You can curl it in your terminal to see my static terminal based resume: curl.exe -sS https://ayush-terminal.fly.dev/terminal",
      curlCommand: "curl.exe -sS https://ayush-terminal.fly.dev/terminal",
      githubUrl: "https://github.com/AyushKashyapII/Terminal",
      liveUrl: "https://ayush-terminal.fly.dev/terminal",
      icon: Terminal,
      accent: "bg-[#9fc4b9] ring-[#87ad9f]/70",
      iconTone: "text-[#365f53]",
    },
    {
      id: "gopherswarm",
      rank: "FOLDER 05",
      title: "GoPherSwarm",
      subtitle:
        "A fully functional BitTorrent client built from scratch in Go, designed to explore distributed systems, peer-to-peer networking, and concurrent protocol engineering.",
      overview:
        "GoPherSwarm is a deep systems engineering project focused on rebuilding the BitTorrent protocol from the ground up. Rather than relying on external abstractions, this client implements core BitTorrent infrastructure manually - from Bencode parsing and tracker communication to peer wire protocol execution, concurrent downloading, and piece verification. By leveraging Go's goroutines and channels, GoPherSwarm uses a scalable Foreman-Worker architecture to coordinate peer connections, optimize throughput, and maintain data integrity across downloads.",
      highlights: [
        "Built full .torrent parser with custom Bencode implementation",
        "Implemented HTTP tracker communication for peer discovery",
        "Recreated complete BitTorrent peer wire protocol (handshake, bitfield, choke/unchoke, piece pipeline)",
        "Designed concurrent multi-peer download orchestration",
        "Implemented pipelined block requests for throughput optimization",
        "Verified downloaded pieces using SHA-1 hashing",
        "Added graceful shutdown and interrupt handling",
      ],
      tech: ["Go", "TCP Networking", "Distributed Systems", "BitTorrent Protocol", "Concurrency", "SHA-1"],
      previews: [{ src: torrentProjectImg, alt: "GoPherSwarm BitTorrent client preview" }],
      learned: [
        "Distributed system design",
        "P2P networking",
        "TCP/IP protocol engineering",
        "Concurrency orchestration",
        "Work scheduling",
        "Throughput optimization",
        "Protocol serialization",
        "Fault tolerance",
      ],
      showcase: ["Protocol flow", "Foreman-worker architecture", "Concurrent downloader", "Integrity checks"],
      note: null,
      curlCommand: null,
      githubUrl: "https://github.com/AyushKashyapII/BitTorrent",
      liveUrl: null,
      icon: Network,
      accent: "bg-[#f0b8a8] ring-[#df9c88]/70",
      iconTone: "text-[#8d4f3d]",
    },
  ] as const;
  const blogFolders = [
    {
      id: "bittorrent-protocol",
      title: "BitTorrent Protocol",
      subtitle: "The protocol that quietly solved internet-scale file distribution.",
      previews: [{ src: torrentProjectImg, alt: "BitTorrent protocol blog visual" }],
      githubUrl: null,
      liveUrl: null,
      intro:
        "When most people hear BitTorrent, they immediately think of piracy. But once you actually study the protocol, you realize BitTorrent is one of the most elegant distributed systems ever designed - a system that fundamentally rethought how large-scale data distribution should work on the internet.",
      sections: [
        {
          heading: "The Original Problem",
          content:
            "Before BitTorrent, large file distribution followed a centralized model: one server to many users. At internet scale this led to overloaded servers, high bandwidth cost, slow downloads, and single points of failure.",
          bullets: [
            "Servers became overloaded under sudden demand",
            "Bandwidth costs scaled linearly with traffic",
            "Downloads slowed dramatically",
            "Single points of failure emerged",
          ],
        },
        {
          heading: "Bram Cohen's Breakthrough",
          content:
            "In 2001, Bram Cohen introduced BitTorrent and flipped the model. Every downloader also becomes an uploader, turning distribution into a decentralized swarm where demand increases capacity.",
          bullets: [
            "Files split into small verifiable pieces",
            "Peers download from multiple peers simultaneously",
            "Peers upload pieces they already have",
            "Network strength grows as participation grows",
          ],
        },
        {
          heading: "How BitTorrent Works",
          content:
            "A client reads torrent metadata, discovers peers through trackers, communicates via peer wire protocol, downloads pieces in parallel, and verifies each piece using SHA-1.",
          bullets: [
            "Torrent metadata: structure, piece hashes, tracker URLs, InfoHash",
            "Tracker discovery: peer list + swarm formation",
            "Peer protocol: handshake, bitfield, choke/unchoke, piece requests",
            "Parallel piece downloading + integrity verification",
          ],
        },
        {
          heading: "Why BitTorrent Is Brilliant",
          content:
            "BitTorrent solves multiple distributed systems challenges at once: scalability, reliability, efficiency, and incentive alignment.",
          bullets: [
            "Scalability: more peers means more throughput",
            "Fault tolerance: no central serving bottleneck",
            "Efficiency: bandwidth cost distributed across users",
            "Reliability: cryptographic piece verification",
            "Incentives: tit-for-tat encourages contribution",
          ],
        },
        {
          heading: "Beyond Piracy",
          content:
            "The architecture is used in legitimate large-scale distribution contexts such as game updates, Linux ISO distribution, internal deployment pipelines, scientific datasets, and open-data delivery.",
          bullets: [
            "Blizzard game update distribution patterns",
            "Linux distributions sharing ISOs",
            "P2P-inspired deployment strategies in large tech systems",
            "University-scale scientific dataset distribution",
          ],
        },
        {
          heading: "What Learning BitTorrent Taught Me",
          content:
            "Implementing a torrent client from scratch provided practical depth in networking, distributed coordination, concurrency, and performance engineering.",
          bullets: [
            "TCP connections and protocol serialization",
            "Peer state management and swarm coordination",
            "Goroutines and worker orchestration",
            "Pipelined requests and throughput optimization",
            "Hash verification and protocol integrity",
          ],
        },
      ],
      takeaway:
        "BitTorrent didn't just make downloads faster. It redefined how the internet could distribute data.",
      icon: Network,
      accent: "bg-[#f0b8a8] ring-[#df9c88]/70",
      iconTone: "text-[#8d4f3d]",
    },
    {
      id: "chess-engine",
      title: "Chess Engine",
      subtitle: "How I tried to make a computer “think”.",
      previews: [{ src: minimaxGif, alt: "Minimax exploration animation" }],
      githubUrl: "https://github.com/AyushKashyapII/Chess",
      liveUrl: "https://chess-inky.vercel.app",
      intro:
        "At some point, building crud apps stopped feeling exciting. Everything started looking the same — forms, APIs, dashboards. Useful, but not… interesting. I wanted something where the logic actually matters. Something where the system has to make decisions, not just move data around. Chess felt perfect.",
      sections: [
        {
          heading: "Why I Built It",
          content:
            "Chess looks simple on the surface, but it’s basically pure decision-making. I didn’t want to use an existing engine — I wanted to understand what makes one feel intelligent.",
          bullets: ["Simple rules", "Infinite depth", "Decision-making under constraints"],
        },
        {
          heading: "Reality Check",
          content:
            "Chess is absurdly complex. The space of possible positions is often quoted around 10^120. Brute force is a fantasy — you need to be selective about what you explore and what you ignore.",
          bullets: ["You can’t “try everything”", "Depth explodes fast", "Efficiency decides strength"],
        },
        {
          heading: "The Core Loop",
          content: "At its heart, an engine is doing two things: generating moves and choosing the best one.",
          bullets: ["Generate legal moves", "Search future lines", "Evaluate positions at the leaves"],
        },
        {
          heading: "Minimax: The Brain",
          content:
            "Minimax is the first real mental model: you maximize your advantage, your opponent minimizes it. Every move becomes a back-and-forth recursion: You → Opponent → You → Opponent…",
          bullets: [
            "Build a decision tree of moves",
            "Score positions at the bottom",
            "Propagate scores upward (MAX vs MIN)",
          ],
          image: { src: minimaxImg, alt: "Minimax search tree illustration" },
        },
        {
          heading: "The Problem With Minimax",
          content:
            "Minimax works… but it’s slow. Even a few plies deep, branching factor turns the search into an explosion of possibilities.",
          bullets: ["Too many nodes", "Too much wasted exploration", "Optimization isn’t optional"],
        },
        {
          heading: "Alpha-Beta Pruning",
          content:
            "Alpha-Beta pruning was the first “wow” moment. While searching, α tracks the best score you can guarantee, β tracks the best score the opponent can force. If you find a line where α ≥ β, you can cut the entire branch.",
          bullets: [
            "Same result as minimax",
            "Way fewer nodes explored",
            "Practical depth becomes possible",
          ],
        },
        {
          heading: "Zobrist Hashing: Identifying Positions",
          content:
            "The same position can appear via different move orders. Without help, you end up recomputing the same analysis. Zobrist hashing gives each board state a fast, unique fingerprint using random numbers + XOR.",
          bullets: ["Piece + square random keys", "XOR to combine", "Fast incremental updates"],
        },
        {
          heading: "Transposition Tables: Memory",
          content:
            "Once positions have stable hashes, caching becomes obvious. A transposition table stores Position → Best line + evaluation so repeated positions reuse work instead of repeating it.",
          bullets: ["Massive speed-up in real games", "Less duplicated search", "Engine starts to “remember”"],
        },
        {
          heading: "Quiescence Search",
          content:
            "Sometimes evaluations happen at the worst possible moment — right before a capture or check — causing the horizon effect. Quiescence search extends the search only in “noisy” positions until things stabilize.",
          bullets: ["Detect unstable positions", "Search captures/checks deeper", "More stable evaluations"],
        },
        {
          heading: "Making It Fast (Browser Edition)",
          content:
            "I wanted it to feel fast, not just be correct. So I pushed performance where it mattered: compiled parts to WebAssembly and parallelized move evaluation with Web Workers.",
          bullets: ["WebAssembly for near-native speed", "Web Workers for parallel search", "Smooth, responsive UI"],
        },
        {
          heading: "Evaluation Function",
          content:
            "Search is useless without a gut feeling. At the leaves, the engine needs to answer: is this position good or bad? Material is the baseline — but positional factors matter too.",
          bullets: ["Material values (P=1, N/B=3, R=5, Q=9)", "Piece activity + board control", "Positional advantages"],
        },
        {
          heading: "What It Taught Me",
          content:
            "This wasn’t just a chess project — it was systems thinking. Breaking problems into state, transitions, evaluation, then dealing with the trade-offs: depth vs speed, accuracy vs compute.",
          bullets: ["Pruning", "Caching", "Parallelism", "Trade-offs everywhere"],
        },
      ],
      takeaway:
        "Intelligence isn’t magic. It’s structured decision-making under constraints — and chess is the perfect place to feel that in code.",
      accent: "bg-[#9ecdf1] ring-[#86badf]/70",
      iconTone: "text-[#2b6289]",
      icon: Crown,
    },
  ] as const;
  const historyFolders = [
    {
      id: "work-ex",
      title: "Work Ex",
      subtitle: "Internships and professional experience",
      icon: Briefcase,
      accent: "bg-[#c7b7e9] ring-[#b09ad8]/70",
      iconTone: "text-[#5f4c86]",
      entries: [
        {
          id: "constructure-ai",
          company: "Constructure AI",
          role: "Software Engineer Intern",
          period: "Dec 2025 - Apr 2026",
          overview:
            "Worked on backend systems and AI infrastructure for LLM-driven applications, large-scale construction data pipelines, and retrieval-based workflows. Focused on building scalable services, improving system performance, and developing production-ready tools that connected data, models, and external systems.",
          contributions: [
            "Built backend APIs for AI-powered applications",
            "Developed scalable data ingestion pipelines",
            "Implemented hybrid RAG retrieval systems",
            "Designed multi-agent workflow orchestration",
            "Optimized latency through caching and async processing",
          ],
          tech: ["Node.js", "Python", "LangChain", "Redis", "PostgreSQL", "Docker"],
          takeaways: [
            "Production AI systems",
            "Backend scalability",
            "Retrieval engineering",
            "Workflow orchestration",
            "Performance optimization",
          ],
          tagline: "My first step into building real-world AI infrastructure at scale.",
          preview: { src: constructureImg, alt: "Constructure AI experience visual" },
        },
      ],
    },
    {
      id: "resume",
      title: "Resume",
      subtitle: "View and download resume",
      icon: FileText,
      accent: "bg-[#9ecdf1] ring-[#86badf]/70",
      iconTone: "text-[#2b6289]",
      entries: [
        {
          id: "resume-view",
          company: "My Resume",
          role: "",
          period: "",
          overview: "",
          contributions: [],
          tech: [],
          takeaways: [],
          tagline: "",
          preview: { src: "", alt: "" },
          previewPdfUrl: resumePdf,
          downloadUrl: resumePdf,
          downloadFileName: "Ayush_Kashyap_Resume.pdf",
        },
      ],
    },
  ] as const;

  const [activePane, setActivePane] = useState<"projects" | "blogs" | "history">("projects");
  const [activeProjectId, setActiveProjectId] = useState<(typeof projectFolders)[number]["id"] | null>(null);
  const activeProject = projectFolders.find((folder) => folder.id === activeProjectId) ?? null;
  const [activeBlogId, setActiveBlogId] = useState<(typeof blogFolders)[number]["id"] | null>(null);
  const activeBlog = blogFolders.find((blog) => blog.id === activeBlogId) ?? null;
  const activeProjectKeyPoint = activeProject?.highlights[0] ?? null;
  const activeBlogKeyPoint = activeBlog?.sections[0]?.bullets[0] ?? null;
  const [activeHistoryFolderId, setActiveHistoryFolderId] = useState<(typeof historyFolders)[number]["id"] | null>(
    null,
  );
  const activeHistoryFolder = historyFolders.find((folder) => folder.id === activeHistoryFolderId) ?? null;
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <SectionShell id="work" title="Work" containerClassName="max-w-6xl">
      <div className="overflow-hidden rounded-xl border border-border/70 bg-[oklch(0.98_0.004_90)] shadow-[0_10px_34px_rgba(60,52,40,0.08)]">
        <div className="flex items-center justify-between border-b border-border/60 bg-paper/80 px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]/85" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#facc15]/85" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]/85" />
          </div>
          <p className="text-center text-[11px] font-mono text-muted-foreground/85">~/ayush/workspace</p>
          <span className="w-10" />
        </div>

        <div className="grid min-h-0 grid-cols-1 md:h-[500px] md:grid-cols-[150px_1fr]">
          <aside className="flex flex-row gap-1 overflow-x-auto border-b border-border/60 bg-paper/45 px-2 py-2 md:flex-col md:gap-0 md:overflow-visible md:border-b-0 md:border-r md:px-3 md:py-4">
            <p className="mb-0 shrink-0 self-center pr-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/80 md:mb-2 md:self-start md:pr-0 md:text-[11px] md:tracking-[0.16em]">
              Favorites
            </p>
            <div className="flex min-w-0 flex-1 flex-row gap-1.5 md:flex-col">
              <button
                type="button"
                onClick={() => setActivePane("projects")}
                className={`flex w-auto shrink-0 items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] md:w-full ${
                  activePane === "projects"
                    ? "bg-primary/12 text-foreground/85"
                    : "text-foreground/70 hover:bg-foreground/[0.05]"
                }`}
              >
                <Folder className="h-3.5 w-3.5 text-primary/80" />
                Projects
              </button>
              <button
                type="button"
                onClick={() => setActivePane("blogs")}
                className={`flex w-auto shrink-0 items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] md:w-full ${
                  activePane === "blogs"
                    ? "bg-primary/12 text-foreground/85"
                    : "text-foreground/70 hover:bg-foreground/[0.05]"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 text-foreground/60" />
                Read Blogs
              </button>
              <button
                type="button"
                onClick={() => setActivePane("history")}
                className={`flex w-auto shrink-0 items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] md:w-full ${
                  activePane === "history"
                    ? "bg-primary/12 text-foreground/85"
                    : "text-foreground/70 hover:bg-foreground/[0.05]"
                }`}
              >
                <History className="h-3.5 w-3.5 text-foreground/60" />
                History
              </button>
            </div>
          </aside>

          <div className="min-h-[260px] overflow-hidden p-4 sm:p-5 md:h-full md:min-h-0 md:p-6">
            {activePane === "projects" ? (
              !activeProject ? (
                <>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
                    {projectFolders.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => setActiveProjectId(project.id)}
                        className="group w-full min-h-[132px] rounded-lg border border-border/65 bg-paper/60 p-3 text-left transition-transform hover:-translate-y-0.5 hover:bg-paper"
                      >
                        <div
                          className={`flex h-16 w-full items-center justify-center rounded-md ring-1 ${project.accent}`}
                        >
                          <WorkspaceFolderIcon icon={project.icon} tone={project.iconTone} title={project.title} />
                        </div>
                        <p className="handwritten mt-2 text-[1.15rem] leading-none text-foreground/90">{project.title}</p>
                      </button>
                    ))}
                  </div>
                  <div></div>
                </>
              ) : (
                <div className="max-h-[min(72vh,640px)] min-h-[200px] overflow-y-auto rounded-lg border border-border/60 bg-paper/70 p-4 sm:p-5 md:h-full md:max-h-none">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveProjectId(null)}
                      className="text-[11px] font-mono uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
                    >
                      ← Back to folders
                    </button>
                    <div className="flex items-center gap-3">
                      {activeProject.liveUrl ? (
                        <a
                          href={activeProject.liveUrl}
                          className="inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Live
                        </a>
                      ) : null}
                      <a
                        href={activeProject.githubUrl}
                        className="inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Star className="h-3.5 w-3.5" />
                        GitHub
                      </a>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/90">
                      {activeProject.rank}
                    </p>
                    <h3 className="font-newsreader mt-1 text-3xl font-bold text-foreground">{activeProject.title}</h3>
                  </div>

                  <p className="mt-4 text-sm text-foreground/80">{activeProject.subtitle}</p>
                  {activeProjectKeyPoint ? (
                    <p className="mt-3 text-sm text-foreground/85">
                      <span className="font-semibold">Key Point:</span>{" "}
                      <span className="font-semibold">{activeProjectKeyPoint}</span>
                    </p>
                  ) : null}
                {activeProject.note ? (
                  <div className="mt-3 flex items-start gap-2 rounded-md border border-primary/25 bg-primary/8 px-3 py-2 text-xs text-foreground/85">
                    <p className="flex-1">{activeProject.note}</p>
                    {activeProject.curlCommand ? (
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText(activeProject.curlCommand);
                        }}
                        className="rounded border border-border/60 px-2 py-1 text-[11px] text-foreground/80 hover:bg-foreground/[0.05]"
                      >
                        Copy
                      </button>
                    ) : null}
                  </div>
                ) : null}

                  {activeProject.previews.length > 0 ? (
                    <div
                      className={`mt-4 flex flex-col gap-3 ${
                        activeProject.previews.length === 1
                          ? ""
                          : "sm:flex-row items-stretch"
                      }`}
                    >
                      {activeProject.previews.map((preview) => (
                        <img
                          key={preview.alt}
                          src={preview.src}
                          alt={preview.alt}
                          onClick={() => setLightboxImage(preview)}
                          className={`rounded-md border border-border/60 bg-white/80 p-2 cursor-zoom-in transition-all duration-200 hover:border-primary/50 hover:shadow-md ${
                            'className' in preview
                              ? (preview as any).className
                              : activeProject.previews.length === 1
                                ? "w-full object-contain h-64 sm:h-96 md:h-[400px]"
                                : "w-full sm:w-1/2 object-contain h-56 sm:h-72 md:h-80"
                          }`}
                          draggable={false}
                        />
                      ))}
                    </div>
                  ) : null}

                  <p className="mt-4 text-sm leading-6 text-foreground/78">{activeProject.overview}</p>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                      <p className="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-mono uppercase tracking-[0.18em] text-foreground/95">
                        Key Highlights
                      </p>
                      <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
                        {activeProject.highlights.map((point) => (
                          <li key={point}>- {point}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-mono uppercase tracking-[0.18em] text-foreground/95">
                        What I Learned
                      </p>
                      <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
                        {activeProject.learned.map((point) => (
                          <li key={point}>- {point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-mono uppercase tracking-[0.18em] text-foreground/95">
                      Tech Stack
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeProject.tech.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-border/60 bg-paper px-2.5 py-1 text-[11px] text-foreground/82"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            ) : activePane === "blogs" ? (
              !activeBlog ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
                  {blogFolders.map((blog) => (
                    <button
                      key={blog.id}
                      onClick={() => setActiveBlogId(blog.id)}
                      className="group w-full min-h-[132px] rounded-lg border border-border/65 bg-paper/60 p-3 text-left transition-transform hover:-translate-y-0.5 hover:bg-paper"
                    >
                      <div className={`flex h-16 w-full items-center justify-center rounded-md ring-1 ${blog.accent}`}>
                        <WorkspaceFolderIcon icon={blog.icon} tone={blog.iconTone} title={blog.title} />
                      </div>
                      <p className="handwritten mt-2 text-[1.15rem] leading-none text-foreground/90">{blog.title}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="max-h-[min(72vh,640px)] min-h-[200px] overflow-y-auto rounded-lg border border-border/60 bg-paper/70 p-4 sm:p-5 md:h-full md:max-h-none">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveBlogId(null)}
                      className="text-[11px] font-mono uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
                    >
                      ← Back to blogs
                    </button>
                    <div className="flex items-center gap-3">
                      {activeBlog.liveUrl ? (
                        <a
                          href={activeBlog.liveUrl}
                          className="inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Live
                        </a>
                      ) : null}
                      {activeBlog.githubUrl ? (
                        <a
                          href={activeBlog.githubUrl}
                          className="inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Star className="h-3.5 w-3.5" />
                          GitHub
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <h3 className="font-newsreader mt-3 text-3xl font-bold text-foreground">{activeBlog.title}</h3>
                  <p className="mt-1 text-sm text-foreground/75">{activeBlog.subtitle}</p>
                  <p className="mt-4 text-sm leading-6 text-foreground/80">{activeBlog.intro}</p>
                  {activeBlogKeyPoint ? (
                    <p className="mt-3 text-sm text-foreground/85">
                      <span className="font-semibold">Key Point:</span>{" "}
                      <span className="font-semibold">{activeBlogKeyPoint}</span>
                    </p>
                  ) : null}
                  {activeBlog.previews.length > 0 ? (
                    <div className="mt-4 grid grid-cols-1 gap-3">
                      {activeBlog.previews.map((preview) => (
                        <img
                          key={preview.alt}
                          src={preview.src}
                          alt={preview.alt}
                          onClick={() => setLightboxImage(preview)}
                          className={`w-full rounded-md border border-border/60 bg-white/80 object-contain p-2 cursor-zoom-in transition-all duration-200 hover:border-primary/50 hover:shadow-md ${
                            activeBlog.id === "chess-engine" ? "h-72 sm:h-[26rem]" : "h-64 sm:h-72"
                          }`}
                          draggable={false}
                        />
                      ))}
                    </div>
                  ) : null}

                  {activeBlog.sections.map((section) => (
                    <div key={section.heading} className="mt-5">
                      <h4 className="inline-block rounded bg-primary/10 px-2 py-0.5 text-sm font-mono uppercase tracking-[0.14em] text-foreground/95">
                        {section.heading}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-foreground/80">{section.content}</p>
                      <ul className="mt-2 space-y-1.5 text-sm text-foreground/78">
                        {section.bullets.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                      {"image" in section && section.image ? (
                        <img
                          src={section.image.src}
                          alt={section.image.alt}
                          onClick={() => setLightboxImage(section.image)}
                          className="mt-3 h-64 w-full rounded-md border border-border/60 bg-white/80 object-contain p-2 sm:h-[22rem] cursor-zoom-in transition-all duration-200 hover:border-primary/50 hover:shadow-md"
                          draggable={false}
                        />
                      ) : null}
                    </div>
                  ))}

                  <div className="mt-6 rounded-md border border-primary/25 bg-primary/8 px-3 py-2">
                    <p className="text-sm text-foreground/85">
                      <span className="font-medium">Key Takeaway:</span> {activeBlog.takeaway}
                    </p>
                  </div>
                </div>
              )
            ) : !activeHistoryFolder ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
                {historyFolders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setActiveHistoryFolderId(folder.id)}
                    className="group w-full min-h-[132px] rounded-lg border border-border/65 bg-paper/60 p-3 text-left transition-transform hover:-translate-y-0.5 hover:bg-paper"
                  >
                    <div className={`flex h-16 w-full items-center justify-center rounded-md ring-1 ${folder.accent}`}>
                      <WorkspaceFolderIcon icon={folder.icon} tone={folder.iconTone} title={folder.title} />
                    </div>
                    <p className="handwritten mt-2 text-[1.15rem] leading-none text-foreground/90">{folder.title}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="max-h-[min(72vh,640px)] min-h-[200px] overflow-y-auto rounded-lg border border-border/60 bg-paper/70 p-4 sm:p-5 md:h-full md:max-h-none">
                <button
                  type="button"
                  onClick={() => setActiveHistoryFolderId(null)}
                  className="text-[11px] font-mono uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
                >
                  ← Back to history
                </button>

                {activeHistoryFolder.entries.map((entry) => (
                  <div key={entry.id} className="mt-3">
                    {entry.id === "resume-view" ? (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-newsreader text-3xl font-bold text-foreground">{entry.company}</h3>
                          <a
                            href={entry.downloadUrl}
                            download={entry.downloadFileName ?? "resume.pdf"}
                            className="rounded-md border border-border/60 bg-paper px-3 py-1.5 text-xs text-foreground/85 transition-colors hover:bg-foreground/[0.05]"
                          >
                            Download Resume
                          </a>
                        </div>
                        {/* Desktop: embedded PDF. Mobile browsers (esp. iOS Safari) often show a blank iframe — open in native viewer instead. */}
                        <iframe
                          src={`${entry.previewPdfUrl}#view=FitH`}
                          title="Resume PDF preview"
                          className="mt-4 hidden h-[920px] w-full rounded-md border border-border/60 bg-white md:block"
                        />
                        <div className="mt-4 rounded-md border border-border/60 bg-paper/80 p-4 text-center md:hidden">
                          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
                            <a
                              href={entry.previewPdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/45 bg-primary/70 px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/85"
                            >
                              <FileText className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                              Open resume
                            </a>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <img
                            src={entry.preview.src}
                            alt={entry.preview.alt}
                            className="h-10 w-10 rounded-md border border-border/60 bg-white/80 object-contain p-1"
                            draggable={false}
                          />
                          <h3 className="font-newsreader text-3xl font-bold text-foreground">{entry.company}</h3>
                        </div>
                        <p className="mt-1 text-sm text-foreground/85">{entry.role}</p>
                        <p className="text-xs font-mono uppercase tracking-[0.16em] text-foreground/80">{entry.period}</p>

                        <p className="mt-4 text-sm leading-6 text-foreground/80">{entry.overview}</p>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                          <div>
                            <p className="text-xs font-mono uppercase tracking-[0.18em] text-foreground/90">
                              Key Contributions
                            </p>
                            <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
                              {entry.contributions.map((point) => (
                                <li key={point}>- {point}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-mono uppercase tracking-[0.18em] text-foreground/90">
                              Key Takeaways
                            </p>
                            <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
                              {entry.takeaways.map((point) => (
                                <li key={point}>- {point}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-5">
                          <p className="text-xs font-mono uppercase tracking-[0.18em] text-foreground/90">Tech Stack</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {entry.tech.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md border border-border/60 bg-paper px-2.5 py-1 text-[11px] text-foreground/82"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 rounded-md border border-primary/25 bg-primary/8 px-3 py-2">
                          <p className="text-sm text-foreground/85">
                            <span className="font-medium"></span> {entry.tagline}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
            >
              <img
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain bg-white/5 border border-white/10"
                draggable={false}
              />
              <p className="mt-3 text-center text-xs font-mono text-white/70 select-none">
                {lightboxImage.alt}
              </p>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="absolute -top-10 right-0 text-white/70 hover:text-white font-mono text-xs tracking-wider flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded"
              >
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  );
}

export function ContactSection() {
  const contactItems = [
    {
      label: "X / Twitter",
      href: "https://x.com/AyushKashyapII",
      icon: Twitter,
    },
    {
      label: "GitHub",
      href: "https://github.com/AyushKashyapII",
      icon: Github,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ayush-kashyap-9492422a8/",
      icon: Linkedin,
    },
    {
      label: "Email",
      href: "mailto:kashyap11ayush02@gmail.com",
      icon: Mail,
    },
  ];

  return (
    <section
      id="contact"
      className="scroll-mt-2 border-t border-border/60 px-6 py-12 sm:px-10 sm:py-14"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="handwritten text-4xl text-foreground sm:text-5xl">Contact</h2>
        <p className="mt-4 text-foreground/80">
          Reach out any time. I am active on social and usually reply quickly.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-3">
          {contactItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.label === "Email" ? undefined : "_blank"}
                rel={item.label === "Email" ? undefined : "noreferrer"}
                className="group flex min-w-0 items-center gap-2 rounded-md border border-border/60 bg-paper/60 px-2.5 py-2.5 transition-colors hover:border-primary/50 hover:bg-primary/5 sm:gap-3 sm:px-4 sm:py-3"
              >
                <Icon className="h-4 w-4 shrink-0 text-foreground/75 transition-colors group-hover:text-primary" />
                <span className="min-w-0 truncate text-xs text-foreground/85 sm:text-sm">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="scroll-mt-2 border-t border-border/60 px-6 py-12 sm:px-10 sm:py-14 pt-6 sm:pt-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-10 grid-cols-1 lg:grid-cols-[220px_1fr] lg:gap-12">
          {/* Left column: Ramen bowl (centered at top on mobile, left on desktop) */}
          <div className="flex flex-col items-center justify-center pt-4 lg:pt-30 order-first lg:order-none">
            <RamenBowl />
          </div>

          {/* Right column: Skills Content */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Tech stack
            </p>
            <h2 className="handwritten mt-2 text-4xl leading-[0.95] text-foreground sm:text-5xl md:text-[3.35rem]">
              Skills
            </h2>
            <p className="mt-4 text-foreground/80">
              A compact map of the languages, frameworks, and tools I use to build products.
            </p>

            <div className="mt-8 space-y-6">
              {SKILL_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground/90">
                    {group.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-md border border-border/65 bg-paper/70 px-3 py-1.5 text-xs text-foreground/85 shadow-[0_1px_0_oklch(0_0_0_/0.04)] transition-colors hover:border-primary/45 hover:bg-primary/6 hover:text-foreground"
                      >
                        {(() => {
                          const SkillIcon = SKILL_ICONS[skill];
                          return SkillIcon ? (
                            <SkillIcon className="mr-2 h-3.5 w-3.5 text-foreground/70" aria-hidden />
                          ) : (
                            <span
                              className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary/55"
                              aria-hidden
                            />
                          );
                        })()}
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
