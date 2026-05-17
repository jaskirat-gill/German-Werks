'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

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
    accent:
      'repeating-linear-gradient(45deg, transparent 0 6px, rgba(0,0,0,0.4) 6px 12px), repeating-linear-gradient(-45deg, transparent 0 6px, rgba(255,255,255,0.04) 6px 12px)',
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

export function CategoriesMobile() {
  return (
    <section
      className="grain grain-soft relative flex flex-col gap-6 px-5 pb-16 pt-[100px]"
      style={{ background: 'var(--color-gw-paper)', color: 'var(--color-gw-ink)' }}
    >
      {/* Section head */}
      <div className="mb-2">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            opacity: 0.6,
          }}
        >
          <span>Index — 02</span>
          <strong className="mt-1.5 block text-[13px] font-medium" style={{ opacity: 1 }}>
            The Catalogue
          </strong>
        </div>
        <h2
          className="mt-4"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(40px, 11vw, 64px)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            fontWeight: 400,
          }}
        >
          Three pillars.{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--color-gw-accent)' }}>One obsession.</em>
        </h2>
      </div>

      {/* Stacked cards */}
      {CATEGORIES.map((c, i) => (
        <motion.div
          key={c.name}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: i * 0.05, ease: [0.18, 0.7, 0.2, 1] }}
        >
          <Link
            href="/search"
            className="relative block overflow-hidden rounded-[14px]"
            style={{
              aspectRatio: '4/5',
              background: 'var(--color-gw-ink)',
              isolation: 'isolate',
            }}
          >
            <div
              className="absolute"
              style={{
                inset: '-6%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                background: c.bg,
                filter: 'grayscale(0.85) contrast(1.1)',
              }}
            >
              <div className="absolute inset-0" style={{ background: c.accent }} />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)',
              }}
            />
            <div
              className="absolute inset-0 z-[2] flex flex-col justify-between p-5"
              style={{ color: 'var(--color-gw-bone)' }}
            >
              <div className="flex items-start justify-between">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    opacity: 0.85,
                  }}
                >
                  {c.no}
                </span>
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
              </div>
              <div className="flex flex-col gap-2">
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 44,
                    lineHeight: 0.92,
                    letterSpacing: '-0.02em',
                    fontWeight: 400,
                  }}
                >
                  {c.name}
                  <br />
                  <em style={{ fontStyle: 'italic' }}>{c.italic}</em>
                </h3>
                <div
                  className="mt-1 flex justify-between"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    opacity: 0.7,
                  }}
                >
                  <span>{c.sub}</span>
                  <span>{c.count}</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </section>
  );
}
