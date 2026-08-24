import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Draggable } from "./Draggable";

const SNAKE_SIZE = 14;
const SNAKE_CELL = 14;
const SNAKE_MODAL_CELL = 20;
const TETRIS_W = 10;
const TETRIS_H = 18;
const TETRIS_CELL = 20;

type P = { x: number; y: number };
type GameMode = "snake" | "tetris";
type Piece = { shape: number[][]; x: number; y: number; color: string };

const TETROMINOES: Array<{ shape: number[][]; color: string }> = [
  { shape: [[1, 1, 1, 1]], color: "oklch(0.55 0.07 220)" },
  { shape: [[1, 1], [1, 1]], color: "oklch(0.78 0.12 95)" },
  { shape: [[0, 1, 0], [1, 1, 1]], color: "oklch(0.65 0.15 35)" },
  { shape: [[1, 0, 0], [1, 1, 1]], color: "oklch(0.6 0.14 155)" },
  { shape: [[0, 0, 1], [1, 1, 1]], color: "oklch(0.62 0.14 300)" },
  { shape: [[0, 1, 1], [1, 1, 0]], color: "oklch(0.62 0.16 20)" },
  { shape: [[1, 1, 0], [0, 1, 1]], color: "oklch(0.56 0.14 185)" },
];

const createEmptyBoard = () =>
  Array.from({ length: TETRIS_H }, () => Array.from({ length: TETRIS_W }, () => ""));

const rotate = (shape: number[][]) =>
  shape[0].map((_, i) => shape.map((row) => row[i]).reverse());

const randomPiece = (): Piece => {
  const t = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
  return {
    shape: t.shape,
    x: Math.floor((TETRIS_W - t.shape[0].length) / 2),
    y: 0,
    color: t.color,
  };
};

interface SnakeGameProps {
  openSignal?: number;
}

