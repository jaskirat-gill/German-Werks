'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type MotionValue, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { GWCrest } from 'components/layout/gw-crest';

function useClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
}

function CertPlate({
  plateTranslateY,
  plateRotate,
}: {
  plateTranslateY: MotionValue<number>;
  plateRotate: MotionValue<number>;
}) {
  const plateRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const springConfig = { stiffness: 260, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-14, 14]), springConfig);
  const scale = useSpring(1, springConfig);
  const glareOpacity = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMouse = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!plateRef.current) return;
      const rect = plateRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mouseX.set(nx);
      mouseY.set(ny);
      setGlarePos({ x: nx * 100, y: ny * 100 });
    },
    [mouseX, mouseY],
  );

  const handleEnter = useCallback(() => {
    scale.set(1.08);
    glareOpacity.set(0.35);
  }, [scale, glareOpacity]);

  const handleLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    scale.set(1);
    glareOpacity.set(0);
    setGlarePos({ x: 50, y: 50 });
  }, [mouseX, mouseY, scale, glareOpacity]);

  return (
    <motion.div
      className="hidden lg:block"
      style={{
        y: plateTranslateY,
        rotate: plateRotate,
        perspective: 800,
      }}
    >
      <motion.div
        ref={plateRef}
        onMouseMove={handleMouse}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="hc-plate relative cursor-grab overflow-hidden"
        style={{
          width: 230,
          background: 'linear-gradient(160deg, #efeae2 0%, #ddd5c6 100%)',
          color: 'var(--color-gw-ink)',
          border: '1px solid rgba(10,10,9,0.18)',
          borderRadius: 4,
          padding: '14px 16px',
          boxShadow: '0 30px 60px -20px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.5), inset 0 0 40px rgba(10,10,9,0.04)',
          fontFamily: 'var(--font-mono)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glare / light reflection overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[10] rounded"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.7), transparent 60%)`,
            opacity: glareOpacity,
            mixBlendMode: 'overlay',
          }}
        />

        <div className="relative z-[2] flex justify-between border-b pb-1.5" style={{ borderColor: 'rgba(10,10,9,0.22)', fontSize: '8.5px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          <span>Cert. of Authenticity</span>
          <span className="font-semibold">Nº 0247 / 1000</span>
        </div>
        <div className="relative z-[2] grid place-items-center py-1.5" style={{ color: 'var(--color-gw-ink)', transform: 'translateZ(20px)' }}>
          <GWCrest size={140} />
        </div>
        <div className="relative z-[2] grid grid-cols-2 gap-x-3.5 gap-y-2 border-t pt-2.5" style={{ borderColor: 'rgba(10,10,9,0.18)', fontSize: '8px', letterSpacing: '0.1em' }}>
          <div className="flex flex-col gap-0.5">
            <span style={{ textTransform: 'uppercase', opacity: 0.55, letterSpacing: '0.16em' }}>Volume</span>
            <strong style={{ fontWeight: 500, fontSize: '9.5px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>FW · 26</strong>
          </div>
          <div className="flex flex-col gap-0.5">
            <span style={{ textTransform: 'uppercase', opacity: 0.55, letterSpacing: '0.16em' }}>Material</span>
            <strong style={{ fontWeight: 500, fontSize: '9.5px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pre-Preg 2×2</strong>
          </div>
          <div className="flex flex-col gap-0.5">
            <span style={{ textTransform: 'uppercase', opacity: 0.55, letterSpacing: '0.16em' }}>Origin</span>
            <strong style={{ fontWeight: 500, fontSize: '9.5px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Stuttgart → YVR</strong>
          </div>
          <div className="flex flex-col gap-0.5">
            <span style={{ textTransform: 'uppercase', opacity: 0.55, letterSpacing: '0.16em' }}>Hand</span>
            <strong style={{ fontWeight: 500, fontSize: '9.5px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>J. Gill</strong>
          </div>
        </div>
        <div className="relative z-[2] flex items-center justify-between border-t pt-2.5" style={{ borderColor: 'rgba(10,10,9,0.22)', fontSize: '8.5px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          <span>Numbered · Signed</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 22, letterSpacing: '-0.04em', textTransform: 'none', lineHeight: 1, color: 'var(--color-gw-accent)', transform: 'rotate(-4deg) translateZ(12px)', display: 'inline-block' }}>J. G.</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HeroCard() {
  const [revealed, setRevealed] = useState(false);
  const clock = useClock();

  const { scrollY } = useScroll();
  const bgTranslateY = useTransform(scrollY, [0, 1000], [0, 450]);
  const bgScale = useTransform(scrollY, [0, 1000], [1, 1.16]);
  const cardTranslateY = useTransform(scrollY, [0, 1000], [0, 180]);
  const cardScale = useTransform(scrollY, [0, 4200], [1, 0.86]);
  const cardOpacity = useTransform(scrollY, [0, 900], [1, 0]);
  const plateTranslateY = useTransform(scrollY, [0, 800], [0, -60]);
  const plateRotate = useTransform(scrollY, [0, 800], [-2.2, -6]);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="grain relative h-screen min-h-[760px] overflow-hidden" style={{ background: 'var(--color-gw-ink)' }}>
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/hero-car.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 60%',
          filter: 'grayscale(1) contrast(1.1) brightness(0.7)',
          y: bgTranslateY,
          scale: bgScale,
          willChange: 'transform',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,0,0,0.55), transparent 70%),
              linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.65) 100%)
            `,
          }}
        />
      </motion.div>

      {/* Floating editorial card — wrapper for centering, inner for parallax */}
      <div className="absolute inset-0 z-[4] flex items-center justify-center">
        <motion.div
          className={`overflow-hidden rounded-[22px] will-change-transform ${revealed ? 'is-revealed' : 'is-animating'}`}
          style={{
            width: 'min(1280px, 86vw)',
            height: 'min(560px, 62vh)',
            background: 'var(--color-gw-bone)',
            boxShadow: '0 60px 120px -30px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
            y: cardTranslateY,
            scale: cardScale,
            opacity: cardOpacity,
          }}
        >
        <div className="absolute inset-0 flex flex-col p-[22px_26px] lg:p-[26px_30px]">
          {/* Top bar */}
          <div className="hidden items-center justify-between sm:flex" style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gw-ink)' }}>
            <span>By enthusiasts, for enthusiasts <sup style={{ opacity: 0.5 }}>©</sup></span>
            <span style={{ opacity: 0.6 }}>Index / 01 — Manifest</span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full animate-[pulse-dot_1.6s_infinite]" style={{ background: 'var(--color-gw-accent)' }} />
              Open · Now Shipping FW26
            </span>
          </div>

          {/* Middle - Title + Cert plate */}
          <div className="flex flex-1 items-center gap-6 px-1.5 py-2 lg:gap-10 lg:py-3">
            <h1
              className="hc-title flex-1"
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 500,
                fontSize: 'clamp(40px, 8vw, 160px)',
                lineHeight: 0.86,
                letterSpacing: '-0.035em',
                color: 'var(--color-gw-ink)',
              }}
            >
              <span className="line block overflow-hidden pb-[0.05em]">
                <span>An obsession,</span>
              </span>
              <span className="line block overflow-hidden pb-[0.05em]">
                <span>
                  <em className="not-italic" style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--color-gw-accent)' }}>formalised</em>
                  <sup style={{ fontFamily: 'var(--font-mono)', fontSize: '0.13em', fontWeight: 400, letterSpacing: '0.1em', verticalAlign: 'top', marginLeft: '0.1em', color: 'var(--color-gw-ink)', opacity: 0.55, textTransform: 'uppercase', fontStyle: 'normal' }}>°01</sup>
                </span>
              </span>
              <span className="line block overflow-hidden pb-[0.05em]">
                <span>in carbon.</span>
              </span>
            </h1>

            {/* Certificate of Authenticity — 3D tilt parallax, hidden on small+medium */}
            <CertPlate plateTranslateY={plateTranslateY} plateRotate={plateRotate} />
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between" style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-gw-ink)' }}>
            {/* CTA — word swap + pulsing arrow + sweeping underline */}
            <Link href="/search" className="hero-cta group inline-flex items-center gap-3">
              <span className="relative inline-block overflow-hidden" style={{ height: '1.4em', lineHeight: '1.4em' }}>
                <span className="hero-cta-text-default block transition-transform duration-400 ease-[cubic-bezier(.4,0,.2,1)] group-hover:-translate-y-full">
                  Explore the Collection
                </span>
                <span className="hero-cta-text-hover block transition-transform duration-400 ease-[cubic-bezier(.4,0,.2,1)] group-hover:-translate-y-full" style={{ color: 'var(--color-gw-accent)' }}>
                  Explore the Collection
                </span>
              </span>
              <span className="hero-cta-arrow grid h-[22px] w-[22px] place-items-center rounded-full transition-all duration-300 group-hover:scale-110 group-hover:translate-x-0.5" style={{ background: 'var(--color-gw-ink)', color: 'var(--color-gw-bone)' }}>
                <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13L13 3M13 3H6M13 3V10" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
              <span className="hero-cta-rule" />
            </Link>
            <span className="hidden sm:inline" style={{ opacity: 0.55 }}>Vancouver, BC</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{clock} PST</span>
          </div>
        </div>
      </motion.div>
      </div>

      {/* Bottom rail */}
      <div className="absolute bottom-9 left-9 z-[5] flex flex-col gap-1.5" style={{ color: 'var(--color-gw-bone)', fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        <span style={{ opacity: 0.55 }}>Reel · 2026</span>
        <span>Scroll ↓</span>
      </div>
      <div className="absolute bottom-9 right-9 z-[5] flex flex-col gap-1.5 text-right" style={{ color: 'var(--color-gw-bone)', fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        <span style={{ opacity: 0.55 }}>49.180° N · 122.922° W</span>
        <span>BC · 12°C · LIGHT RAIN</span>
      </div>
    </section>
  );
}
