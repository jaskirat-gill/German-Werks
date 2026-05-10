'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { CarWireframe } from './car-wireframe';
import { ScrollIndicator } from 'components/homepage/scroll-indicator';
import Link from 'next/link';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <CarWireframe />
    </>
  );
}

export function MercedesHero() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleLost = (e: Event) => { e.preventDefault(); setContextLost(true); };
    const handleRestored = () => setContextLost(false);
    canvas.addEventListener('webglcontextlost', handleLost);
    canvas.addEventListener('webglcontextrestored', handleRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestored);
    };
  }, []);

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* 3D Background */}
      {!reducedMotion && !contextLost && (
        <div className="absolute inset-0 -z-10">
          <Suspense fallback={null}>
            <Canvas
              ref={canvasRef}
              camera={{ position: [0, 0.5, 5], fov: 40 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              style={{ background: 'transparent' }}
            >
              <Scene />
            </Canvas>
          </Suspense>
        </div>
      )}

      {/* Hero overlay content */}
      <div className="relative z-10 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[5px] text-gw-accent">
          By Car Enthusiasts. For Car Enthusiasts.
        </p>
        <h1 className="font-heading text-5xl font-bold tracking-[6px] text-gw-text md:text-7xl">
          GERMANWERKS
        </h1>
        <p className="mt-3 text-sm uppercase tracking-[2px] text-gw-muted">
          Premium Carbon Fiber & Performance
        </p>
        <Link
          href="/search"
          className="mt-8 inline-block border border-gw-accent px-8 py-3 text-xs font-medium uppercase tracking-[3px] text-gw-accent transition-colors hover:bg-gw-accent hover:text-white"
        >
          Shop Now
        </Link>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
