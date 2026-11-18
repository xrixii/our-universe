'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export default function Panel({ children, className = '', animate = true }: PanelProps) {
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`glass rounded-2xl ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`glass rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
