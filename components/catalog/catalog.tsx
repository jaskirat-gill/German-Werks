import { getCollections } from 'lib/shopify';
import type { Product } from 'lib/shopify/types';
import { ProductTile } from './product-tile';
import { FilterBar } from './filter-bar';
import Link from 'next/link';

export async function Catalog({
  products,
  activeCollectionHandle,
  activeCollectionTitle,
}: {
  products: Product[];
  activeCollectionHandle: string | null;
  activeCollectionTitle: string | null;
}) {
  const collections = (await getCollections()).filter(
    (c) => c.handle !== '' && !c.handle.startsWith('hidden-'),
  );

  const subtitle = activeCollectionTitle
    ? `${activeCollectionTitle} · ${products.length} pieces`
    : `Three volumes · ${products.length} pieces`;

  return (
    <section
      className="grain grain-soft relative min-h-screen px-5 pb-24 pt-[120px] sm:px-7 lg:px-9"
      style={{
        background: 'var(--color-gw-ink)',
        color: 'var(--color-gw-bone)',
      }}
    >
      <div className="mb-8 flex items-end justify-between gap-6">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            opacity: 0.6,
          }}
        >
          <span>Index — 03</span>
          <strong className="mt-1.5 block text-[13px] font-medium" style={{ opacity: 1 }}>
            The Catalog
          </strong>
        </div>
        <div className="text-right">
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(36px, 5vw, 72px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              fontWeight: 400,
            }}
          >
            {activeCollectionTitle ? (
              <em style={{ fontStyle: 'italic', color: 'var(--color-gw-accent)' }}>
                {activeCollectionTitle}
              </em>
            ) : (
              <>
                The <em style={{ fontStyle: 'italic', color: 'var(--color-gw-accent)' }}>Catalog.</em>
              </>
            )}
          </h1>
          <div
            className="mt-2"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10.5px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              opacity: 0.55,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      <FilterBar collections={collections} activeCollectionHandle={activeCollectionHandle} />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(40px, 6vw, 64px)',
              lineHeight: 1.05,
              fontWeight: 400,
            }}
          >
            No pieces match.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10.5px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.55,
            }}
          >
            Try a different volume
          </p>
          <Link
            href="/search"
            className="mt-2 inline-block rounded-full border px-6 py-3 transition-colors hover:bg-gw-bone hover:text-gw-ink"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10.5px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              borderColor: 'rgba(239, 234, 226, 0.4)',
            }}
          >
            See all pieces →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductTile key={p.handle} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
