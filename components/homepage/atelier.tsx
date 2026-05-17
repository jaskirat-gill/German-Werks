'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { GWCrest } from 'components/layout/gw-crest';

function WireframeCar({ progress = 0 }: { progress: number }) {
  return (
    <svg viewBox="0 0 1200 440" className="block w-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="wcStroke" x1="0" x2="1">
          <stop offset="0" stopColor="#efeae2" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#efeae2" stopOpacity="1" />
          <stop offset="1" stopColor="#efeae2" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="wcAccent" x1="0" x2="1">
          <stop offset="0" stopColor="#b53319" stopOpacity="0.0" />
          <stop offset="0.5" stopColor="#b53319" stopOpacity="1" />
          <stop offset="1" stopColor="#b53319" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#wcStroke)"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: progress, transition: 'opacity 1.4s cubic-bezier(.18,.7,.2,1)' }}
      >
        {/* ground line */}
        <line x1="40" y1="378" x2="1160" y2="378" stroke="url(#wcAccent)" strokeWidth="0.8" />

        {/* main body silhouette — long, low coupe with fastback */}
        <path d="M 80 340
                 C 100 340 115 338 130 334
                 L 180 318
                 C 210 308 240 300 280 296
                 L 360 288
                 C 390 284 420 276 440 260
                 L 490 228
                 C 510 210 540 198 580 192
                 L 680 188
                 C 720 188 760 192 790 200
                 L 860 224
                 C 890 238 920 256 940 272
                 L 1000 296
                 C 1030 304 1060 312 1080 320
                 L 1110 334
                 C 1120 338 1125 342 1130 346
                 L 1130 356
                 L 1070 362" />
        <path d="M 80 340 L 80 356 L 145 362" />

        {/* roof / greenhouse — long sweeping fastback */}
        <path d="M 440 260
                 C 455 244 475 232 500 222
                 L 590 208
                 L 740 208
                 C 770 212 800 222 830 240
                 L 860 258" />

        {/* A-pillar — steep rake */}
        <path d="M 448 256 L 504 224" />

        {/* B-pillar — thin coupe pillar */}
        <path d="M 648 210 L 648 278" opacity="0.4" />

        {/* C-pillar / fastback slope */}
        <path d="M 828 240 L 770 212" />

        {/* belt-line — continuous sweep */}
        <path d="M 455 264 L 850 256" />

        {/* front glass */}
        <path d="M 458 260 L 506 226 L 644 218 L 648 258 Z" />

        {/* rear glass — long coupe window */}
        <path d="M 652 218 L 766 216 L 826 242 L 652 258 Z" />

        {/* hood — long and low */}
        <path d="M 280 296 L 360 286 L 430 276" />
        <path d="M 180 316 L 230 306 L 280 298" opacity="0.7" />

        {/* trunk / ducktail spoiler — subtle kick */}
        <path d="M 860 256 L 900 266 L 948 280 L 990 296" />
        <path d="M 938 274 L 948 270 L 958 274" strokeWidth="0.9" />

        {/* lower sill — aggressive rocker */}
        <path d="M 200 326 L 340 318 L 500 306 L 740 306 L 920 318 L 1080 330" opacity="0.55" />

        {/* side intake / vent */}
        <path d="M 380 302 L 420 296 L 440 300" opacity="0.5" />
        <path d="M 384 306 L 418 300" opacity="0.35" />

        {/* door seam */}
        <path d="M 550 260 L 550 306" opacity="0.4" />

        {/* mirror */}
        <path d="M 508 248 L 476 244 L 476 256" />

        {/* headlight — aggressive slant */}
        <path d="M 138 322 Q 170 314 200 318" />
        <path d="M 142 328 Q 168 322 196 326" opacity="0.5" />

        {/* front badge */}
        <circle cx="112" cy="336" r="4" stroke="url(#wcAccent)" fill="none" />

        {/* tail-light — full width LED bar */}
        <path d="M 1070 324 L 1110 338" />
        <path d="M 1058 330 L 1100 346" opacity="0.55" />
        <path d="M 1052 336 L 1094 350" opacity="0.35" />

        {/* front wheel arch + wheel */}
        <path d="M 210 340 A 62 62 0 0 1 335 340" />
        <circle cx="272" cy="348" r="52" />
        <circle cx="272" cy="348" r="35" opacity="0.7" />
        <circle cx="272" cy="348" r="9" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
          <line
            key={`fs${k}`}
            x1="272" y1="348"
            x2={272 + Math.cos((k / 10) * Math.PI * 2) * 33}
            y2={348 + Math.sin((k / 10) * Math.PI * 2) * 33}
            opacity="0.55"
          />
        ))}

        {/* rear wheel arch + wheel — wider */}
        <path d="M 860 340 A 62 62 0 0 1 985 340" />
        <circle cx="922" cy="348" r="52" />
        <circle cx="922" cy="348" r="35" opacity="0.7" />
        <circle cx="922" cy="348" r="9" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
          <line
            key={`rs${k}`}
            x1="922" y1="348"
            x2={922 + Math.cos((k / 10) * Math.PI * 2) * 33}
            y2={348 + Math.sin((k / 10) * Math.PI * 2) * 33}
            opacity="0.55"
          />
        ))}

        {/* construction guide-lines */}
        <line x1="272" y1="60" x2="272" y2="280" opacity="0.15" strokeDasharray="3 6" />
        <line x1="922" y1="60" x2="922" y2="280" opacity="0.15" strokeDasharray="3 6" />
        <line x1="40" y1="208" x2="1160" y2="208" opacity="0.12" strokeDasharray="3 6" />

        {/* dimension brackets */}
        <path d="M 80 408 L 1130 408" opacity="0.3" />
        <path d="M 80 400 L 80 416 M 1130 400 L 1130 416" opacity="0.3" />
      </g>

      {/* labels */}
      <g fontFamily="var(--font-mono)" fontSize="10" letterSpacing="2" fill="#efeae2" opacity="0.6">
        <text x="272" y="430" textAnchor="middle">F-AXLE</text>
        <text x="922" y="430" textAnchor="middle">R-AXLE</text>
        <text x="600" y="434" textAnchor="middle">WHEELBASE  ·  2850mm</text>
        <text x="480" y="172" textAnchor="end">FR-LIP  /  WW-118 →</text>
        <text x="740" y="172">← DUCKTAIL  /  WW-204</text>
        <text x="1130" y="358" textAnchor="start" dx="6">DIFFUSER →</text>
        <text x="80" y="358" textAnchor="end" dx="-6">← SPLITTER</text>
      </g>

      {/* watermark circles */}
      <g transform="translate(600 260)" opacity="0.06">
        <circle r="190" fill="none" stroke="#efeae2" strokeWidth="0.6" />
        <circle r="170" fill="none" stroke="#efeae2" strokeWidth="0.4" />
      </g>
    </svg>
  );
}

