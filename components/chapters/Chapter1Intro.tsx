'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarfieldCanvas from '@/components/starfield/StarfieldCanvas';
import { useMusicContext } from '@/context/MusicContext';

interface Chapter1IntroProps {
  onEnter: () => void;
}

export default function Chapter1Intro({ onEnter }: Chapter1IntroProps) {
  const music = useMusicContext();
  const [exiting, setExiting] = useState(false);
  const [step, setStep] = useState(0);
  const [portalClicked, setPortalClicked] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Progressive cinematic reveal sequence
  useEffect(() => {
    // 0s: Darkness with faint stars
    // 0.8s: Line 1
    // 2.2s: Line 2
    // 3.8s: "OURS."
    // 5.2s: Subtitle
    // 6.5s: Luminous Cosmic Portal Button
    const schedule = [
      { step: 1, delay: 200 },
      { step: 2, delay: 1400 },
      { step: 3, delay: 2600 },
      { step: 4, delay: 3800 },
      { step: 5, delay: 4800 },
    ];

    schedule.forEach(({ step: s, delay }) => {
      const id = setTimeout(() => setStep((prev) => Math.max(prev, s)), delay);
      timersRef.current.push(id);
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleEnter = useCallback(() => {
    if (portalClicked || exiting) return;
    setPortalClicked(true);

    if (music) {
      music.setHasInteracted();
      music.play();
    }

    // Trigger light burst & camera zoom before unmounting
    setTimeout(() => {
      setExiting(true);
    }, 600);

    setTimeout(() => {
      onEnter();
    }, 1400);
  }, [portalClicked, exiting, music, onEnter]);

  return (
    <div
      onClick={() => {
        if (step < 5) setStep(5);
      }}
      onTouchStart={() => {
        if (step < 5) setStep(5);
      }}
      className="relative w-full h-screen overflow-hidden bg-[#050713] flex flex-col items-center justify-center select-none cursor-pointer"
    >
      {/* Background Starfield Canvas with Planet & Shooting Stars */}
      <motion.div
        className="absolute inset-0"
        animate={portalClicked ? { scale: 1.25, opacity: 0.4 } : { scale: [1, 1.04, 1] }}
        transition={
          portalClicked
            ? { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
            : { duration: 25, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <StarfieldCanvas
          starCount={300}
          showNebula={true}
          showPlanet={false}
          showMoon={true}
          showBear={true}
          showShootingStars={true}
        />
      </motion.div>

      {/* Volumetric Radial Vignette & Lens Bloom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(118, 86, 201, 0.12) 0%, rgba(5, 7, 19, 0.5) 60%, #050713 100%)',
        }}
      />

      {/* Cinematic Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl px-6 text-center">
        {/* Line 1 */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading italic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#A9AEC5] tracking-wide mb-3 md:mb-5 font-light"
            >
              Somewhere in this endless universe…
            </motion.p>
          )}
        </AnimatePresence>

        {/* Line 2 */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading italic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#C4D4FF] tracking-wide mb-6 md:mb-8 font-light"
            >
              There is one universe I would choose every time.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Line 3: OURS */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.h1
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-white tracking-[0.2em] mb-6 md:mb-8 uppercase select-none"
              style={{
                textShadow:
                  '0 0 25px rgba(118, 86, 201, 0.9), 0 0 60px rgba(100, 139, 255, 0.6), 0 0 100px rgba(213, 138, 207, 0.4)',
              }}
            >
              OURS.
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Line 4: Hey, birthday girl */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="font-body text-sm sm:text-base md:text-lg text-[#A9AEC5] font-light tracking-widest mb-10 md:mb-12 uppercase"
            >
              Hey, birthday girl. I made something for you.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Portal CTA Button */}
        <AnimatePresence>
          {step >= 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-5"
            >
              {/* Luminous Cosmic Portal Button */}
              <div className="relative group cursor-pointer">
                {/* Outer Rotating Stardust Rings */}
                <div
                  className="absolute -inset-3 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      'conic-gradient(from 0deg, rgba(118,86,201,0.6), rgba(100,139,255,0.7), rgba(213,138,207,0.5), rgba(241,213,165,0.6), rgba(118,86,201,0.6))',
                    filter: 'blur(10px)',
                    animation: 'portal-spin 12s linear infinite',
                  }}
                />

                <div
                  className="absolute -inset-1 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none"
                  style={{
                    border: '1px dashed rgba(241, 213, 165, 0.6)',
                    animation: 'portal-spin-reverse 20s linear infinite',
                  }}
                />

                <button
                  onClick={handleEnter}
                  disabled={portalClicked}
                  aria-label="Enter our universe"
                  className="relative z-10 px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-body text-xs sm:text-sm font-medium tracking-[0.25em] text-[#F8F7FF] uppercase transition-all duration-300 overflow-hidden cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(22, 29, 60, 0.9) 0%, rgba(14, 19, 42, 0.95) 100%)',
                    border: '1px solid rgba(100, 139, 255, 0.5)',
                    boxShadow:
                      '0 0 25px rgba(118, 86, 201, 0.4), inset 0 0 15px rgba(100, 139, 255, 0.2)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="text-[#F1D5A5]">✦</span>
                    ENTER OUR UNIVERSE
                    <span className="text-[#F1D5A5]">✦</span>
                  </span>

                  {/* Inner shine sweep on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                </button>
              </div>

              {/* Music mute toggle */}
              <button
                onClick={() => music?.toggleMute()}
                className="text-xs font-body font-light tracking-widest text-[#777F9F] hover:text-[#C4D4FF] transition-colors mt-2"
                aria-label={music?.isMuted ? 'Turn music on' : 'Turn music off'}
              >
                ♪ Music {music?.isMuted ? 'muted' : 'active on enter'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cinematic White Light Burst Flash on Portal Enter */}
      {portalClicked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.95, 0] }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, #F8F7FF 0%, rgba(100, 139, 255, 0.8) 40%, rgba(118, 86, 201, 0.4) 70%, transparent 100%)',
          }}
        />
      )}

      {/* Clean fade-out layer for chapter exit */}
      {exiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-40 bg-[#050713] pointer-events-none"
        />
      )}
    </div>
  );
}
