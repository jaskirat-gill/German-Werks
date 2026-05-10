'use client';

import { motion } from 'framer-motion';

export function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </motion.div>
  );
}
