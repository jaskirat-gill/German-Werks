import { Suspense } from 'react';
import type { Image, Product } from 'lib/shopify/types';
import { PdpGallery } from './pdp-gallery';
import { ProductDescription } from './product-description';

export function Pdp({ product }: { product: Product }) {
  const images = product.images.slice(0, 8).map((image: Image) => ({
    src: image.url,
    altText: image.altText,
  }));

  return (
    <section
      className="grain px-5 pb-24 pt-[120px] sm:px-7 lg:px-9"
      style={{
        background: 'var(--color-gw-ink)',
        color: 'var(--color-gw-bone)',
      }}
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:gap-14">
        <div>
          <Suspense
            fallback={
              <div
                className="aspect-[4/5] w-full rounded-[14px]"
                style={{ background: 'rgba(239, 234, 226, 0.06)' }}
              />
            }
          >
            <PdpGallery images={images} />
          </Suspense>
        </div>

        <aside className="lg:sticky lg:top-[88px] lg:self-start lg:pb-[120px]">
          <Suspense fallback={null}>
            <ProductDescription product={product} />
          </Suspense>
        </aside>
      </div>
    </section>
  );
}
