'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { GWCrest } from 'components/layout/gw-crest';

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function Wheel({ cx, cy, front, at }: { cx: number; cy: number; front?: boolean; at: (delay: number) => object }) {
  const spokes = [];
  for (let i = 0; i < 10; i++) {
    for (const d of [-0.07, 0.07]) {
      const a = (i / 10) * Math.PI * 2 + d;
      const b = (i / 10) * Math.PI * 2 + d * 0.3;
      spokes.push(
        <line
          key={`${i}${d}`}
          x1={cx + Math.cos(b) * 13}
          y1={cy + Math.sin(b) * 13}
          x2={cx + Math.cos(a) * 59.5}
          y2={cy + Math.sin(a) * 59.5}
          opacity="0.55"
          {...at(0.3)}
        />,
      );
    }
  }
  const [a0, a1] = front ? [-2.55, -1.85] : [-0.95, -0.25];
  const r = 51.3;
  return (
    <g>
      <circle cx={cx} cy={cy} r="78" {...at(0)} />
      <circle cx={cx} cy={cy} r="62.6" opacity="0.75" {...at(0)} />
      <circle cx={cx} cy={cy} r="47.2" opacity="0.18" {...at(0.3)} />
      <circle cx={cx} cy={cy} r="10" {...at(0.3)} />
      {spokes}
      <path
        d={`M ${cx + Math.cos(a0) * r} ${cy + Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${cx + Math.cos(a1) * r} ${cy + Math.sin(a1) * r}`}
        stroke="#b53319"
        strokeWidth="2.4"
        opacity="0.8"
        {...at(0.55)}
      />
    </g>
  );
}

function WireframeCar({ progress = 0 }: { progress: number }) {
  const at = (delay: number) => ({
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - clamp01((progress - delay) / (1 - delay)),
  });
  const labels = 0.6 * clamp01((progress - 0.75) / 0.25);

  return (
    <svg viewBox="0 0 1200 440" className="block w-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="wcStroke" x1="0" x2="1">
          <stop offset="0" stopColor="#efeae2" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#efeae2" stopOpacity="1" />
          <stop offset="1" stopColor="#efeae2" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="wcAccent" x1="0" x2="1">
          <stop offset="0" stopColor="#b53319" stopOpacity="0.0" />
          <stop offset="0.5" stopColor="#b53319" stopOpacity="1" />
          <stop offset="1" stopColor="#b53319" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#wcStroke)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <line x1="30" y1="378" x2="1200" y2="378" stroke="url(#wcAccent)" strokeWidth="0.8" {...at(0)} />

        {/* body: rounded nose, long hood, arched roof, long sweep into a low trunk, tapered tail */}
        <path
          d="M 100 350 C 80 348 64 334 62 318 C 58 300 60 284 62 272 C 66 248 76 226 94 216
             C 180 200 330 188 500 178 C 570 140 640 100 700 84 C 740 74 790 72 832 78
             C 930 92 1010 126 1072 150 C 1104 158 1142 162 1170 164 L 1178 169
             C 1187 186 1189 220 1183 254 C 1177 292 1164 324 1144 346 L 1136 350"
          {...at(0)}
        />
        <path d="M 100 350 L 198 350 M 346 350 L 848 350 M 996 350 L 1136 350" {...at(0)} />
        <path d="M 198 350 A 90 90 0 1 1 346 350" {...at(0)} />
        <path d="M 848 350 A 90 90 0 1 1 996 350" {...at(0)} />

        {/* shoulder, dropping line, sill sculpt, side skirt */}
        <path d="M 362 210 C 520 200 600 196 700 192 C 880 186 1040 182 1176 188" opacity="0.5" {...at(0.3)} />
        <path d="M 372 244 C 560 238 760 244 900 266" opacity="0.45" {...at(0.3)} />
        <path d="M 360 324 C 560 318 700 316 840 318" opacity="0.3" {...at(0.3)} />
        <path d="M 352 342 C 560 338 700 338 842 342" opacity="0.45" {...at(0.3)} />

        {/* pillarless glass */}
        <path d="M 522 182 L 706 94 C 742 84 792 84 828 90 C 900 102 962 132 1008 166 C 870 172 690 178 522 182 Z" {...at(0.3)} />
        <path d="M 802 88 C 806 118 808 146 808 168" opacity="0.45" {...at(0.55)} />

        {/* door, handle, mirror */}
        <path d="M 526 186 C 530 246 532 302 536 350" opacity="0.4" {...at(0.55)} />
        <path d="M 810 172 C 816 236 816 302 812 350" opacity="0.4" {...at(0.55)} />
        <path d="M 750 200 L 782 198" {...at(0.55)} />
        <path d="M 520 172 C 502 162 488 164 486 172 C 488 180 504 182 522 180" {...at(0.55)} />

        {/* front: headlight, intakes, splitter */}
        <path d="M 70 232 C 108 220 150 208 194 204 L 190 214 C 152 218 112 228 76 242 Z" opacity="0.85" {...at(0.55)} />
        <path d="M 68 300 C 90 306 116 308 142 308" opacity="0.5" {...at(0.55)} />
        <path d="M 72 318 C 92 322 112 324 136 324" opacity="0.35" {...at(0.55)} />
        <path d="M 56 354 L 150 356" stroke="url(#wcAccent)" {...at(0.55)} />

        {/* rear: trunk lip, tail-light, bumper, exhaust, diffuser */}
        <path d="M 1118 160 L 1170 164 L 1178 169" stroke="url(#wcAccent)" {...at(0.55)} />
        <path d="M 1096 178 C 1130 180 1160 184 1184 192" opacity="0.9" {...at(0.55)} />
        <path d="M 1104 188 C 1134 190 1162 194 1185 202" opacity="0.5" {...at(0.55)} />
        <path d="M 1000 286 C 1080 284 1140 282 1182 278" opacity="0.35" {...at(0.55)} />
        <ellipse cx="1140" cy="338" rx="11" ry="5" opacity="0.6" {...at(0.55)} />
        <path d="M 1050 354 L 1058 342 M 1070 354 L 1076 342 M 1090 354 L 1094 342" opacity="0.5" {...at(0.55)} />

        <Wheel cx={272} cy={300} front at={at} />
        <Wheel cx={922} cy={300} at={at} />

        {/* construction guides and dimension bracket */}
        <g opacity={clamp01(progress * 2)}>
          <line x1="272" y1="40" x2="272" y2="196" opacity="0.15" strokeDasharray="3 6" />
          <line x1="922" y1="40" x2="922" y2="86" opacity="0.15" strokeDasharray="3 6" />
        </g>
        <path d="M 62 408 L 1188 408 M 62 400 L 62 416 M 1188 400 L 1188 416" opacity="0.3" {...at(0.55)} />
      </g>

      {/* labels */}
      <g fontFamily="var(--font-mono)" fontSize="10" letterSpacing="2" fill="#efeae2" opacity={labels}>
        <text x="272" y="430" textAnchor="middle">F-AXLE</text>
        <text x="922" y="430" textAnchor="middle">R-AXLE</text>
        <text x="600" y="434" textAnchor="middle">WHEELBASE  ·  2850mm</text>
        <text x="440" y="156" textAnchor="end">FR-LIP  /  WW-118 →</text>
        <text x="1110" y="140">← DUCKTAIL  /  WW-204</text>
        <text x="1196" y="356">DIFFUSER →</text>
        <text x="48" y="356" textAnchor="end">← SPLITTER</text>
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

  const reducedMotionSetting = useReducedMotion();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => setPrefersReducedMotion(Boolean(reducedMotionSetting)), [reducedMotionSetting]);

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
