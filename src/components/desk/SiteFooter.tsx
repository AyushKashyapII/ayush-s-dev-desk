/**
 * The page's actual footer: a solid strip the senbazuru mountains rest on,
 * like ground. Kept separate from the crane scene so nothing in here is drawn
 * inside the landscape.
 */
export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-[oklch(0.45_0.02_250_/_0.25)] bg-[oklch(0.94_0.008_80)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 font-mono text-[11px] text-muted-foreground sm:flex-row sm:px-10">
        <span>© {new Date().getFullYear()} Ayush Kashyap</span>
        <span className="text-muted-foreground/70">folded with paper, code &amp; coffee</span>
        <a href="#hero" className="transition-colors hover:text-foreground">
          back to top ↑
        </a>
      </div>
    </footer>
  );
}
