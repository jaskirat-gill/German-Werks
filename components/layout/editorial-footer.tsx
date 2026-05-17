'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function EditorialFooter() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.3'],
  });

  const brandY = useTransform(scrollYProgress, [0, 1], [200, 0]);
  const brandScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const brandOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const gridY = useTransform(scrollYProgress, [0.2, 1], [100, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0.2, 0.7], [0, 1]);

  return (
    <footer
      ref={ref}
      className="grain grain-soft relative overflow-hidden px-5 pb-7 pt-16 sm:px-7 sm:pt-20 lg:px-9 lg:pb-9"
      style={{ background: 'var(--color-gw-ink)', color: 'var(--color-gw-bone)' }}
    >
      {/* Huge brand name */}
      <motion.div
        className="mb-10 sm:mb-[60px]"
        style={{
          y: brandY,
          scale: brandScale,
          opacity: brandOpacity,
          transformOrigin: 'left center',
        }}
      >
        <svg
          viewBox="0 0 1600 200"
          preserveAspectRatio="xMinYMid meet"
          className="block w-full"
          aria-label="German Werks."
        >
          <text
            x="0"
            y="160"
            fontFamily="var(--font-serif)"
            fontSize="200"
            letterSpacing="-7"
            fill="currentColor"
            fontWeight={400}
          >
            German{' '}
            <tspan fontStyle="italic" fill="var(--color-gw-accent)">
              Werks.
            </tspan>
          </text>
        </svg>
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 gap-8 border-t py-10 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4"
        style={{ borderColor: 'rgba(255,255,255,0.12)', y: gridY, opacity: gridOpacity }}
      >
        <div>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500, opacity: 0.55, marginBottom: 16 }}>Shop</h4>
          <ul className="flex flex-col gap-2.5" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em' }}>
            <li><Link href="/search" className="transition-opacity hover:opacity-60">Body &amp; Aero</Link></li>
            <li><Link href="/search" className="transition-opacity hover:opacity-60">Carbon Fibre</Link></li>
            <li><Link href="/search" className="transition-opacity hover:opacity-60">Performance</Link></li>
            <li><Link href="/search" className="transition-opacity hover:opacity-60">Wheels &amp; Suspension</Link></li>
            <li><Link href="/search" className="transition-opacity hover:opacity-60">Exhaust</Link></li>
            <li><Link href="/search" className="transition-opacity hover:opacity-60">Interior</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500, opacity: 0.55, marginBottom: 16 }}>Werks</h4>
          <ul className="flex flex-col gap-2.5" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em' }}>
            <li className="cursor-pointer transition-opacity hover:opacity-60">About</li>
            <li className="cursor-pointer transition-opacity hover:opacity-60">Journal</li>
            <li className="cursor-pointer transition-opacity hover:opacity-60">Press</li>
            <li className="cursor-pointer transition-opacity hover:opacity-60">Installer Network</li>
            <li className="cursor-pointer transition-opacity hover:opacity-60">Careers</li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500, opacity: 0.55, marginBottom: 16 }}>Support</h4>
          <ul className="flex flex-col gap-2.5" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em' }}>
            <li className="cursor-pointer transition-opacity hover:opacity-60">Fitment Guide</li>
            <li className="cursor-pointer transition-opacity hover:opacity-60">Shipping</li>
            <li className="cursor-pointer transition-opacity hover:opacity-60">Returns</li>
            <li className="cursor-pointer transition-opacity hover:opacity-60">Warranty</li>
            <li className="cursor-pointer transition-opacity hover:opacity-60">FAQ</li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500, opacity: 0.55, marginBottom: 16 }}>Showroom</h4>
          <ul className="flex flex-col gap-2.5" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em' }}>
            <li>1247 Boundary Rd.</li>
            <li>Vancouver, BC</li>
            <li>+1 (604) 555 0142</li>
            <li>hello@germanwerks.ca</li>
            <li>Mon–Sat&nbsp;&nbsp;10:00–18:00</li>
          </ul>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div
        className="flex flex-col items-center justify-between gap-2 border-t pt-9 md:flex-row"
        style={{
          borderColor: 'rgba(255,255,255,0.12)',
          fontFamily: 'var(--font-mono)',
          fontSize: '10.5px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.55,
        }}
      >
        <span>© 2026 German Werks Manufacturing Inc.</span>
        <span>Vancouver, BC</span>
        <a href="https://jaskiratgill.ca" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-100">Designed by Jaskirat Gill</a>
      </div>
    </footer>
  );
}
