import { ScrollReveal } from "components/animations/scroll-reveal";
import { getCollectionProducts } from "lib/shopify";
import { GridTileImage } from "components/grid/tile";
import Link from "next/link";

export async function ProductCarousel() {
  const products = await getCollectionProducts({
    collection: "hidden-homepage-carousel",
  });

  if (!products?.length) return null;

  return (
    <section className="py-16">
      <ScrollReveal>
        <div className="mx-auto max-w-screen-xl px-6">
          <p className="mb-6 text-xs uppercase tracking-[3px] text-gw-muted">
            More Products →
          </p>
        </div>
        <div className="relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-gw-black to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-gw-black to-transparent" />

          {/* Scrollable strip */}
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide">
            {products.map((product) => (
              <Link
                key={product.handle}
                href={`/product/${product.handle}`}
                prefetch={true}
                className="relative aspect-square w-64 flex-none snap-start md:w-72"
              >
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount: product.priceRange.maxVariantPrice.amount,
                    currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                  }}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 768px) 288px, 256px"
                />
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
