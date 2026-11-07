import { HeroCard } from "components/homepage/hero-card";
import { Marquee } from "components/homepage/marquee";
import { Atelier } from "components/homepage/atelier";
import { CatalogueChapter } from "components/homepage/catalogue-chapter";

export const metadata = {
  description:
    "Premium aftermarket carbon fiber and performance automotive parts. By Car Enthusiasts. For Car Enthusiasts.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div style={{ background: 'var(--color-gw-bone)' }}>
      <HeroCard />

      <Marquee items={["Carbon", "Performance", "Forged", "Bespoke", "OEM+", "Motorsport", "Pre-Preg", "Vancouver"]} />

      {/* Chapter 02 — horizontal slide to Categories */}
      <CatalogueChapter />

      {/* Atelier flows straight in */}
      <Atelier />

      <Marquee
        items={["Now Shipping FW26", "Installer Network", "Custom Programs", "Workshop · Vancouver"]}
        reverse
      />
    </div>
  );
}