export function SnakeGame({ openSignal = 0 }: SnakeGameProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<GameMode>("snake");

  // Snake state
  const [snake, setSnake] = useState<P[]>([{ x: 7, y: 7 }]);
  const [dir, setDir] = useState<P>({ x: 1, y: 0 });
  const [food, setFood] = useState<P>({ x: 4, y: 4 });
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeRunning, setSnakeRunning] = useState(false);
  const [snakeHi, setSnakeHi] = useState(0);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  // Tetris state
  const [board, setBoard] = useState<string[][]>(createEmptyBoard());
  const [piece, setPiece] = useState<Piece>(() => randomPiece());
  const [tetrisRunning, setTetrisRunning] = useState(false);
  const [tetrisScore, setTetrisScore] = useState(0);
  const [tetrisHi, setTetrisHi] = useState(0);

  useEffect(() => {
    const sh = typeof window !== "undefined" ? localStorage.getItem("snake-hi") : null;
    const th = typeof window !== "undefined" ? localStorage.getItem("tetris-hi") : null;
    if (sh) setSnakeHi(parseInt(sh, 10));
    if (th) setTetrisHi(parseInt(th, 10));
  }, []);

  useEffect(() => {
    if (openSignal > 0) {
      setMode("snake");
      setIsModalOpen(true);
      setSnakeRunning(true);
    }
  }, [openSignal]);

  const resetSnake = useCallback(() => {
    setSnake([{ x: 7, y: 7 }]);
    setDir({ x: 1, y: 0 });
    dirRef.current = { x: 1, y: 0 };
    setFood({ x: 4, y: 4 });
    setSnakeScore(0);
    setSnakeRunning(false);
  }, []);

  const collides = useCallback((b: string[][], p: Piece) => {
    for (let y = 0; y < p.shape.length; y += 1) {
      for (let x = 0; x < p.shape[y].length; x += 1) {
        if (!p.shape[y][x]) continue;
        const nx = p.x + x;
        const ny = p.y + y;
        if (nx < 0 || nx >= TETRIS_W || ny >= TETRIS_H) return true;
        if (ny >= 0 && b[ny][nx]) return true;
      }
    }
    return false;
  }, []);

  const resetTetris = useCallback(() => {
    setBoard(createEmptyBoard());
    setPiece(randomPiece());
    setTetrisScore(0);
    setTetrisRunning(false);
  }, []);

  const mergePiece = useCallback((b: string[][], p: Piece) => {
    const next = b.map((row) => [...row]);
    p.shape.forEach((row, y) => {
      row.forEach((v, x) => {
        if (!v) return;
        const nx = p.x + x;
        const ny = p.y + y;
        if (ny >= 0 && ny < TETRIS_H && nx >= 0 && nx < TETRIS_W) next[ny][nx] = p.color;
      });
    });
    return next;
  }, []);

  const lockPiece = useCallback(() => {
    setBoard((prevBoard) => {
      const merged = mergePiece(prevBoard, piece);
      const filtered = merged.filter((row) => row.some((c) => !c));
      const cleared = TETRIS_H - filtered.length;
      const padded = [...Array.from({ length: cleared }, () => Array.from({ length: TETRIS_W }, () => "")), ...filtered];
      if (cleared > 0) setTetrisScore((s) => s + cleared * 100);
      const nextPiece = randomPiece();
      if (collides(padded, nextPiece)) {
        setTetrisRunning(false);
        setTetrisHi((h) => {
          const nh = Math.max(h, tetrisScore);
          localStorage.setItem("tetris-hi", String(nh));
          return nh;
        });
      } else {
        setPiece(nextPiece);
      }
      return padded;
    });
  }, [collides, mergePiece, piece, tetrisScore]);

  useEffect(() => {
    if (!snakeRunning || !isModalOpen || mode !== "snake") return;
    const id = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const nx = (head.x + dirRef.current.x + SNAKE_SIZE) % SNAKE_SIZE;
        const ny = (head.y + dirRef.current.y + SNAKE_SIZE) % SNAKE_SIZE;
        const next = { x: nx, y: ny };
        if (prev.some((p) => p.x === nx && p.y === ny)) {
          setSnakeRunning(false);
          setSnakeHi((h) => {
            const nh = Math.max(h, snakeScore);
            localStorage.setItem("snake-hi", String(nh));
            return nh;
          });
          return prev;
        }
        const ate = nx === food.x && ny === food.y;
        if (ate) {
          setSnakeScore((s) => s + 1);
          setFood({ x: Math.floor(Math.random() * SNAKE_SIZE), y: Math.floor(Math.random() * SNAKE_SIZE) });
        }
        return ate ? [next, ...prev] : [next, ...prev.slice(0, -1)];
      });
    }, 115);
    return () => clearInterval(id);
  }, [snakeRunning, isModalOpen, mode, snakeScore, food]);

  useEffect(() => {
    if (!tetrisRunning || !isModalOpen || mode !== "tetris") return;
    const id = setInterval(() => {
      setPiece((curr) => {
        const moved = { ...curr, y: curr.y + 1 };
        if (collides(board, moved)) {
          lockPiece();
          return curr;
        }
        return moved;
      });
    }, 420);
    return () => clearInterval(id);
  }, [tetrisRunning, isModalOpen, mode, board, collides, lockPiece]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();

      const key = e.key.toLowerCase();

      if (mode === "snake") {
        const map: Record<string, P> = {
          w: { x: 0, y: -1 },
          s: { x: 0, y: 1 },
          a: { x: -1, y: 0 },
          d: { x: 1, y: 0 },
        };
        const nd = map[key];
        if (nd && (nd.x !== -dirRef.current.x || nd.y !== -dirRef.current.y)) setDir(nd);
        return;
      }

      if (mode === "tetris") {
        if (!tetrisRunning) return;
        if (key === "j") {
          setPiece((p) => {
            const next = { ...p, x: p.x - 1 };
            return collides(board, next) ? p : next;
          });
        } else if (key === "l") {
          setPiece((p) => {
            const next = { ...p, x: p.x + 1 };
            return collides(board, next) ? p : next;
          });
        } else if (key === "k") {
          setPiece((p) => {
            const next = { ...p, y: p.y + 1 };
            if (collides(board, next)) {
              lockPiece();
              return p;
            }
            return next;
          });
        } else if (key === "i") {
          setPiece((p) => {
            const next = { ...p, shape: rotate(p.shape) };
            return collides(board, next) ? p : next;
          });
        }
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen, mode, tetrisRunning, board, collides, lockPiece]);

  const tetrisDisplay = useMemo(() => {
    const frame = board.map((row) => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((v, x) => {
        if (!v) return;
        const nx = piece.x + x;
        const ny = piece.y + y;
        if (ny >= 0 && ny < TETRIS_H && nx >= 0 && nx < TETRIS_W) frame[ny][nx] = piece.color;
      });
    });
    return frame;
  }, [board, piece]);

  return (
    <>
      <Draggable initial={{ x: 910, y: 560 }} rotate={1} className="w-[230px]">
        <div
          className="rounded-2xl p-3 pt-2"
          style={{
            background: "linear-gradient(160deg, oklch(0.85 0.03 70), oklch(0.76 0.03 72))",
            boxShadow: "var(--shadow-lift), inset 0 1px 0 oklch(1 0 0 / 0.55)",
            border: "1px solid oklch(0.64 0.03 75)",
          }}
        >
          <div className="flex items-center justify-between text-[10px] font-mono mb-1.5 text-foreground/70 px-1">
            <span>MODE</span>
            <span className="handwritten text-base text-foreground/80">retro player</span>
            <span>v1</span>
          </div>
          <div
            className="rounded-md mx-auto grid place-items-center text-[11px] font-mono text-foreground/70"
            style={{
              width: SNAKE_SIZE * SNAKE_CELL,
              height: SNAKE_SIZE * SNAKE_CELL,
              background: "oklch(0.9 0.02 125)",
              border: "1px solid oklch(0.55 0.02 75)",
              boxShadow: "inset 0 1px 4px oklch(0 0 0 / 0.18)",
            }}
          >
            snake · tetris
          </div>
          <button
            onClick={() => {
              setIsModalOpen(true);
              if (mode === "snake") setSnakeRunning(true);
            }}
            className="mt-2 w-full py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-md bg-foreground/10 text-foreground border border-foreground/15 transition"
          >
            Open Player
          </button>
          <p className="mt-1.5 text-[9px] font-mono text-center text-foreground/50">big-screen mode</p>
        </div>
      </Draggable>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-foreground/45 backdrop-blur-[2px] grid place-items-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[760px] rounded-2xl border p-5"
            style={{
              background: "linear-gradient(170deg, oklch(0.83 0.03 75), oklch(0.74 0.02 74))",
              borderColor: "oklch(0.58 0.02 75)",
              boxShadow: "0 20px 60px oklch(0 0 0 / 0.35), inset 0 1px 0 oklch(1 0 0 / 0.45)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/70">handheld arcade</p>
              <button className="font-mono text-xs text-foreground/60" onClick={() => setIsModalOpen(false)}>
                close
              </button>
            </div>

            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setMode("snake")}
                className="rounded-md px-3 py-1.5 font-mono text-xs border"
                style={{
                  background: mode === "snake" ? "oklch(0.88 0.04 130)" : "oklch(0.93 0.01 80)",
                  borderColor: "oklch(0.58 0.02 75)",
                }}
              >
                Snake
              </button>
              <button
                onClick={() => setMode("tetris")}
                className="rounded-md px-3 py-1.5 font-mono text-xs border"
                style={{
                  background: mode === "tetris" ? "oklch(0.88 0.04 130)" : "oklch(0.93 0.01 80)",
                  borderColor: "oklch(0.58 0.02 75)",
                }}
              >
                Tetris
              </button>
            </div>

            {mode === "snake" ? (
              <div>
                <div className="mb-3 flex items-center justify-between font-mono text-xs text-foreground/75">
                  <span>SCORE {snakeScore}</span>
                  <span>HI {snakeHi}</span>
                </div>
                <div
                  className="relative rounded-md mx-auto"
                  style={{
                    width: SNAKE_SIZE * SNAKE_MODAL_CELL,
                    height: SNAKE_SIZE * SNAKE_MODAL_CELL,
                    background: "oklch(0.92 0.02 130)",
                    border: "1px solid oklch(0.55 0.02 75)",
                    boxShadow: "inset 0 2px 8px oklch(0 0 0 / 0.2)",
                  }}
                >
                  {snake.map((s, i) => (
                    <div
                      key={i}
                      className="absolute rounded-[2px]"
                      style={{
                        left: s.x * SNAKE_MODAL_CELL + 1,
                        top: s.y * SNAKE_MODAL_CELL + 1,
                        width: SNAKE_MODAL_CELL - 2,
                        height: SNAKE_MODAL_CELL - 2,
                        background: i === 0 ? "oklch(0.42 0.05 145)" : "oklch(0.56 0.07 145)",
                      }}
                    />
                  ))}
                  <div
                    className="absolute rounded-full"
                    style={{
                      left: food.x * SNAKE_MODAL_CELL + 4,
                      top: food.y * SNAKE_MODAL_CELL + 4,
                      width: SNAKE_MODAL_CELL - 8,
                      height: SNAKE_MODAL_CELL - 8,
                      background: "oklch(0.6 0.18 30)",
                    }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-mono text-[11px] text-foreground/60">controls: W A S D</p>
                  <div className="flex gap-2">
                    <button
                      className="rounded-md border px-3 py-1.5 font-mono text-xs"
                      onClick={() => {
                        if (!snakeRunning) resetSnake();
                        setSnakeRunning((r) => !r);
                      }}
                    >
                      {snakeRunning ? "Pause" : snakeScore > 0 ? "Restart" : "Start"}
                    </button>
                    <button className="rounded-md border px-3 py-1.5 font-mono text-xs" onClick={resetSnake}>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-3 flex items-center justify-between font-mono text-xs text-foreground/75">
                  <span>SCORE {tetrisScore}</span>
                  <span>HI {tetrisHi}</span>
                </div>
                <div
                  className="relative mx-auto rounded-md"
                  style={{
                    width: TETRIS_W * TETRIS_CELL,
                    height: TETRIS_H * TETRIS_CELL,
                    background: "oklch(0.9 0.015 125)",
                    border: "1px solid oklch(0.55 0.02 75)",
                    boxShadow: "inset 0 2px 8px oklch(0 0 0 / 0.2)",
                  }}
                >
                  {tetrisDisplay.map((row, y) =>
                    row.map((cell, x) =>
                      cell ? (
                        <div
                          key={`${x}-${y}`}
                          className="absolute rounded-[2px]"
                          style={{
                            left: x * TETRIS_CELL + 1,
                            top: y * TETRIS_CELL + 1,
                            width: TETRIS_CELL - 2,
                            height: TETRIS_CELL - 2,
                            background: cell,
                          }}
                        />
                      ) : null,
                    ),
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-mono text-[11px] text-foreground/60">controls: I rotate · J/L move · K drop</p>
                  <div className="flex gap-2">
                    <button
                      className="rounded-md border px-3 py-1.5 font-mono text-xs"
                      onClick={() => {
                        if (!tetrisRunning) resetTetris();
                        setTetrisRunning((r) => !r);
                      }}
                    >
                      {tetrisRunning ? "Pause" : tetrisScore > 0 ? "Restart" : "Start"}
                    </button>
                    <button className="rounded-md border px-3 py-1.5 font-mono text-xs" onClick={resetTetris}>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
