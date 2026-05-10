import { ProductParallax } from "components/3d/product-parallax";
import { ScrollReveal } from "components/animations/scroll-reveal";
import { getCollectionProducts } from "lib/shopify";
import Link from "next/link";

export async function FeaturedSpotlight() {
  const products = await getCollectionProducts({
    collection: "hidden-homepage-featured-items",
  });

  const product = products[0];
  if (!product) return null;

  const image = product.featuredImage;

  return (
    <section className="mx-auto max-w-screen-xl px-6 py-24">
      <ScrollReveal>
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left: product image with parallax */}
          <div className="aspect-square overflow-hidden rounded-lg bg-gw-dark">
            {image ? (
              <ProductParallax
                src={image.url}
                alt={image.altText || product.title}
                width={800}
                height={800}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gw-muted">
                No image
              </div>
            )}
          </div>

          {/* Right: product details */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[3px] text-gw-accent">
              Featured
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-wide text-gw-text md:text-4xl">
              {product.title}
            </h2>
            {product.description && (
              <p className="mt-3 text-sm leading-relaxed text-gw-muted">
                {product.description}
              </p>
            )}
            <p className="mt-6 text-2xl font-bold text-gw-text">
              ${parseFloat(product.priceRange.maxVariantPrice.amount).toLocaleString()}
              <span className="ml-2 text-sm font-normal text-gw-muted">
                {product.priceRange.maxVariantPrice.currencyCode}
              </span>
            </p>
            <Link
              href={`/product/${product.handle}`}
              className="mt-8 inline-block border border-gw-accent px-8 py-3 text-xs font-medium uppercase tracking-[3px] text-gw-accent transition-colors hover:bg-gw-accent hover:text-white"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
