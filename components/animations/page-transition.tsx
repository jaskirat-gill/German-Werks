'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const variants = {
  hidden: {
    opacity: 0,
    rotateY: -5,
    scale: 0.98,
    transformPerspective: 1200,
  },
  enter: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transformPerspective: 1200,
    transition: {
      duration: 0.5,
      ease,
    },
  },
  exit: {
    opacity: 0,
    rotateY: 5,
    scale: 0.98,
    transformPerspective: 1200,
    transition: {
      duration: 0.3,
      ease,
    },
  },
};

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
