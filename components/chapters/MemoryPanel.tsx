'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import type { Memory } from '@/types';

interface MemoryPanelProps {
  memory: Memory | null;
  onClose: () => void;
  isOpen: boolean;
}

// Cinematic Star Chart Placeholder when photo is pending
function StarChartFallback({ title, memory }: { title: string; memory: Memory }) {
  return (
    <div
      className="relative w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        height: 240,
        background:
          'radial-gradient(circle at 50% 40%, rgba(100, 139, 255, 0.18) 0%, rgba(14, 19, 42, 0.95) 75%)',
        borderBottom: '1px solid rgba(100, 139, 255, 0.2)',
      }}
    >
      {/* Background Star Chart Constellation Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        viewBox="0 0 400 240"
        preserveAspectRatio="none"
      >
        <circle cx="200" cy="120" r="85" fill="none" stroke="#648BFF" strokeWidth="0.5" strokeDasharray="3 3" />
        <circle cx="200" cy="120" r="115" fill="none" stroke="#7656C9" strokeWidth="0.5" strokeDasharray="6 6" />
        <line x1="200" y1="0" x2="200" y2="240" stroke="#648BFF" strokeWidth="0.3" strokeDasharray="2 4" />
        <line x1="0" y1="120" x2="400" y2="120" stroke="#648BFF" strokeWidth="0.3" strokeDasharray="2 4" />
      </svg>

      {/* Orbiting Stardust Rings */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-3 relative"
          style={{
            background: 'radial-gradient(circle, rgba(118, 86, 201, 0.4) 0%, rgba(14, 19, 42, 0.8) 70%)',
            border: '1px solid rgba(241, 213, 165, 0.5)',
            boxShadow: '0 0 25px rgba(118, 86, 201, 0.5), inset 0 0 10px rgba(100, 139, 255, 0.3)',
          }}
        >
          <Sparkles size={24} className="text-[#F1D5A5] animate-pulse" />
        </div>

        <h4 className="font-heading italic text-xl text-[#F8F7FF] tracking-wide mb-1 text-glow-gold">
          {title}
        </h4>
        <p className="font-body text-[11px] text-[#777F9F] tracking-widest uppercase">
          RA {memory.x.toFixed(1)}° · DEC {memory.y.toFixed(1)}° · MAG {memory.brightness}
        </p>
      </div>
    </div>
  );
}

function MemoryImage({ memory }: { memory: Memory }) {
  const [imgError, setImgError] = useState(false);

  const hasRealImage =
    !imgError &&
    memory.image &&
    !memory.image.includes('[') &&
    memory.image.length > 0;

  if (!hasRealImage) {
    return <StarChartFallback title={memory.title} memory={memory} />;
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 260 }}>
      <Image
        src={memory.image}
        alt={memory.title}
        fill
        loading="lazy"
        className="object-cover"
        onError={() => setImgError(true)}
        sizes="(max-width: 768px) 100vw, 512px"
      />
      {/* Bottom vignette gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 50%, rgba(14, 19, 42, 0.95) 100%)',
        }}
      />
    </div>
  );
}

function PanelContent({
  memory,
  onClose,
}: {
  memory: Memory;
  onClose: () => void;
}) {
  return (
    <div className="relative flex flex-col">
      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label="Close memory details"
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center text-[#A9AEC5] hover:text-white transition-colors cursor-pointer"
        style={{
          background: 'rgba(14, 19, 42, 0.75)',
          border: '1px solid rgba(248, 247, 255, 0.15)',
        }}
      >
        <X size={16} />
      </button>

      {/* Memory Image or Star Chart Fallback */}
      <MemoryImage memory={memory} />

      {/* Memory Content Text */}
      <div className="p-6 sm:p-8 space-y-4">
        {/* Title and Date Badge */}
        <div>
          {memory.date && (
            <span className="inline-block text-[11px] font-body uppercase tracking-widest text-[#F1D5A5] mb-1">
              ✦ {memory.date}
            </span>
          )}
          <h3 className="font-heading text-2xl sm:text-3xl text-white tracking-wide font-light">
            {memory.title}
          </h3>
        </div>

        {/* Message / Caption */}
        <p className="font-body text-sm sm:text-base leading-relaxed text-[#C4D4FF] font-light italic">
          &ldquo;{memory.message}&rdquo;
        </p>

        {/* Delicate Stardust Accents on Footer */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-[#777F9F] tracking-widest font-body uppercase">
          <span>Star {memory.id.replace('memory-', '')}</span>
          <span className="text-[#F1D5A5]">Discovered ✦</span>
        </div>
      </div>
    </div>
  );
}

export default function MemoryPanel({ memory, onClose, isOpen }: MemoryPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { y: number } }) => {
      if (info.offset.y > 100) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && memory && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{
              background: 'rgba(5, 7, 19, 0.75)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Unified Responsive Centered/Bottom Sheet Modal */}
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none p-0 md:p-6">
            <motion.div
              key="panel-card"
              ref={panelRef}
              className="glass-cinematic rounded-t-3xl md:rounded-2xl overflow-hidden pointer-events-auto w-full md:max-w-lg shadow-2xl relative max-h-[85vh] md:max-h-none"
              style={{
                borderColor: 'rgba(100, 139, 255, 0.35)',
                boxShadow:
                  '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(118, 86, 201, 0.25)',
              }}
              initial={{ opacity: 0, y: 50, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={handleDragEnd}
            >
              {/* Mobile Drag Indicator Bar */}
              <div className="flex justify-center pt-3 pb-1 md:hidden">
                <div
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    background: 'rgba(248, 247, 255, 0.3)',
                  }}
                />
              </div>

              {/* Corner Gold Accents (Desktop) */}
              <div className="hidden md:block absolute top-2 left-2 text-[#F1D5A5]/60 text-xs pointer-events-none">⌜</div>
              <div className="hidden md:block absolute top-2 right-2 text-[#F1D5A5]/60 text-xs pointer-events-none">⌝</div>
              <div className="hidden md:block absolute bottom-2 left-2 text-[#F1D5A5]/60 text-xs pointer-events-none">⌞</div>
              <div className="hidden md:block absolute bottom-2 right-2 text-[#F1D5A5]/60 text-xs pointer-events-none">⌟</div>

              <PanelContent memory={memory} onClose={onClose} />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
