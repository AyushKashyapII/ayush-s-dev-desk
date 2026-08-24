import { Draggable } from "./Draggable";
import { motion } from "framer-motion";
import { useState } from "react";
import { User } from "lucide-react";
import ayushImg from "@/assets/desk/ayush.webp";
import badgeHoverImg from "@/assets/desk/badgehover.webp";

export function LanyardBadge() {
  const [hovered, setHovered] = useState(false);
  const [defaultBroken, setDefaultBroken] = useState(false);
  const [hoverBroken, setHoverBroken] = useState(false);

  return (
    <Draggable initial={{ x: 20, y: -10 }} rotate={0} className="w-[210px]" zIndex={22} hoverEffect={false}>
      <motion.div
        aria-label="Hanging lanyard badge"
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{ transformOrigin: "50% 0%" }}
        className="flex flex-col items-center"
      >
        <div
          className="w-[18px] h-[170px] rounded-[3px]"
          style={{
            background:
              "repeating-linear-gradient(to bottom, oklch(0.2 0.01 270) 0 2px, oklch(0.3 0.01 270) 2px 4px)",
            boxShadow: "inset 0 0 0 1px oklch(0.15 0.01 270 / 0.5)",
          }}
        />

        <div className="-mt-1 h-2 w-7 rounded-sm bg-black/60" />

        <div
          className="relative mt-1 h-[255px] w-[170px] rounded-[12px] border"
          style={{
            borderColor: "oklch(0.35 0.01 80)",
            background:
              "linear-gradient(165deg, oklch(0.34 0.01 80), oklch(0.2 0.01 80) 48%, oklch(0.12 0.01 80) 49%, oklch(0.1 0.01 80))",
            boxShadow: "var(--shadow-lift)",
          }}
        >
          <div
            className="absolute inset-0 rounded-[12px] opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(oklch(1 0 0 / 0.22) 0.7px, transparent 0.8px)",
              backgroundSize: "10px 10px",
            }}
          />

          <div className="relative px-4 pt-4">
            <p className="text-[36px] leading-none font-black text-white/90">AK</p>
            <p className="mt-2 text-[8px] font-mono tracking-wide text-white/65">
              Love exploring, prototyping,
              <br />
              storytelling, and visual craft
            </p>
          </div>

          <div
            className="absolute left-1/2 top-[135px] h-[92px] w-[92px] -translate-x-1/2 overflow-hidden rounded-full border"
            style={{
              borderColor: "oklch(0.44 0.01 80)",
              background:
                "radial-gradient(circle at 30% 25%, oklch(0.55 0.01 255), oklch(0.3 0.01 255))",
            }}
          >
            {!defaultBroken && (
              <img
                src={ayushImg}
                alt="Ayush portrait"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                style={{ opacity: hovered ? 0 : 1 }}
                draggable={false}
                onError={() => setDefaultBroken(true)}
              />
            )}
            {!hoverBroken && (
              <img
                src={badgeHoverImg}
                alt="Ayush hover portrait"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                style={{ opacity: hovered ? 1 : 0 }}
                draggable={false}
                onError={() => setHoverBroken(true)}
              />
            )}
            {(defaultBroken || (hovered && hoverBroken)) && (
              <div className="absolute inset-0 grid place-items-center bg-black/30">
                <User className="h-9 w-9 text-white/80" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Draggable>
  );
}
