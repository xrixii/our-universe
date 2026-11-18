'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StarfieldCanvas from '@/components/starfield/StarfieldCanvas';
import config from '@/data/config';
import { useChapter } from '@/context/ChapterContext';

// 8 Celestial Stars forming an organic heart constellation
const HEART_STARS = [
  { id: 1, x: 50, y: 32, r: 4.5, color: '#F1D5A5', name: 'Core' },
  { id: 2, x: 35, y: 20, r: 4.0, color: '#D58ACF', name: 'Memory 1' },
  { id: 3, x: 22, y: 34, r: 4.2, color: '#648BFF', name: 'Memory 2' },
  { id: 4, x: 28, y: 54, r: 3.8, color: '#7656C9', name: 'Memory 3' },
  { id: 5, x: 50, y: 78, r: 5.5, color: '#F8F7FF', name: 'Apex' },
  { id: 6, x: 72, y: 54, r: 3.8, color: '#7656C9', name: 'Memory 4' },
  { id: 7, x: 78, y: 34, r: 4.2, color: '#648BFF', name: 'Memory 5' },
  { id: 8, x: 65, y: 20, r: 4.0, color: '#D58ACF', name: 'Memory 6' },
];

const HEART_CONNECTIONS = [
  [0, 1], // Center to Left Upper
  [1, 2], // Left Upper to Left Middle
  [2, 3], // Left Middle to Left Lower
  [3, 4], // Left Lower to Apex
  [4, 5], // Apex to Right Lower
  [5, 6], // Right Lower to Right Middle
  [6, 7], // Right Middle to Right Upper
  [7, 0], // Right Upper to Center
  [1, 4], // Cross beam 1
  [7, 4], // Cross beam 2
];

export default function Chapter6Final() {
  const { goToChapter } = useChapter();
  const [particles, setParticles] = useState<
    Array<{ id: number; left: number; delay: number; duration: number; width: number }>
  >([]);

  useEffect(() => {
    // Generate gentle cosmic shower particles
    const items = Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 6 + Math.random() * 7,
      width: 1.5 + Math.random() * 1.5,
    }));
    setParticles(items);
  }, []);

  const msg = config.finalMessage;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050713] flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none">
      {/* Background Starfield Canvas with dense stars & nebula */}
      <div className="absolute inset-0 pointer-events-none">
        <StarfieldCanvas starCount={340} showNebula={true} showShootingStars={true} />
      </div>

      {/* Majestic Rotating Galaxy Spiral in Background */}
      <div
        className="absolute w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] rounded-full pointer-events-none opacity-25"
        style={{
          background:
            'conic-gradient(from 0deg, #7656C9, #648BFF, #D58ACF, #F1D5A5, transparent 75%, #7656C9)',
          filter: 'blur(60px)',
          animation: 'galaxy-rotate 75s linear infinite',
        }}
      />

      {/* Falling Cosmic Light Shower */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: -30, opacity: 0 }}
            animate={{
              y: ['0vh', '110vh'],
              opacity: [0, 0.85, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear',
            }}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              width: `${p.width}px`,
              height: `${p.width * 8}px`,
              background: 'linear-gradient(to bottom, #F8F7FF, rgba(100, 139, 255, 0.5), transparent)',
              boxShadow: '0 0 8px rgba(248, 247, 255, 0.8)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Climax Organic Heart Constellation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-52 h-44 sm:w-72 sm:h-56 mb-4 select-none"
        >
          <svg viewBox="0 0 100 90" className="w-full h-full overflow-visible">
            <defs>
              <filter id="climaxGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connecting Heart Constellation Lines */}
            {HEART_CONNECTIONS.map(([start, end], idx) => (
              <motion.line
                key={`heart-line-${idx}`}
                x1={HEART_STARS[start].x}
                y1={HEART_STARS[start].y}
                x2={HEART_STARS[end].x}
                y2={HEART_STARS[end].y}
                stroke="#648BFF"
                strokeWidth="0.5"
                strokeDasharray="2 1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.65 }}
                transition={{ delay: 0.6 + idx * 0.12, duration: 1.2, ease: 'easeOut' }}
              />
            ))}

            {/* Traveling Energy Pulse on Heart */}
            {HEART_CONNECTIONS.map(([start, end], idx) => (
              <line
                key={`pulse-line-${idx}`}
                x1={HEART_STARS[start].x}
                y1={HEART_STARS[start].y}
                x2={HEART_STARS[end].x}
                y2={HEART_STARS[end].y}
                stroke="#F1D5A5"
                strokeWidth="0.4"
                strokeDasharray="2 12"
                strokeLinecap="round"
                style={{
                  animation: 'energy-flow 3s linear infinite',
                }}
              />
            ))}

            {/* 8 Memory Stars */}
            {HEART_STARS.map((star, idx) => (
              <g key={`heart-star-${idx}`}>
                {/* Outer Glow */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.r * 2.8}
                  fill={star.color}
                  opacity="0.3"
                  filter="url(#climaxGlow)"
                  className="animate-pulse"
                />
                {/* Core */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.r * 0.8}
                  fill={star.color}
                />
                {/* White Hot Center */}
                <circle cx={star.x} cy={star.y} r={star.r * 0.35} fill="#FFFFFF" />
              </g>
            ))}
          </svg>
        </motion.div>

        {/* Staggered Final Emotional Messages */}
        <div className="space-y-3 sm:space-y-4 px-4">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="font-heading italic text-xl sm:text-2xl md:text-3xl text-[#A9AEC5] tracking-wide font-light"
          >
            {msg.line1}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="font-heading italic text-lg sm:text-xl md:text-2xl text-[#C4D4FF] tracking-wide font-light"
          >
            {msg.line2}
          </motion.p>

          {/* Grand Happy Birthday */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-4xl sm:text-6xl md:text-7xl text-white font-light tracking-wider my-3"
            style={{
              textShadow:
                '0 0 30px rgba(241, 213, 165, 0.8), 0 0 65px rgba(118, 86, 201, 0.6), 0 0 100px rgba(100, 139, 255, 0.4)',
            }}
          >
            {msg.line3}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.4, duration: 1.2 }}
            className="font-body text-xs sm:text-sm md:text-base text-[#F1D5A5] font-light max-w-md mx-auto tracking-widest uppercase"
          >
            {msg.line4}
          </motion.p>
        </div>

        {/* Explore Again Cosmic Button */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.6, duration: 1 }}
          className="mt-8 sm:mt-10"
        >
          <div className="relative group cursor-pointer">
            <div
              className="absolute -inset-2 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  'conic-gradient(from 0deg, rgba(118,86,201,0.5), rgba(100,139,255,0.6), rgba(241,213,165,0.5), rgba(118,86,201,0.5))',
                filter: 'blur(8px)',
                animation: 'portal-spin 15s linear infinite',
              }}
            />

            <button
              onClick={() => goToChapter(0)}
              className="relative z-10 px-8 sm:px-10 py-3 rounded-full font-body text-xs tracking-[0.25em] text-[#F8F7FF] uppercase transition-all duration-300 glass-cinematic hover:scale-105 cursor-pointer"
              style={{
                borderColor: 'rgba(241, 213, 165, 0.5)',
              }}
            >
              <span className="flex items-center gap-2">
                <span className="text-[#F1D5A5]">✦</span>
                EXPLORE OUR UNIVERSE AGAIN
                <span className="text-[#F1D5A5]">✦</span>
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
