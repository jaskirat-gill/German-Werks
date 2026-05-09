'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { FloatingGeometry } from './floating-geometry';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#E8E8E8" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#D4920B" />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <FloatingGeometry
          position={[-3, 0, -2]}
          scale={1.2}
          speed={0.8}
          distort={0.3}
          color="#1A1A1A"
        />
      </Float>

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <FloatingGeometry
          position={[3, 1, -3]}
          scale={0.8}
          speed={0.6}
          distort={0.4}
          color="#2A2A2A"
        />
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <FloatingGeometry
          position={[0, -1, -1.5]}
          scale={0.5}
          speed={1}
          distort={0.2}
          color="#333333"
        />
      </Float>

      <Environment preset="city" environmentIntensity={0.1} />
    </>
  );
}

export function HeroScene() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 -z-10">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
