import { useEffect, useState, type CSSProperties } from "react";

interface CutoutImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  draggable?: boolean;
}

function stripCheckerboard(inputSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(inputSrc);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max - min;
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        // Remove high-luminance neutral grays (common checkerboard export artifacts).
        if (luminance > 172 && saturation < 22) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => resolve(inputSrc);
    img.src = inputSrc;
  });
}

export type EdgeMatteOptions = {
  threshold: number;
  feather?: number;
};

function colorDistSq(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return dr * dr + dg * dg + db * db;
}

function dominantEdgeColor(data: Uint8ClampedArray, w: number, h: number): [number, number, number] {
  const step = Math.max(2, Math.floor(Math.min(w, h) / 48));
  const quant = (v: number) => Math.round(v / 10) * 10;
  const counts = new Map<string, { r: number; g: number; b: number; n: number }>();

  const add = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = (y * w + x) * 4;
    if (data[i + 3] < 16) return;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${quant(r)},${quant(g)},${quant(b)}`;
    const cur = counts.get(key);
    if (cur) {
      cur.r += r;
      cur.g += g;
      cur.b += b;
      cur.n += 1;
    } else {
      counts.set(key, { r, g, b, n: 1 });
    }
  };

  for (let x = 0; x < w; x += step) {
    add(x, 0);
    add(x, h - 1);
  }
  for (let y = 0; y < h; y += step) {
    add(0, y);
    add(w - 1, y);
  }

  let best: { r: number; g: number; b: number; n: number } | null = null;
  for (const v of counts.values()) {
    if (!best || v.n > best.n) best = v;
  }
  if (!best) return [248, 248, 246];
  return [Math.round(best.r / best.n), Math.round(best.g / best.n), Math.round(best.b / best.n)];
}

function stripEdgeMatte(inputSrc: string, opts: EdgeMatteOptions): Promise<string> {
  const threshold = opts.threshold;
  const feather = opts.feather ?? 14;
  const threshSq = threshold * threshold;
  const outer = threshold + feather;
  const outerSq = outer * outer;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(inputSrc);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const w = canvas.width;
      const h = canvas.height;
      const [br, bg, bb] = dominantEdgeColor(data, w, h);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a0 = data[i + 3];
        if (a0 < 8) continue;

        const dSq = colorDistSq(r, g, b, br, bg, bb);
        if (dSq <= threshSq) {
          data[i + 3] = 0;
        } else if (dSq < outerSq && feather > 0) {
          const d = Math.sqrt(dSq);
          const t = (d - threshold) / feather;
          data[i + 3] = Math.round(a0 * Math.min(1, Math.max(0, t)));
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => resolve(inputSrc);
    img.src = inputSrc;
  });
}

/** Removes pixels similar to the dominant border color (studio / wall backgrounds). */
export function EdgeMattedImage({
  src,
  alt,
  className,
  style,
  draggable = false,
  threshold,
  feather = 14,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  draggable?: boolean;
  threshold: number;
  feather?: number;
}) {
  const [processedSrc, setProcessedSrc] = useState(src);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    setReady(false);

    stripEdgeMatte(src, { threshold, feather }).then((cleanSrc) => {
      if (alive) {
        setProcessedSrc(cleanSrc);
        setReady(true);
      }
    });

    return () => {
      alive = false;
    };
  }, [src, threshold, feather]);

  return (
    <img
      src={processedSrc}
      alt={alt}
      className={className}
      style={{ ...style, opacity: ready ? style?.opacity : 0 }}
      draggable={draggable}
    />
  );
}

export function CutoutImage({
  src,
  alt,
  className,
  style,
  draggable = false,
}: CutoutImageProps) {
  const [processedSrc, setProcessedSrc] = useState(src);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    setReady(false);

    stripCheckerboard(src).then((cleanSrc) => {
      if (alive) {
        setProcessedSrc(cleanSrc);
        setReady(true);
      }
    });

    return () => {
      alive = false;
    };
  }, [src]);

  return (
    <img
      src={processedSrc}
      alt={alt}
      className={className}
      style={{ ...style, opacity: ready ? style?.opacity : 0 }}
      draggable={draggable}
    />
  );
}
