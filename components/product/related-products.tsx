import Link from 'next/link';
import { getProductRecommendations } from 'lib/shopify';
import { ProductTile } from 'components/catalog/product-tile';

function collectionHandleFor(tags: string[] | undefined): string | null {
  if (!tags) return null;
  const map: Record<string, string> = {
    'body-aero': 'body-aero',
    'carbon-fibre': 'carbon-fibre',
    'performance': 'performance',
  };
  for (const tag of tags) {
    const slug = tag.toLowerCase().replace(/\s+/g, '-');
    if (map[slug]) return map[slug];
  }
  return null;
}

export async function RelatedProducts({
  productId,
  productTags,
}: {
  productId: string;
  productTags?: string[];
}) {
  const related = await getProductRecommendations(productId);
  if (!related.length) return null;

  const collection = collectionHandleFor(productTags);
  const seeAllHref = collection ? `/search/${collection}` : '/search';

  return (
    <section
      className="px-5 pb-24 sm:px-7 lg:px-9"
      style={{
        background: 'var(--color-gw-ink)',
        color: 'var(--color-gw-bone)',
      }}
    >
      <div className="mb-8 flex items-center justify-between">
        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            opacity: 0.6,
          }}
        >
          In the same volume
        </h2>
        <Link
          href={seeAllHref}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            opacity: 0.75,
          }}
        >
          → See all
        </Link>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12"
          style={{ background: 'linear-gradient(to right, var(--color-gw-ink), transparent)' }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12"
          style={{ background: 'linear-gradient(to left, var(--color-gw-ink), transparent)' }}
        />

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {related.map((p) => (
            <div
              key={p.handle}
              className="snap-start"
              style={{ flex: '0 0 auto', width: 'min(78vw, 320px)' }}
            >
              <ProductTile product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
