'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ProductParallax } from 'components/3d/product-parallax';
import Image from 'next/image';

type GalleryImage = { src: string; altText: string };

export function PdpGallery({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageIndex = searchParams.has('image')
    ? Math.max(0, Math.min(images.length - 1, parseInt(searchParams.get('image')!)))
    : 0;

  const updateImage = (index: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('image', String(index));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const active = images[imageIndex];

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative overflow-hidden rounded-[14px]"
        style={{
          aspectRatio: '4/5',
          maxHeight: '82svh',
          background: 'var(--color-gw-ink)',
        }}
      >
        {active ? (
          <ProductParallax
            src={active.src}
            alt={active.altText}
            width={1200}
            height={1500}
          />
        ) : (
          <div className="h-full w-full" style={{ background: 'rgba(239, 234, 226, 0.04)' }} />
        )}
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={`${img.src}-${i}`}
              type="button"
              onClick={() => updateImage(i)}
              aria-label={`Show image ${i + 1}`}
              className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md transition-all"
              style={{
                border: i === imageIndex ? '2px solid var(--color-gw-accent)' : '1px solid rgba(239, 234, 226, 0.18)',
                background: 'var(--color-gw-ink)',
              }}
            >
              <Image
                src={img.src}
                alt={img.altText}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
