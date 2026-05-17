'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from 'lib/shopify/types';
import Price from 'components/price';

function volNumberFor(product: Product): string | null {
  const map: Record<string, string> = {
    'body-aero': 'Vol. 01',
    'carbon-fibre': 'Vol. 02',
    'performance': 'Vol. 03',
  };
  const tags: string[] = (product as { tags?: string[] }).tags ?? [];
  for (const tag of tags) {
    const slug = tag.toLowerCase().replace(/\s+/g, '-');
    if (map[slug]) return map[slug];
  }
  return null;
}

export function ProductTile({ product }: { product: Product }) {
  const vol = volNumberFor(product);

  return (
    <Link
      href={`/product/${product.handle}`}
      prefetch
      className="group relative block overflow-hidden rounded-[14px]"
      style={{
        aspectRatio: '3/4',
        background: 'var(--color-gw-ink)',
        color: 'var(--color-gw-bone)',
        isolation: 'isolate',
      }}
    >
      {/* Image */}
      {product.featuredImage ? (
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(.18,.7,.2,1)] group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #1a1816 0%, #2a2825 60%, #0a0a08 100%)',
          }}
        />
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.35) 100%)',
        }}
      />

      {/* Top row */}
      <div className="absolute inset-x-0 top-0 z-[2] flex items-start justify-between p-4">
        {vol ? (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              opacity: 0.85,
            }}
          >
            {vol}
          </span>
        ) : (
          <span />
        )}
        {product.availableForSale ? (
          <span
            className="rounded-full border px-2.5 py-1"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              borderColor: 'rgba(255,255,255,0.45)',
            }}
          >
            In stock
          </span>
        ) : null}
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 z-[2] flex flex-col gap-2 p-4">
        <h3
          className="line-clamp-1"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(18px, 2vw, 22px)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            fontWeight: 400,
          }}
        >
          {product.title}
        </h3>
        <div
          className="flex items-center justify-between"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10.5px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            opacity: 0.75,
          }}
        >
          <span>{vol ?? '—'}</span>
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>

      {/* Hover accent line */}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
        style={{ background: 'var(--color-gw-accent)' }}
      />
    </Link>
  );
}
