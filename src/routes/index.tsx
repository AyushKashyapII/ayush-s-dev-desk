import { createFileRoute } from "@tanstack/react-router";
import { CenterIdentity } from "@/components/desk/CenterIdentity";
// import { Terminal } from "@/components/desk/Terminal";
// import { CurlPanel } from "@/components/desk/CurlPanel";
import { VinylCard } from "@/components/desk/VinylCard";
import { LanyardBadge } from "@/components/desk/LanyardBadge";
import { Vase } from "@/components/desk/Plant";
import { PixelDisplay } from "@/components/desk/PixelDisplay";
import { Moodboard } from "@/components/desk/Moodboard";
import { TablePlant } from "@/components/desk/TablePlant";
import { MusicSticker } from "@/components/desk/MusicSticker";
import { DeskExtraPhotos } from "@/components/desk/DeskExtraPhotos";
import { AboutSection, WorkSection, ContactSection, SkillsSection } from "@/components/desk/DeskScrollSections";
import { MobileDeskHero } from "@/components/desk/MobileDeskHero";
import { MobileSiteHeader } from "@/components/desk/MobileSiteHeader";
import { IntroLoader } from "@/components/desk/IntroLoader";
import anchorImg from "@/assets/desk/anchor.webp";
import { CutoutImage } from "@/components/desk/CutoutImage";
import { Senbazuru } from "@/components/desk/senbazuru/Senbazuru";
import { SiteFooter } from "@/components/desk/SiteFooter";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Ayush Kashyap | Software Engineer Portfolio" },
      {
        name: "description",
        content:
          "Explore Ayush Kashyap's software engineering portfolio, featuring interactive web apps, systems projects, terminal tools, games, skills, resume, and contact links.",
      },
      { property: "og:title", content: "Ayush Kashyap | Software Engineer Portfolio" },
      {
        property: "og:description",
        content:
          "Explore Ayush Kashyap's software engineering portfolio, projects, skills, resume, and contact links.",
      },
      { property: "og:url", content: "https://ayushkashyap.me" },
      { name: "twitter:title", content: "Ayush Kashyap | Software Engineer Portfolio" },
      {
        name: "twitter:description",
        content:
          "Explore Ayush Kashyap's software engineering portfolio, projects, skills, resume, and contact links.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden overflow-y-auto scroll-smooth">
      <IntroLoader />
      <MobileSiteHeader />

      <section id="hero" className="relative scroll-mt-2" aria-label="Portfolio hero">
        <div
          className="relative hidden md:block"
          style={{ width: 1280, minWidth: "100%", height: 1080 }}
          aria-label="Hero desk"
        >
          <a
            href="#hero"
            className="absolute top-4 left-6 z-[30] handwritten text-xl text-foreground/80 transition-opacity hover:opacity-80"
          >
            Ayush
          </a>
          <nav
            className="absolute top-5 right-8 z-[30] flex gap-6 text-xs font-mono text-muted-foreground/80"
            aria-label="Page sections"
          >
            <a href="#about" className="nav-link transition-colors hover:text-foreground">
              About
            </a>
            <a href="#work" className="nav-link transition-colors hover:text-foreground">
              Work
            </a>
            <a href="#contact" className="nav-link transition-colors hover:text-foreground">
              Contact
            </a>
          </nav>

          <CenterIdentity />

          <div className="absolute inset-0">
            <LanyardBadge />
            <Vase />
            <PixelDisplay />
            <VinylCard />
            <MusicSticker />
            <Moodboard />
            <TablePlant />
            <DeskExtraPhotos />
          </div>

          <div className="pointer-events-none absolute bottom-0 left-1/2 z-[5] -translate-x-1/2" style={{ width: 1060 }}>
            <CutoutImage src={anchorImg} alt="Anchor" className="h-auto w-full opacity-95 desk-image-soft" draggable={false} />
          </div>
        </div>

        <div className="block md:hidden">
          <MobileDeskHero />
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1280px] border-x border-border/30 border-dashed">
        <AboutSection />
        <SkillsSection />
        <WorkSection />
        <ContactSection />
      </div>

      <Senbazuru />
      <SiteFooter />
    </div>
  );
}
