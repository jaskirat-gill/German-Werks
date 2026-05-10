import { MercedesHero } from "components/3d/mercedes-hero";
import Footer from "components/layout/footer";

export const metadata = {
  description:
    "Premium aftermarket carbon fiber and performance automotive parts. By Car Enthusiasts. For Car Enthusiasts.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <MercedesHero />
      <Footer />
    </>
  );
}
