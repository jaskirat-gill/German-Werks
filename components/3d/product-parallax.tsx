'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef, useCallback } from 'react';
import type { MouseEvent } from 'react';

export function ProductParallax({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [12, -12]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-12, 12]), {
    stiffness: 200,
    damping: 25,
  });
  const scale = useSpring(1, { stiffness: 200, damping: 25 });

  const handleMouse = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width);
      y.set((e.clientY - rect.top) / rect.height);
      scale.set(1.05);
    },
    [x, y, scale]
  );

  const handleLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
    scale.set(1);
  }, [x, y, scale]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className="cursor-grab overflow-hidden rounded-lg"
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
}
