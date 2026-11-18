'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarfieldCanvas from '@/components/starfield/StarfieldCanvas';
import MemoryPanel from '@/components/chapters/MemoryPanel';
import memories from '@/data/memories';
import type { Memory } from '@/types';

// Constellation connecting links
const CONNECTIONS: [string, string][] = [
  ['memory-01', 'memory-02'],
  ['memory-02', 'memory-07'],
  ['memory-07', 'memory-03'],
  ['memory-03', 'memory-06'],
  ['memory-06', 'memory-08'],
  ['memory-08', 'memory-04'],
  ['memory-04', 'memory-05'],
  ['memory-05', 'memory-01'],
  ['memory-02', 'memory-04'],
];

export default function Chapter2Constellation() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set());
  const [instructionDismissed, setInstructionDismissed] = useState(false);

  const memMap = useMemo(() => new Map(memories.map((m) => [m.id, m])), []);

  const handleStarClick = useCallback((memory: Memory) => {
    setSelectedMemory(memory);
    setDiscoveredIds((prev) => {
      const next = new Set(prev);
      next.add(memory.id);
      return next;
    });
    setInstructionDismissed(true);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedMemory(null);
  }, []);

  // Calculate zoom focus point if a star is selected
  const zoomOrigin = selectedMemory
    ? `${selectedMemory.x}% ${selectedMemory.y}%`
    : '50% 50%';

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050713]">
      {/* Background Starfield with high-res nebula & celestial body */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: selectedMemory ? 1.08 : 1,
          opacity: selectedMemory ? 0.35 : 1,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: zoomOrigin }}
      >
        <StarfieldCanvas starCount={280} showNebula={true} showPlanet={false} showShootingStars={true} />
      </motion.div>

      {/* Atmospheric Radial Nebula Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(100, 139, 255, 0.08) 0%, rgba(118, 86, 201, 0.05) 50%, #050713 95%)',
        }}
      />

      {/* Top Header & Discovery Counter */}
      <header className="absolute top-4 sm:top-6 left-0 right-0 z-30 px-6 sm:px-10 flex items-center justify-between pointer-events-none">
        <div>
          <h2 className="font-heading italic text-xl sm:text-2xl text-[#F8F7FF] tracking-wide flex items-center gap-2">
            <span className="text-[#F1D5A5]">✦</span> Our Universe
          </h2>
          <p className="font-body text-[10px] sm:text-xs text-[#777F9F] tracking-widest uppercase">
            Interactive Constellation
          </p>
        </div>

        {/* Discovery Counter Badge */}
        <div
          className="glass-cinematic px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-body tracking-wider text-[#F8F7FF]"
          style={{
            borderColor: 'rgba(241, 213, 165, 0.3)',
            background: 'rgba(14, 19, 42, 0.65)',
          }}
        >
          <span className="text-[#F1D5A5] animate-pulse">✦</span>
          <span>
            {discoveredIds.size} / {memories.length} Discovered
          </span>
        </div>
      </header>

      {/* Main Interactive Constellation SVG Layer */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={{
          scale: selectedMemory ? 1.12 : 1,
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: zoomOrigin }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-w-4xl max-h-screen p-4 sm:p-12 overflow-visible select-none"
          style={{ touchAction: 'none' }}
        >
          <defs>
            {/* Luminous Glow Filter */}
            <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.0" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Line Glow Filter */}
            <filter id="lineGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear Gradients for traveling energy */}
            <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#648BFF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#D58ACF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F1D5A5" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* 1. Base Constellation Lines */}
          {CONNECTIONS.map(([fromId, toId]) => {
            const from = memMap.get(fromId);
            const to = memMap.get(toId);
            if (!from || !to) return null;

            const isConnectedToSelected =
              selectedMemory && (fromId === selectedMemory.id || toId === selectedMemory.id);
            const isDiscovered =
              discoveredIds.has(fromId) && discoveredIds.has(toId);

            return (
              <g key={`connection-${fromId}-${toId}`}>
                {/* Main line stroke */}
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isConnectedToSelected ? '#F1D5A5' : isDiscovered ? '#648BFF' : '#3347B9'}
                  strokeWidth={isConnectedToSelected ? 0.35 : 0.18}
                  strokeOpacity={isConnectedToSelected ? 0.9 : isDiscovered ? 0.55 : 0.3}
                  strokeDasharray="1.2 0.8"
                  filter={isConnectedToSelected ? 'url(#lineGlow)' : undefined}
                  className="transition-all duration-500"
                />

                {/* Animated Traveling Energy Pulse on Active/Discovered Lines */}
                {(isConnectedToSelected || isDiscovered) && (
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="url(#energyGrad)"
                    strokeWidth={0.3}
                    strokeDasharray="3 20"
                    strokeLinecap="round"
                    style={{
                      animation: 'energy-flow 4s linear infinite',
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* 2. Interactive Memory Stars */}
          {memories.map((memory) => {
            const isHovered = hoveredId === memory.id;
            const isSelected = selectedMemory?.id === memory.id;
            const isDiscovered = discoveredIds.has(memory.id);

            const baseRadius = memory.size * 0.11;
            const starColor = isSelected
              ? '#F1D5A5'
              : isDiscovered
              ? '#F8F7FF'
              : isHovered
              ? '#D58ACF'
              : '#648BFF';

            return (
              <g
                key={memory.id}
                transform={`translate(${memory.x}, ${memory.y})`}
                role="button"
                aria-label={`Star: ${memory.title}${isDiscovered ? ' (discovered)' : ''}`}
                tabIndex={0}
                className="cursor-pointer focus:outline-none"
                onClick={() => handleStarClick(memory)}
                onMouseEnter={() => setHoveredId(memory.id)}
                onMouseLeave={() => setHoveredId(null)}
                onTouchStart={() => setHoveredId(memory.id)}
                onTouchEnd={() => {
                  handleStarClick(memory);
                  setHoveredId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleStarClick(memory);
                  }
                }}
              >
                <title>{memory.title}</title>

                {/* Large Ambient Atmospheric Halo */}
                <circle
                  r={baseRadius * (isSelected ? 5.0 : isHovered ? 4.0 : 2.8)}
                  fill={isSelected ? '#F1D5A5' : isDiscovered ? '#7656C9' : '#648BFF'}
                  opacity={isSelected ? 0.45 : isHovered ? 0.35 : 0.16}
                  filter="url(#starGlow)"
                  className="transition-all duration-300"
                />

                {/* Pulsing Orbital Ring when Selected */}
                {isSelected && (
                  <circle
                    r={baseRadius * 3.2}
                    fill="none"
                    stroke="#F1D5A5"
                    strokeWidth="0.2"
                    strokeDasharray="1.5 1.5"
                    className="animate-spin"
                    style={{ transformOrigin: '0 0', animationDuration: '8s' }}
                  />
                )}

                {/* Cross Diffraction Spikes */}
                <g
                  opacity={isSelected ? 0.9 : isHovered ? 0.75 : 0.45}
                  className="transition-opacity duration-300"
                >
                  <line
                    x1={-baseRadius * 3.5}
                    y1={0}
                    x2={baseRadius * 3.5}
                    y2={0}
                    stroke={starColor}
                    strokeWidth="0.12"
                  />
                  <line
                    x1={0}
                    y1={-baseRadius * 3.5}
                    x2={0}
                    y2={baseRadius * 3.5}
                    stroke={starColor}
                    strokeWidth="0.12"
                  />
                </g>

                {/* Bright Star Core */}
                <circle
                  r={baseRadius * (isSelected ? 1.4 : isHovered ? 1.25 : 1)}
                  fill={starColor}
                  filter="url(#starGlow)"
                  className="transition-all duration-200"
                />

                {/* White Hot Center */}
                <circle r={baseRadius * 0.55} fill="#FFFFFF" />

                {/* Accessible Touch / Click Target (Expanded Radius) */}
                <circle r={6.5} fill="transparent" />
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Floating Bottom Instruction Banner */}
      {!instructionDismissed && !selectedMemory && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-16 sm:bottom-20 left-0 right-0 z-30 flex justify-center pointer-events-none px-4"
        >
          <div className="glass-cinematic px-5 py-2 rounded-full text-xs font-heading italic text-[#C4D4FF] tracking-wider flex items-center gap-2">
            <span className="text-[#F1D5A5]">✦</span>
            Touch a star. Every star has a story.
          </div>
        </motion.div>
      )}

      {/* Cinematic Memory Modal Presentation Panel */}
      <MemoryPanel
        memory={selectedMemory}
        isOpen={Boolean(selectedMemory)}
        onClose={handleClose}
      />
    </div>
  );
}
