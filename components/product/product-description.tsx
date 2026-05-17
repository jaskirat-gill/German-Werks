import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import type { Product } from 'lib/shopify/types';
import { VariantSelector } from './variant-selector';

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

export function ProductDescription({ product }: { product: Product }) {
  const vol = volNumberFor(product);

  return (
    <div className="flex flex-col gap-6" style={{ color: 'var(--color-gw-bone)' }}>
      {vol ? (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10.5px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-gw-accent)',
          }}
        >
          {vol.toUpperCase()}
        </div>
      ) : null}

      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(34px, 4vw, 56px)',
          lineHeight: 0.96,
          letterSpacing: '-0.02em',
          fontWeight: 400,
        }}
      >
        {product.title}
      </h1>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        <Price
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
        />
      </div>

      <div className="mt-2">
        <VariantSelector options={product.options} variants={product.variants} />
      </div>

      <AddToCart product={product} />

      {product.descriptionHtml ? (
        <Prose
          className="mt-6 text-sm leading-relaxed"
          html={product.descriptionHtml}
        />
      ) : null}
    </div>
  );
}
