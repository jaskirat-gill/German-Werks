'use client';

import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Marquee({
  items,
  accentEvery = 3,
  reverse = false,
}: {
  items: string[];
  accentEvery?: number;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const skewX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reverse ? [4, 0, -4] : [-4, 0, 4],
  );
  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ['-5%', '5%'] : ['5%', '-5%'],
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1.02, 0.97]);

  const seq = useMemo(() => {
    return items.flatMap((it, i) => [
      <span key={`a${i}`}>{it}</span>,
      <span
        key={`d${i}`}
        className={`inline-block h-2.5 w-2.5 rounded-full ${i % accentEvery === 0 ? 'bg-gw-accent' : 'bg-gw-bone'}`}
      />,
    ]);
  }, [items, accentEvery]);

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        className="relative border-y py-[22px]"
        style={{
          background: 'var(--color-gw-ink)',
          color: 'var(--color-gw-bone)',
          borderColor: 'rgba(255,255,255,0.06)',
          skewX,
          scale,
        }}
      >
        <motion.div
          className="flex gap-16 whitespace-nowrap"
          style={{
            animation: `marquee 38s linear infinite${reverse ? ' reverse' : ''}`,
            fontFamily: 'var(--font-serif)',
            fontSize: 52,
            fontStyle: 'italic',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            x: translateX,
          }}
        >
          <span className="inline-flex items-center gap-16">{seq}</span>
          <span className="inline-flex items-center gap-16">{seq}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
