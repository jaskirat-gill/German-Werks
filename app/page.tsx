import { MercedesHero } from "components/3d/mercedes-hero";
import { FeaturedSpotlight } from "components/homepage/featured-spotlight";
import { ProductCarousel } from "components/homepage/product-carousel";
import { TrustStats } from "components/homepage/trust-stats";
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
      <FeaturedSpotlight />
      <ProductCarousel />
      <TrustStats />
      <Footer />
    </>
  );
}
