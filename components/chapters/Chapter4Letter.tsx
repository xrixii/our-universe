'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarfieldCanvas from '@/components/starfield/StarfieldCanvas';
import letter from '@/data/letter';
import config from '@/data/config';
import Button from '@/components/ui/Button';

export default function Chapter4Letter() {
  const [isOpen, setIsOpen] = useState(false);
  const [showFullLetter, setShowFullLetter] = useState(false);
  const [isOpeningFlap, setIsOpeningFlap] = useState(false);

  // Split letter body into paragraphs
  const paragraphs = letter.body.split('\n\n').filter((p) => p.trim().length > 0);
  const sender = config.senderName || letter.sender || 'Forever yours';
  const greeting = letter.greeting.replace('[Her Name]', config.herName || 'My Love');

  const handleOpen = () => {
    if (isOpeningFlap || isOpen) return;
    setIsOpeningFlap(true);

    // Flap opens, then letter unfolds
    setTimeout(() => {
      setIsOpen(true);
      setIsOpeningFlap(false);
    }, 700);
  };

  return (
    <div className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden bg-[#050713] flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 select-none">
      {/* Background Starfield */}
      <div className="fixed inset-0 pointer-events-none">
        <StarfieldCanvas starCount={220} showNebula={true} showShootingStars={true} />
      </div>

      {/* Volumetric Warm Golden Spotlight behind envelope */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(241, 213, 165, 0.08) 0%, rgba(118, 86, 201, 0.06) 40%, #050713 85%)',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl my-auto py-12 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* ── ENVELOPE PHASE ── */
            <motion.div
              key="envelope-phase"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center perspective-1000"
            >
              {/* Header Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-8"
              >
                <span className="text-xs uppercase font-body tracking-[0.25em] text-[#F1D5A5] block mb-2">
                  ✦ A Handwritten Memory ✦
                </span>
                <p className="font-heading italic text-2xl sm:text-3xl text-[#F8F7FF] tracking-wide font-light">
                  A little something from me to you.
                </p>
              </motion.div>

              {/* 3D Floating Ivory Envelope with Golden Wax Seal */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotateZ: [0, 0.5, -0.5, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-80 sm:w-96 h-56 sm:h-64 cursor-pointer group mb-10 preserve-3d"
                onClick={handleOpen}
                role="button"
                tabIndex={0}
                aria-label="Open letter envelope"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleOpen();
                }}
              >
                {/* Golden Stardust Orbit around Envelope */}
                <div
                  className="absolute -inset-4 rounded-3xl pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-500"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(241, 213, 165, 0.35) 0%, rgba(118, 86, 201, 0.15) 50%, transparent 80%)',
                    filter: 'blur(16px)',
                  }}
                />

                {/* Envelope Body */}
                <div
                  className="w-full h-full rounded-2xl overflow-hidden relative shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{
                    background:
                      'linear-gradient(150deg, #FBF8F2 0%, #F4ECE0 60%, #EAE0D0 100%)',
                    boxShadow:
                      '0 30px 60px -15px rgba(0,0,0,0.8), 0 0 35px rgba(241, 213, 165, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {/* Subtle Paper Texture Lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 384 256" preserveAspectRatio="none">
                    {/* Bottom folds */}
                    <polygon points="0,256 192,130 384,256" fill="#E8DEC9" opacity="0.65" />
                    <polygon points="0,0 192,130 0,256" fill="#F0E6D5" opacity="0.5" />
                    <polygon points="384,0 192,130 384,256" fill="#ECE0CE" opacity="0.5" />

                    {/* Flap with 3D Opening Animation */}
                    <polygon
                      points="0,0 192,138 384,0"
                      fill={isOpeningFlap ? '#E2D5BE' : '#FAF4EA'}
                      stroke="#DECDB5"
                      strokeWidth="1"
                      className="transition-all duration-700"
                      style={{
                        transformOrigin: 'top center',
                        transform: isOpeningFlap ? 'scaleY(-0.8)' : 'none',
                      }}
                    />
                  </svg>

                  {/* Golden Wax Seal with Radiant Crest */}
                  <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <motion.div
                      animate={isOpeningFlap ? { scale: [1, 1.4, 0], opacity: [1, 1, 0] } : { scale: 1 }}
                      transition={{ duration: 0.6 }}
                      className="w-14 h-14 rounded-full flex items-center justify-center relative shadow-xl transform group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background:
                          'radial-gradient(circle at 35% 35%, #FBE5B7 0%, #D4A359 50%, #8A5B1D 100%)',
                        boxShadow:
                          '0 6px 20px rgba(138, 91, 29, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.7)',
                        border: '2px solid rgba(251, 229, 183, 0.6)',
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <polygon
                          points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"
                          fill="#FFFFFF"
                          filter="drop-shadow(0 1px 2px rgba(0,0,0,0.4))"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Action Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleOpen}
                disabled={isOpeningFlap}
                className="shadow-2xl tracking-[0.25em] text-xs uppercase cursor-pointer"
              >
                OPEN YOUR LETTER ✦
              </Button>
            </motion.div>
          ) : (
            /* ── LETTER REVEAL PHASE ── */
            <motion.div
              key="letter-revealed"
              initial={{ opacity: 0, y: 50, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {/* Parchment Paper Card */}
              <div
                className="relative rounded-2xl p-6 sm:p-10 md:p-14 text-left shadow-2xl overflow-hidden"
                style={{
                  background:
                    'linear-gradient(175deg, #FCF9F2 0%, #F7F0E4 50%, #EFE5D4 100%)',
                  boxShadow:
                    '0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 45px rgba(241, 213, 165, 0.25)',
                  border: '1px solid rgba(220, 205, 180, 0.9)',
                  color: '#242733',
                }}
              >
                {/* Elegant Gold Foil Inner Border */}
                <div
                  className="absolute inset-3 sm:inset-4 rounded-xl pointer-events-none"
                  style={{
                    border: '1px dashed rgba(184, 150, 98, 0.45)',
                  }}
                />

                {/* Read All at Once Shortcut */}
                {!showFullLetter && paragraphs.length > 2 && (
                  <div className="flex justify-end mb-4 relative z-10">
                    <button
                      onClick={() => setShowFullLetter(true)}
                      className="text-xs font-body text-[#8C7A65] hover:text-[#242733] transition-colors underline underline-offset-4 cursor-pointer"
                    >
                      Read entire letter at once ✦
                    </button>
                  </div>
                )}

                {/* Greeting */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="font-heading italic text-2xl sm:text-3xl md:text-4xl text-[#1A1E33] mb-6 sm:mb-8 font-semibold tracking-wide"
                >
                  {greeting}
                </motion.h2>

                {/* Letter Body Paragraphs */}
                <div className="space-y-4 sm:space-y-6 text-sm sm:text-base md:text-lg leading-relaxed font-body text-[#31364A] font-light">
                  {paragraphs.map((p, idx) => (
                    <motion.p
                      key={idx}
                      initial={showFullLetter ? { opacity: 1 } : { opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: showFullLetter ? 0 : 0.3 + idx * 0.45,
                        duration: 0.8,
                        ease: 'easeOut',
                      }}
                      className="whitespace-pre-line"
                    >
                      {p}
                    </motion.p>
                  ))}
                </div>

                {/* Sign-off */}
                <motion.div
                  initial={showFullLetter ? { opacity: 1 } : { opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: showFullLetter ? 0.1 : 0.3 + paragraphs.length * 0.45 + 0.3,
                    duration: 0.8,
                  }}
                  className="mt-10 sm:mt-12 text-right"
                >
                  <p className="font-heading italic text-lg sm:text-xl text-[#648BFF] font-medium">
                    {letter.signoff}
                  </p>
                  <p className="font-heading text-xl sm:text-2xl text-[#1A1E33] font-semibold mt-1">
                    {sender}
                  </p>
                </motion.div>
              </div>

              {/* Close/Refold Button */}
              <div className="flex justify-center mt-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    setShowFullLetter(false);
                  }}
                  className="text-xs uppercase tracking-widest text-[#A9AEC5] hover:text-white cursor-pointer"
                >
                  Close Letter
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
