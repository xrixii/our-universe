'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2, Sparkles } from 'lucide-react';
import StarfieldCanvas from '@/components/starfield/StarfieldCanvas';
import gallery from '@/data/gallery';
import type { GalleryPhoto } from '@/types';

export default function Chapter3Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [erroredSrcs, setErroredSrcs] = useState<Set<string>>(new Set());
  const touchStartX = useRef<number | null>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const total = gallery.length;

  const navigate = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setCurrentIndex((prev) => (prev + dir + total) % total);
    },
    [total]
  );

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailRef.current) {
      const active = thumbnailRef.current.querySelector('[data-active="true"]');
      active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 50) navigate(delta < 0 ? 1 : -1);
  };

  const handleImageError = (src: string) => {
    setErroredSrcs((prev) => new Set([...prev, src]));
  };

  const photo: GalleryPhoto = gallery[currentIndex];

  // Fallback Placeholder when image is not yet uploaded
  function PhotoOrPlaceholder({
    p,
    className = '',
    priority = false,
  }: {
    p: GalleryPhoto;
    className?: string;
    priority?: boolean;
  }) {
    const errored = erroredSrcs.has(p.src) || !p.src || p.src.includes('[');

    if (errored) {
      return (
        <div
          className={`flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
          style={{
            background:
              'radial-gradient(circle at 50% 40%, rgba(100, 139, 255, 0.15) 0%, rgba(14, 19, 42, 0.9) 80%)',
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
            style={{
              background: 'radial-gradient(circle, rgba(118, 86, 201, 0.4) 0%, rgba(14, 19, 42, 0.8) 70%)',
              border: '1px solid rgba(241, 213, 165, 0.4)',
              boxShadow: '0 0 20px rgba(118, 86, 201, 0.4)',
            }}
          >
            <Sparkles size={22} className="text-[#F1D5A5]" />
          </div>
          <p className="font-heading italic text-lg sm:text-xl text-[#F8F7FF] tracking-wide mb-1 text-glow-gold">
            {p.caption || 'A Beautiful Memory'}
          </p>
          <span className="text-[10px] text-[#777F9F] tracking-widest uppercase font-body">
            Photograph slot {p.id.replace('gallery-', '')}
          </span>
        </div>
      );
    }

    return (
      <div className={`relative w-full h-full ${className}`}>
        <Image
          src={p.src}
          alt={p.caption || 'Memory photograph'}
          fill
          priority={priority}
          sizes="(max-width: 768px) 95vw, 680px"
          className="object-contain"
          onError={() => handleImageError(p.src)}
        />
      </div>
    );
  }

  // 3D slide transition variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      scale: 0.92,
      opacity: 0,
      rotateY: dir > 0 ? 12 : -12,
    }),
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      scale: 0.92,
      opacity: 0,
      rotateY: dir > 0 ? -12 : 12,
      transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] as const },
    }),
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050713] flex flex-col justify-between select-none">
      {/* Background Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        <StarfieldCanvas starCount={240} showNebula={true} showShootingStars={true} />
      </div>

      {/* Atmospheric Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(118, 86, 201, 0.08) 0%, rgba(5, 7, 19, 0.6) 70%, #050713 100%)',
        }}
      />

      {/* Top Header */}
      <header className="relative z-20 pt-4 sm:pt-6 px-6 sm:px-10 flex items-center justify-between pointer-events-none">
        <div>
          <h2 className="font-heading italic text-xl sm:text-2xl text-[#F8F7FF] tracking-wide flex items-center gap-2">
            <span className="text-[#F1D5A5]">✦</span> Our Memories
          </h2>
          <p className="font-body text-[10px] sm:text-xs text-[#777F9F] tracking-widest uppercase">
            Photographs suspended in time
          </p>
        </div>

        {/* Counter Badge */}
        <div className="glass-cinematic px-3.5 py-1.5 rounded-full text-xs font-body tracking-wider text-[#F8F7FF]">
          {currentIndex + 1} / {total}
        </div>
      </header>

      {/* Center 3D Suspended Photo Arena */}
      <main
        className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-12 perspective-1000 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Left Arrow */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Previous photograph"
          className="hidden sm:flex absolute left-4 md:left-8 z-30 w-11 h-11 rounded-full items-center justify-center text-[#F8F7FF] hover:text-[#F1D5A5] transition-all duration-300 glass-cinematic cursor-pointer hover:scale-105"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Central Active Photograph Frame with 3D Parallax */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={photo.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="relative w-full max-w-2xl flex flex-col items-center"
          >
            {/* Ambient Cosmic Halo behind the frame */}
            <div
              className="absolute -inset-4 rounded-3xl pointer-events-none opacity-40"
              style={{
                background:
                  'radial-gradient(circle, rgba(100, 139, 255, 0.3) 0%, rgba(118, 86, 201, 0.2) 50%, transparent 80%)',
                filter: 'blur(20px)',
              }}
            />

            {/* Photo Glass Container */}
            <div
              onClick={() => setIsFullscreen(true)}
              role="button"
              tabIndex={0}
              aria-label="View photograph in fullscreen"
              className="relative w-full rounded-2xl overflow-hidden glass-cinematic cursor-pointer group shadow-2xl"
              style={{
                height: 'min(50vh, 400px)',
                borderColor: 'rgba(100, 139, 255, 0.35)',
                boxShadow:
                  '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(118, 86, 201, 0.2)',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsFullscreen(true);
              }}
            >
              {/* Corner Gold Frame Accents */}
              <div className="absolute top-2 left-2 text-[#F1D5A5]/60 text-xs pointer-events-none z-20">⌜</div>
              <div className="absolute top-2 right-2 text-[#F1D5A5]/60 text-xs pointer-events-none z-20">⌝</div>
              <div className="absolute bottom-2 left-2 text-[#F1D5A5]/60 text-xs pointer-events-none z-20">⌞</div>
              <div className="absolute bottom-2 right-2 text-[#F1D5A5]/60 text-xs pointer-events-none z-20">⌟</div>

              {/* Fullscreen icon indicator on hover */}
              <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8 rounded-full glass-cinematic flex items-center justify-center text-white">
                <Maximize2 size={14} />
              </div>

              <PhotoOrPlaceholder p={photo} className="w-full h-full" priority />
            </div>

            {/* Caption & Date under the frame */}
            <div className="mt-4 sm:mt-5 text-center px-4 max-w-lg">
              {photo.date && (
                <span className="block text-[11px] font-body uppercase tracking-widest text-[#F1D5A5] mb-1">
                  ✦ {photo.date}
                </span>
              )}
              <p className="font-heading italic text-lg sm:text-xl md:text-2xl text-[#F8F7FF] tracking-wide font-light">
                {photo.caption || 'A moment frozen in starlight.'}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Right Arrow */}
        <button
          onClick={() => navigate(1)}
          aria-label="Next photograph"
          className="hidden sm:flex absolute right-4 md:right-8 z-30 w-11 h-11 rounded-full items-center justify-center text-[#F8F7FF] hover:text-[#F1D5A5] transition-all duration-300 glass-cinematic cursor-pointer hover:scale-105"
        >
          <ChevronRight size={22} />
        </button>
      </main>

      {/* Bottom Thumbnail Strip */}
      <footer className="relative z-20 pb-16 sm:pb-20 pt-2 flex flex-col items-center">
        <div
          ref={thumbnailRef}
          className="flex items-center gap-2 sm:gap-3 px-4 max-w-full overflow-x-auto no-scrollbar py-2"
        >
          {gallery.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id}
                data-active={isActive ? 'true' : undefined}
                onClick={() => goTo(idx)}
                aria-label={`Go to photo ${idx + 1}`}
                className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-[#F1D5A5] scale-105 shadow-[0_0_15px_rgba(241,213,165,0.4)]'
                    : 'w-10 h-10 sm:w-11 sm:h-11 opacity-45 hover:opacity-85'
                }`}
                style={{
                  background: 'rgba(14, 19, 42, 0.8)',
                  border: '1px solid rgba(100, 139, 255, 0.25)',
                }}
              >
                <PhotoOrPlaceholder p={item} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      </footer>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050713]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen"
              className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full glass-cinematic flex items-center justify-center text-white hover:text-[#F1D5A5] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Fullscreen Photo */}
            <div className="relative w-full max-w-4xl h-[75vh] flex items-center justify-center">
              <PhotoOrPlaceholder p={photo} className="w-full h-full" priority />
            </div>

            {/* Caption */}
            <p className="mt-4 font-heading italic text-xl text-[#F8F7FF] text-center max-w-xl">
              {photo.caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
