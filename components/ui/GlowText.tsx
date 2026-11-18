'use client';

import React from 'react';

type GlowColor = 'violet' | 'blue' | 'pink' | 'white';
type AsTag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

interface GlowTextProps {
  children: React.ReactNode;
  className?: string;
  as?: AsTag;
  glow?: GlowColor;
}

const glowStyles: Record<GlowColor, string> = {
  violet: '0 0 12px rgba(118,86,201,0.7), 0 0 32px rgba(118,86,201,0.3)',
  blue:   '0 0 12px rgba(100,139,255,0.7), 0 0 32px rgba(100,139,255,0.3)',
  pink:   '0 0 12px rgba(241,168,208,0.7), 0 0 32px rgba(241,168,208,0.3)',
  white:  '0 0 10px rgba(248,247,255,0.5), 0 0 24px rgba(248,247,255,0.2)',
};

export default function GlowText({
  children,
  className = '',
  as: Tag = 'span',
  glow = 'violet',
}: GlowTextProps) {
  return (
    <Tag
      className={className}
      style={{ textShadow: glowStyles[glow] }}
    >
      {children}
    </Tag>
  );
}
