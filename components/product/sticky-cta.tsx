import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import type { Product } from 'lib/shopify/types';

export function StickyCta({ product }: { product: Product }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t px-5 py-3 lg:hidden"
      style={{
        background: 'var(--color-gw-ink)',
        borderColor: 'rgba(239, 234, 226, 0.14)',
        color: 'var(--color-gw-bone)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div
            className="truncate"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '13px',
              lineHeight: 1.1,
              fontWeight: 400,
            }}
          >
            {product.title}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10.5px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              opacity: 0.75,
            }}
          >
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
        </div>
        <div className="w-[180px]">
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
