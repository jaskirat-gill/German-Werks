'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: 8,
    transformPerspective: 800,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transformPerspective: 800,
    transition: {
      duration: 0.6,
      ease,
    },
  },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
