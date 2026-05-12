'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function PageFlipReveal({
  children,
  direction = 'left',
}: {
  children: ReactNode;
  direction?: 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.3'],
  });

  const rotateY = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'left' ? [-60, 0] : [60, 0],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  return (
    <div ref={ref} style={{ perspective: 1400 }}>
      <motion.div
        style={{
          rotateY,
          opacity,
          scale,
          transformOrigin: direction === 'left' ? 'left center' : 'right center',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function CinematicZoomReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.15'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0.5, 1]);
  const blur = useTransform(scrollYProgress, [0, 0.8], [8, 0]);

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        style={{
          scale,
          opacity,
          filter: useTransform(blur, (v) => `blur(${v}px)`),
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function HorizontalWipe({
  children,
  from = 'left',
}: {
  children: ReactNode;
  from?: 'left' | 'right' | 'center';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.35'],
  });

  const clipMap = {
    left: (p: number) => `inset(0 ${(1 - p) * 100}% 0 0)`,
    right: (p: number) => `inset(0 0 0 ${(1 - p) * 100}%)`,
    center: (p: number) => {
      const half = ((1 - p) * 50);
      return `inset(0 ${half}% 0 ${half}%)`;
    },
  };

  const clipPath = useTransform(scrollYProgress, (v) => clipMap[from](v));

  return (
    <div ref={ref}>
      <motion.div style={{ clipPath }}>
        {children}
      </motion.div>
    </div>
  );
}

export function DarkChapterBreak({
  title,
  subtitle,
  index,
}: {
  title: string;
  subtitle: string;
  index: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const titleX = useTransform(scrollYProgress, [0, 0.5, 1], [200, 0, -200]);
  const subtitleX = useTransform(scrollYProgress, [0, 0.5, 1], [-120, 0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.5], ['0%', '100%']);

  return (
    <div
      ref={ref}
      className="grain relative flex h-[60vh] items-center justify-center overflow-hidden"
      style={{ background: 'var(--color-gw-ink)' }}
    >
      <motion.div
        className="relative z-[2] text-center"
        style={{ opacity, scale }}
      >
        <motion.div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-gw-accent)',
            marginBottom: 20,
            x: subtitleX,
          }}
        >
          {index}
        </motion.div>
        <motion.div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(60px, 10vw, 160px)',
            fontWeight: 400,
            fontStyle: 'italic',
            letterSpacing: '-0.03em',
            lineHeight: 0.9,
            color: 'var(--color-gw-bone)',
            x: titleX,
          }}
        >
          {title}
        </motion.div>
        <motion.div
          className="mx-auto mt-6"
          style={{
            height: 1,
            background: 'var(--color-gw-accent)',
            width: lineWidth,
            opacity: 0.6,
          }}
        />
        <motion.div
          className="mt-4"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--color-gw-bone)',
            opacity: 0.5,
            x: subtitleX,
          }}
        >
          {subtitle}
        </motion.div>
      </motion.div>

      {/* Diagonal decorative lines */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [0, 0.08]) }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px origin-center"
            style={{
              background: 'var(--color-gw-bone)',
              width: '140%',
              left: '-20%',
              top: `${12 + i * 12}%`,
              transform: `rotate(${-3 + i * 0.5}deg)`,
              opacity: i % 2 === 0 ? 0.5 : 0.25,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function ParallaxSkew({
  children,
  skewAmount = 3,
}: {
  children: ReactNode;
  skewAmount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const skewY = useTransform(scrollYProgress, [0, 0.5, 1], [skewAmount, 0, -skewAmount]);
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={{ skewY, y }}>
        {children}
      </motion.div>
    </div>
  );
}
