'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

export type ChapterProgress = MotionValue<number>;

export function HorizontalChapter({
  index,
  title,
  subtitle,
  children,
}: {
  index: string;
  title: string;
  subtitle: string;
  children: (progress: ChapterProgress) => ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const translateX = useTransform(scrollYProgress, [0, 0.35, 0.5, 1], ['0vw', '0vw', '-100vw', '-100vw']);
  const chapterOpacity = useTransform(scrollYProgress, [0, 0.08, 0.3, 0.45], [0, 1, 1, 0]);
  const chapterScale = useTransform(scrollYProgress, [0, 0.08, 0.35, 0.45], [0.92, 1, 1, 0.88]);
  const titleX = useTransform(scrollYProgress, [0, 0.12, 0.35, 0.45], [160, 0, 0, -400]);
  const subtitleX = useTransform(scrollYProgress, [0, 0.12, 0.35, 0.45], [-100, 0, 0, 250]);
  const lineWidth = useTransform(scrollYProgress, [0.06, 0.28], ['0%', '100%']);

  // Car background — drifts right like it's driving you to the content
  const carX = useTransform(scrollYProgress, [0, 0.5], ['-10%', '15%']);
  const carOpacity = useTransform(scrollYProgress, [0, 0.1, 0.35, 0.5], [0, 0.28, 0.32, 0]);
  const carScale = useTransform(scrollYProgress, [0, 0.5], [1.05, 1.15]);

  // Content: 0 = just arrived, 1 = fully settled
  const contentProgress = useTransform(scrollYProgress, [0.48, 0.75], [0, 1]);

  return (
    <div ref={containerRef} style={{ height: '250vh', position: 'relative' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{
            width: '200vw',
            x: translateX,
          }}
        >
          {/* Left panel: Chapter title */}
          <div className="grain relative flex h-full w-screen shrink-0 items-center justify-center" style={{ background: 'var(--color-gw-ink)' }}>
            {/* Hero car — dark silhouette drifting across */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                backgroundImage: 'url("/hero-car.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center 65%',
                filter: 'grayscale(1) contrast(1.2) brightness(0.5)',
                opacity: carOpacity,
                x: carX,
                scale: carScale,
                willChange: 'transform',
              }}
            >
              {/* Darken edges so the car melts into black */}
              <div className="absolute inset-0" style={{
                background: `
                  radial-gradient(ellipse 80% 70% at 50% 55%, transparent 30%, rgba(10,10,9,0.6) 70%, rgba(10,10,9,1) 100%),
                  linear-gradient(to right, rgba(10,10,9,0.6) 0%, transparent 20%, transparent 80%, rgba(10,10,9,0.6) 100%)
                `,
              }} />
            </motion.div>

            <motion.div
              className="relative z-[2] text-center"
              style={{ opacity: chapterOpacity, scale: chapterScale }}
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

              <motion.div
                className="mt-10"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gw-bone)',
                  opacity: useTransform(scrollYProgress, [0.12, 0.25, 0.35], [0, 0.4, 0]),
                }}
              >
                Keep scrolling →
              </motion.div>
            </motion.div>

            {/* Decorative diagonal lines */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [0, 0.06]) }}
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

          {/* Right panel: Content — no overflow clip so cards aren't cut off */}
          <div className="w-screen shrink-0">
            {children(contentProgress)}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
