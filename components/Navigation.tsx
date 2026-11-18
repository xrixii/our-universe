'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useChapter } from '@/context/ChapterContext';

interface NavigationProps {
  visible?: boolean;
  currentChapter?: number;
  totalChapters?: number;
}

const TOTAL_CHAPTERS = 6;

const CHAPTER_NAMES = [
  'The Beginning',
  'Our Universe',
  'Our Memories',
  'A Letter For You',
  'Our Little Secret',
  'To Infinity',
];

export default function Navigation({
  visible = true,
  currentChapter: currentChapterProp,
  totalChapters: totalChaptersProp,
}: NavigationProps) {
  const chapter = useChapter();

  const current = currentChapterProp ?? chapter.currentChapter;
  const total = totalChaptersProp ?? TOTAL_CHAPTERS;

  const handleDot = (index: number) => {
    chapter.goToChapter(index);
  };

  const handlePrev = () => {
    chapter.goPrev();
  };

  const handleNext = () => {
    chapter.goNext();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="navigation"
          aria-label="Chapter navigation"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.4 } }}
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center py-4 pointer-events-none"
          style={{
            paddingBottom: 'max(1.2rem, env(safe-area-inset-bottom))',
          }}
        >
          {/* Cosmic Navigation Pill */}
          <div className="glass-cinematic rounded-full px-4 py-2 flex items-center gap-3 sm:gap-4 pointer-events-auto shadow-2xl border border-[rgba(100,139,255,0.25)]">
            {/* Previous */}
            <button
              onClick={handlePrev}
              aria-label="Previous chapter"
              disabled={current <= 0}
              className="p-1.5 rounded-full transition-all duration-200 disabled:opacity-20 hover:text-[#F1D5A5] text-[#A9AEC5] cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Chapter dots */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {Array.from({ length: total }, (_, i) => {
                const isActive = i === current;
                return (
                  <button
                    key={i}
                    aria-label={`Go to Chapter ${i + 1}: ${CHAPTER_NAMES[i]}`}
                    title={CHAPTER_NAMES[i]}
                    onClick={() => handleDot(i)}
                    className="relative rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F1D5A5] cursor-pointer group"
                    style={{
                      width: isActive ? '12px' : '6px',
                      height: isActive ? '12px' : '6px',
                      backgroundColor: isActive ? '#F1D5A5' : '#777F9F',
                      opacity: isActive ? 1 : 0.45,
                      boxShadow: isActive
                        ? '0 0 10px rgba(241, 213, 165, 0.9), 0 0 20px rgba(118, 86, 201, 0.6)'
                        : 'none',
                    }}
                  />
                );
              })}
            </div>

            {/* Next */}
            <button
              onClick={handleNext}
              aria-label="Next chapter"
              disabled={current >= total - 1}
              className="p-1.5 rounded-full transition-all duration-200 disabled:opacity-20 hover:text-[#F1D5A5] text-[#A9AEC5] cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
