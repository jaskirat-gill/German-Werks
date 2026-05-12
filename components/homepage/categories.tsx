'use client';

import Link from 'next/link';
import { motion, useTransform, type MotionValue } from 'framer-motion';

const CATEGORIES = [
  {
    no: 'Vol. 01',
    name: 'Body',
    italic: '& Aero',
    sub: 'Splitters · Diffusers · Wings',
    count: '48 pieces',
    bg: 'linear-gradient(135deg, #1a1816 0%, #2a2825 60%, #0a0a08 100%)',
    accent: 'linear-gradient(120deg, transparent 30%, rgba(181,51,25,0.18) 60%, transparent 100%)',
  },
  {
    no: 'Vol. 02',
    name: 'Carbon',
    italic: 'Fibre',
    sub: 'Pre-preg · 2x2 Twill',
    count: '62 pieces',
    bg: 'linear-gradient(135deg, #2a2825 0%, #14130f 100%)',
    accent: 'repeating-linear-gradient(45deg, transparent 0 6px, rgba(0,0,0,0.4) 6px 12px), repeating-linear-gradient(-45deg, transparent 0 6px, rgba(255,255,255,0.04) 6px 12px)',
  },
  {
    no: 'Vol. 03',
    name: 'Perform-',
    italic: 'ance',
    sub: 'Intake · ECU · Cooling',
    count: '37 pieces',
    bg: 'linear-gradient(135deg, #1a1916 0%, #0a0a08 100%)',
    accent: 'radial-gradient(circle at 30% 70%, rgba(181,51,25,0.3), transparent 50%)',
  },
];

function CategoryCard({
  c,
  index,
  progress,
}: {
  c: (typeof CATEGORIES)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const origins = ['right center', 'center center', 'left center'] as const;

  const delay = index * 0.15;
  const cardStart = delay;
  const cardEnd = 0.6 + delay;

  const rotateY = useTransform(
    progress,
    [cardStart, cardEnd],
    index === 0 ? [45, 0] : index === 2 ? [-45, 0] : [0, 0],
  );
  const rotateX = useTransform(progress, [cardStart, cardEnd], [18, 0]);
  const opacity = useTransform(progress, [cardStart, cardStart + 0.2], [0, 1]);
  const scale = useTransform(progress, [cardStart, cardEnd], [0.75, 1]);
  const y = useTransform(progress, [cardStart, cardEnd], [60 + index * 25, 0]);

  return (
    <motion.div
      style={{
        perspective: 1200,
        transformOrigin: origins[index] ?? 'center center',
      }}
    >
      <motion.div style={{ rotateY, rotateX, opacity, scale, y }}>
        <Link
          href="/search"
          className="cat group relative block cursor-pointer overflow-hidden rounded-[14px]"
          style={{ aspectRatio: '3/4', maxHeight: '65vh', background: 'var(--color-gw-ink)', isolation: 'isolate' }}
        >
          <div
            className="cat-img absolute"
            style={{ inset: '-6%', backgroundSize: 'cover', backgroundPosition: 'center', background: c.bg, filter: 'grayscale(0.85) contrast(1.1)' }}
          >
            <div className="absolute inset-0" style={{ background: c.accent }} />
          </div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)' }} />
          <div className="absolute inset-0 z-[2] flex flex-col justify-between p-[26px]" style={{ color: 'var(--color-gw-bone)' }}>
            <div className="flex items-start justify-between">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.85 }}>{c.no}</span>
              <span className="rounded-full border px-2.5 py-1" style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', borderColor: 'rgba(255,255,255,0.45)' }}>In stock</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 52, lineHeight: 0.92, letterSpacing: '-0.02em', fontWeight: 400 }}>
                {c.name}<br /><em style={{ fontStyle: 'italic' }}>{c.italic}</em>
              </h3>
              <div className="mt-1 flex justify-between" style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>
                <span>{c.sub}</span>
                <span>{c.count}</span>
              </div>
            </div>
          </div>
          <div className="cat-arrow absolute bottom-[22px] right-[22px] z-[3] grid h-11 w-11 place-items-center rounded-full" style={{ background: 'var(--color-gw-bone)', color: 'var(--color-gw-ink)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function Categories({ progress }: { progress: MotionValue<number> }) {
  const headOpacity = useTransform(progress, [0, 0.3], [0, 1]);
  const headX = useTransform(progress, [0, 0.4], [-80, 0]);

  return (
    <section className="grain grain-soft relative flex h-full flex-col justify-center px-9 py-16" style={{ background: 'var(--color-gw-paper)', color: 'var(--color-gw-ink)' }}>
      {/* Section head */}
      <motion.div
        className="mb-12 grid items-end gap-[60px]"
        style={{ gridTemplateColumns: '200px 1fr', x: headX, opacity: headOpacity }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6 }}>
          <span>Index — 02</span>
          <strong className="mt-1.5 block text-[13px] font-medium" style={{ opacity: 1 }}>The Catalogue</strong>
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(48px, 7vw, 120px)', lineHeight: 0.92, letterSpacing: '-0.03em', fontWeight: 400 }}>
          Three pillars.{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--color-gw-accent)' }}>One obsession.</em>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.12em', letterSpacing: '0.18em', textTransform: 'uppercase', verticalAlign: 'top', opacity: 0.5, display: 'inline-block', marginLeft: '0.4em', fontStyle: 'normal' }}>— 147 SKUs</span>
        </h2>
      </motion.div>

      {/* Category grid */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
        {CATEGORIES.map((c, i) => (
          <CategoryCard key={c.name} c={c} index={i} progress={progress!} />
        ))}
      </div>
    </section>
  );
}
