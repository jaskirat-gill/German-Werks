'use client';

import { motion } from 'framer-motion';

export function ChapterIntroMobile({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section
      className="grain relative flex flex-col items-center justify-center overflow-hidden px-5 py-24 text-center"
      style={{
        background: 'var(--color-gw-ink)',
        color: 'var(--color-gw-bone)',
        minHeight: '80svh',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.18, 0.7, 0.2, 1] }}
        className="relative z-[2]"
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-gw-accent)',
            marginBottom: 16,
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(56px, 14vw, 96px)',
            fontWeight: 400,
            fontStyle: 'italic',
            letterSpacing: '-0.03em',
            lineHeight: 0.92,
          }}
        >
          {title}
        </div>
        <div
          className="mx-auto mt-5"
          style={{
            height: 1,
            width: 80,
            background: 'var(--color-gw-accent)',
            opacity: 0.6,
          }}
        />
        <div
          className="mt-3"
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
        <div
          className="mt-12"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            opacity: 0.5,
          }}
        >
          Scroll ↓
        </div>
      </motion.div>
    </section>
  );
}