export function Atelier() {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setProgress(latest);
  });

  const carTranslateY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const crestScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1.1, 1.45]);
  const crestRotate = useTransform(scrollYProgress, [0, 1], [-15, 45]);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSeen(true);
        });
      },
      { threshold: 0.18 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const prefersReducedMotion = useReducedMotion();

  const reveal = Math.max(0, Math.min(1, (progress - 0.15) * 2.5));
  const effectiveSeen = prefersReducedMotion ? true : seen;

  const text =
    "We don't decorate cars. We finish what the factory began. Pre-preg carbon, forged aluminium, OEM+ fitment, and the patience to wait until it's right.";
  const words = text.split(' ');
  const accentWords = new Set(['finish', 'factory', 'right.', 'patience']);

  return (
    <section
      ref={ref}
      className="grain relative overflow-hidden px-5 py-24 sm:px-7 sm:py-32 lg:px-9 lg:py-[160px]"
      style={{
        background: 'radial-gradient(ellipse 90% 70% at 50% 40%, #1f1d1a 0%, #14130f 55%, #0a0a09 100%)',
        color: 'var(--color-gw-bone)',
        isolation: 'isolate',
      }}
    >
      {/* Huge watermark crest */}
      <motion.div
        className="pointer-events-none absolute left-1/2 z-0"
        style={{
          top: '46%',
          opacity: 0.06,
          x: '-50%',
          y: '-50%',
          scale: crestScale,
          rotate: crestRotate,
          color: 'var(--color-gw-bone)',
        }}
      >
        <GWCrest size={780} />
      </motion.div>

      <div className="relative z-[2] mx-auto max-w-[1500px]">
        {/* Head */}
        <div className="grid items-end gap-6 border-b pb-8 sm:gap-0 sm:pb-10" style={{ gridTemplateColumns: '1fr auto', borderColor: 'rgba(239, 234, 226, 0.14)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            <span style={{ opacity: 0.6 }}>Index — 03</span>
            <strong className="mt-1.5 block text-[13px] font-medium" style={{ color: 'var(--color-gw-bone)' }}>
              The Atelier
            </strong>
          </div>
          <div className="hidden gap-10 sm:flex" style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            <span>Tech. drawing · E63 ref</span>
            <span style={{ opacity: 0.55 }}>{String(Math.round(progress * 100)).padStart(3, '0')} · reveal</span>
          </div>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(48px, 11vw, 160px)',
            lineHeight: 0.88,
            letterSpacing: '-0.035em',
            fontWeight: 400,
            padding: '40px 0 24px',
          }}
        >
          <span className="block overflow-hidden pb-[0.04em]">
            <span
              className="inline-block will-change-transform"
              style={{
                transform: effectiveSeen ? 'translateY(0)' : 'translateY(102%)',
                transition: 'transform 1s cubic-bezier(.18,.7,.2,1)',
              }}
            >
              By <em style={{ fontStyle: 'italic', color: 'var(--color-gw-accent)' }}>enthusiasts</em>,
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <span
              className="inline-block will-change-transform"
              style={{
                transform: effectiveSeen ? 'translateY(0)' : 'translateY(102%)',
                transition: 'transform 1s cubic-bezier(.18,.7,.2,1)',
                transitionDelay: '0.12s',
              }}
            >
              for <em style={{ fontStyle: 'italic', color: 'var(--color-gw-accent)' }}>enthusiasts.</em>
            </span>
          </span>
        </h2>

        {/* Wireframe car */}
        <motion.div
          className="mx-auto max-w-[1300px] will-change-transform"
          style={{ y: carTranslateY, margin: '24px auto 40px', position: 'relative', maxHeight: '46svh' }}
        >
          <div
            className="pointer-events-none absolute"
            style={{
              inset: '-20px -40px',
              background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(181,51,25,0.10), transparent 70%)',
            }}
          />
          <WireframeCar progress={prefersReducedMotion ? 1 : reveal} />
        </motion.div>

        {/* Manifest text */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(20px, 4.4vw, 52px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            fontWeight: 400,
            maxWidth: 1200,
            margin: '32px 0 60px',
          }}
        >
          {words.map((w, i) => (
            <span key={i}>
              <span
                className="manifest-word inline-block overflow-hidden pb-[0.08em]"
              >
                <span
                  style={{
                    transform: effectiveSeen ? 'translateY(0)' : 'translateY(102%)',
                    transitionDelay: `${i * 0.035}s`,
                  }}
                >
                  {accentWords.has(w) ? (
                    <em style={{ fontStyle: 'italic', color: 'var(--color-gw-accent)' }}>{w}</em>
                  ) : (
                    w
                  )}
                </span>
              </span>{' '}
            </span>
          ))}
        </p>

        {/* Floating CTA — right edge */}
        <motion.div
          className="pointer-events-none absolute right-0 top-0 z-[10] hidden h-full items-center justify-end md:flex"
          style={{
            opacity: useTransform(scrollYProgress, [0.3, 0.45, 0.85, 0.95], [0, 1, 1, 0]),
          }}
        >
          <motion.div
            style={{
              x: useTransform(scrollYProgress, [0.3, 0.5], [140, 0]),
              rotate: useTransform(scrollYProgress, [0.3, 0.5], [8, 0]),
            }}
          >
            <Link
              href="/search"
              className="atelier-float-cta group pointer-events-auto relative flex flex-col gap-4 px-7 py-7"
              style={{
                background: 'var(--color-gw-accent)',
                color: 'var(--color-gw-bone)',
                borderRadius: '14px 0 0 14px',
                width: 180,
              }}
            >
              {/* Label */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  opacity: 0.7,
                }}
              >
                Index · 147 pieces
              </span>

              {/* Big serif text */}
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 42,
                  fontStyle: 'italic',
                  fontWeight: 400,
                  lineHeight: 0.9,
                  letterSpacing: '-0.03em',
                }}
              >
                Shop<br />Now.
              </span>

              {/* Divider + arrow row */}
              <span className="flex items-center gap-3 border-t pt-4" style={{ borderColor: 'rgba(239,234,226,0.25)' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    opacity: 0.8,
                  }}
                >
                  Explore →
                </span>
                <span
                  className="atelier-float-arrow ml-auto grid h-9 w-9 place-items-center rounded-full transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'var(--color-gw-bone)',
                    color: 'var(--color-gw-ink)',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </span>

              {/* Glow overlay */}
              <span className="atelier-float-glow pointer-events-none absolute inset-0 rounded-[14px_0_0_14px]" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Footer columns */}
        <div
          className="grid grid-cols-1 gap-9 border-t pt-10 md:grid-cols-3"
          style={{ borderColor: 'rgba(239, 234, 226, 0.14)' }}
        >
          {[
            {
              title: 'Provenance',
              text: 'Materials sourced from Bavaria, Baden-Württemberg and our Vancouver compound. Every kit numbered and certified.',
            },
            {
              title: 'Fitment',
              text: 'OEM-grade tolerances on every panel. 24-month warranty. Installer-network coverage Toronto to Tofino.',
            },
            {
              title: 'Heritage',
              text: 'Founded by enthusiasts in 2023. Operated by enthusiasts since. Built for the obsession we share.',
            },
          ].map((col) => (
            <div
              key={col.title}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                lineHeight: 1.7,
                letterSpacing: '0.04em',
                opacity: 0.8,
              }}
            >
              <strong
                className="mb-3 block"
                style={{
                  fontSize: '10.5px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  opacity: 1,
                  color: 'var(--color-gw-bone)',
                }}
              >
                {col.title}
              </strong>
              {col.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
