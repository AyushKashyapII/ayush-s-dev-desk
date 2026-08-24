import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const deskAssetModules = import.meta.glob("../../assets/desk/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const MIN_VISIBLE_MS = 2400;
const MAX_VISIBLE_MS = 4800;
const GREETINGS = ["hello", "ciao", "hola", "bonjour", "नमस्ते", "こんにちは", "01001000 01001001" ,"你好" ,"Olá"];

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.decode) {
        img.decode().then(() => resolve()).catch(() => resolve());
        return;
      }
      resolve();
    };
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function IntroLoader({ onFinished }: { onFinished?: () => void }) {
  const [visible, setVisible] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [greetingIndex, setGreetingIndex] = useState(0);

  const sources = useMemo(
    () => Object.values(deskAssetModules).filter((src): src is string => typeof src === "string"),
    [],
  );

  useEffect(() => {
    let alive = true;
    const startedAt = window.performance.now();
    const minTimer = new Promise<void>((resolve) => window.setTimeout(resolve, MIN_VISIBLE_MS));
    const maxTimer = new Promise<void>((resolve) => window.setTimeout(resolve, MAX_VISIBLE_MS));

    const imageTimer = Promise.all(
      sources.map((src) =>
        preloadImage(src).then(() => {
          if (alive) setLoadedCount((count) => count + 1);
        }),
      ),
    ).then(() => undefined);

    Promise.race([Promise.all([minTimer, imageTimer]).then(() => undefined), maxTimer]).then(() => {
      const elapsed = window.performance.now() - startedAt;
      const finishDelay = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => {
        if (!alive) return;
        setVisible(false);
        window.setTimeout(() => onFinished?.(), 420);
      }, finishDelay);
    });

    return () => {
      alive = false;
    };
  }, [onFinished, sources]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setGreetingIndex((index) => (index + 1) % GREETINGS.length);
    }, 260);

    return () => window.clearInterval(timer);
  }, []);

  const progress = sources.length > 0 ? Math.min(100, Math.round((loadedCount / sources.length) * 100)) : 100;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)", scale: 1.015 }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Loading portfolio"
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundImage:
                "radial-gradient(circle at 28% 18%, oklch(0.95 0.08 95 / 0.42), transparent 22%), radial-gradient(circle at 72% 76%, oklch(0.92 0.04 150 / 0.34), transparent 24%)",
            }}
          />

          <motion.div
            className="absolute left-[13%] top-[18%] h-16 w-16 rounded-[2px] bg-sticky-yellow shadow-[var(--shadow-sticky)]"
            initial={{ y: 18, opacity: 0, rotate: -16 }}
            animate={{ y: [0, -8, 0], opacity: 0.85, rotate: [-9, -13, -9] }}
            transition={{
              y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.9 },
            }}
          />
          <motion.div
            className="absolute bottom-[18%] right-[14%] h-12 w-24 rounded-[2px] bg-sticky-mint shadow-[var(--shadow-sticky)]"
            initial={{ y: -12, opacity: 0, rotate: 15 }}
            animate={{ y: [0, 7, 0], opacity: 0.72, rotate: [7, 11, 7] }}
            transition={{
              y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.9, delay: 0.2 },
            }}
          />
          <motion.div
            className="absolute left-[18%] bottom-[24%] h-2 w-20 rounded-full bg-primary/55"
            initial={{ x: -34, opacity: 0 }}
            animate={{ x: [0, 34, 0], opacity: [0.2, 0.55, 0.2] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[22%] top-[27%] h-3 w-3 rounded-full bg-foreground/70"
            animate={{ y: [0, -18, 0], x: [0, 10, 0], opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[27%] top-[34%] h-2 w-2 rounded-full bg-primary"
            animate={{ y: [0, 16, 0], x: [0, -14, 0], opacity: [0.25, 0.75, 0.25] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />

          <div className="relative z-10 flex w-[min(88vw,560px)] flex-col items-center text-center">
            <motion.p
              className="font-mono text-[11px] uppercase tracking-[0.42em] text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              {/* just a second */}
            </motion.p>
            <motion.h1
              key={GREETINGS[greetingIndex]}
              className="mt-4 min-h-[1em] max-w-full px-2 font-mono text-[clamp(2.65rem,11vw,7.8rem)] font-black uppercase leading-[0.9] tracking-normal text-foreground"
              initial={{ opacity: 0, y: 18, rotate: -1.5 }}
              animate={{ opacity: 1, y: [0, -4, 0], rotate: [0, -0.7, 0] }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                opacity: { duration: 0.16, ease: "easeOut" },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
                rotate: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
              }}
            >
              {GREETINGS[greetingIndex]}
            </motion.h1>
            <motion.div
              className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-foreground/55"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
            >
              <span className="h-px w-8 bg-border" />
              {/* <span>loading the little things</span> */}
              <span className="h-px w-8 bg-border" />
            </motion.div>
            <motion.div
              className="mt-7 h-[2px] w-full max-w-80 overflow-hidden rounded-full bg-border"
              initial={{ opacity: 0, scaleX: 0.82 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.35 }}
            >
              <motion.div
                className="h-full origin-left bg-primary"
                animate={{ scaleX: Math.max(progress, 18) / 100 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </motion.div>
            <motion.p
              className="mt-4 font-mono text-xs text-foreground/65"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.5 }}
            >
              <span className="caret ml-1 text-primary">|</span>
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
