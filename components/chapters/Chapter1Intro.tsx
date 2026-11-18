'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarfieldCanvas from '@/components/starfield/StarfieldCanvas';
import { useMusicContext } from '@/context/MusicContext';
import config from '@/data/config';

interface Chapter1IntroProps {
  onEnter: () => void;
}

interface RomanticMote {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export default function Chapter1Intro({ onEnter }: Chapter1IntroProps) {
  const music = useMusicContext();
  const [exiting, setExiting] = useState(false);
  const [step, setStep] = useState(0);
  const [portalClicked, setPortalClicked] = useState(false);
  const [romanticMotes, setRomanticMotes] = useState<RomanticMote[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Generate romantic floating starlight motes
  useEffect(() => {
    const colors = ['#F1D5A5', '#F1A8D0', '#D58ACF', '#C4D4FF', '#FFFFFF'];
    const motes: RomanticMote[] = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3.5,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 4,
      color: colors[i % colors.length],
    }));
    setRomanticMotes(motes);
  }, []);

  // Progressive cinematic reveal sequence
  useEffect(() => {
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

      {/* Floating Romantic Starlight Motes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {romanticMotes.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: `${m.y}vh`, x: `${m.x}vw` }}
            animate={{
              opacity: [0, 0.7, 0],
              y: [`${m.y}vh`, `${(m.y - 30 + 100) % 100}vh`],
              x: [`${m.x}vw`, `${(m.x + (m.id % 2 === 0 ? 5 : -5) + 100) % 100}vw`],
            }}
            transition={{
              duration: m.duration,
              delay: m.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${m.size}px`,
              height: `${m.size}px`,
              backgroundColor: m.color,
              boxShadow: `0 0 10px ${m.color}`,
            }}
          />
        ))}
      </div>

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
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-romantic italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide mb-3 md:mb-5 font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#C4D4FF] via-[#F8F7FF] to-[#D58ACF]"
              style={{
                textShadow: '0 0 22px rgba(196, 212, 255, 0.35)',
              }}
            >
              Somewhere in this endless universe…
            </motion.p>
          )}
        </AnimatePresence>

        {/* Line 2 */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-romantic italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-wide mb-6 md:mb-9 font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#F1D5A5] via-[#FFFFFF] to-[#F1A8D0]"
              style={{
                textShadow: '0 0 30px rgba(241, 213, 165, 0.4), 0 0 50px rgba(241, 168, 208, 0.3)',
              }}
            >
              There is one universe I would choose every time.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Line 3: OURS */}
        <AnimatePresence>
          {step >= 3 && (
            <div className="relative my-2 sm:my-4">
              {/* Anamorphic Horizontal Glow Flare */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.75 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[2px] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(241,168,208,0.3) 20%, rgba(241,213,165,0.9) 50%, rgba(100,139,255,0.4) 80%, transparent)',
                  filter: 'blur(1px)',
                }}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center gap-3 sm:gap-6"
              >
                <span className="text-[#F1D5A5] text-base sm:text-2xl animate-pulse">✦</span>
                <h1
                  className="font-romantic text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-normal tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FFF5EA] to-[#F1A8D0] select-none"
                  style={{
                    textShadow:
                      '0 0 35px rgba(241, 168, 208, 0.8), 0 0 75px rgba(118, 86, 201, 0.6), 0 0 130px rgba(100, 139, 255, 0.4)',
                  }}
                >
                  OURS.
                </h1>
                <span className="text-[#F1D5A5] text-base sm:text-2xl animate-pulse">✦</span>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Line 4: Hey, birthday girl */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="font-romantic italic text-base sm:text-lg md:text-xl lg:text-2xl text-[#F1D5A5] tracking-[0.12em] mb-10 md:mb-12 font-light flex items-center justify-center gap-2"
              style={{
                textShadow: '0 0 15px rgba(241, 213, 165, 0.4)',
              }}
            >
              <span>✦</span>
              <span>Hey, my {config.herNickname || 'birthday girl'}… I built a universe for you.</span>
              <span>✦</span>
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
                  className="relative z-10 px-8 sm:px-12 py-3.5 sm:py-4 rounded-full font-romantic text-sm sm:text-base font-normal tracking-[0.25em] text-[#F8F7FF] uppercase transition-all duration-300 overflow-hidden cursor-pointer"
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

              {/* Music indicator */}
              <p className="text-xs font-romantic italic tracking-wider text-[#A9AEC5]">
                ♪ soundtrack ready
              </p>
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
              'radial-gradient(circle at 50% 50%, #F8F7FF 0%, rgba(241, 168, 208, 0.7) 40%, rgba(118, 86, 201, 0.3) 70%, transparent 100%)',
          }}
        />
      )}
    </div>
  );
}