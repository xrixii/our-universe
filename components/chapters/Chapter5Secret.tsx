'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Moon } from 'lucide-react';
import StarfieldCanvas from '@/components/starfield/StarfieldCanvas';
import config from '@/data/config';
import Button from '@/components/ui/Button';

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function Chapter5Secret() {
  const [tapCount, setTapCount] = useState(0);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
  const [pulse, setPulse] = useState(false);

  const REQUIRED_TAPS = 5;

  const handleMoonTap = useCallback(() => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    setPulse(true);
    setTimeout(() => setPulse(false), 350);

    if (nextCount === REQUIRED_TAPS) {
      // 5th tap: Grand Starburst explosion
      const colors = ['#F8F7FF', '#F1D5A5', '#648BFF', '#D58ACF', '#7656C9'];
      const particles: BurstParticle[] = Array.from({ length: 28 }).map((_, i) => {
        const angle = (i / 28) * 2 * Math.PI;
        const dist = 90 + Math.random() * 80;
        return {
          id: i,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          size: 3 + Math.random() * 5,
          color: colors[i % colors.length],
        };
      });

      setBurstParticles(particles);
      setSecretUnlocked(true);
      setTimeout(() => {
        setShowSecretModal(true);
      }, 500);
    }
  }, [tapCount]);

  const paragraphs = config.secretMessage.split('\n\n').filter((p) => p.trim().length > 0);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050713] flex flex-col items-center justify-center p-4 select-none">
      {/* Background Starfield with Volumetric Purple Nebula */}
      <div className="absolute inset-0 pointer-events-none">
        <StarfieldCanvas starCount={260} showNebula={true} showShootingStars={true} />
      </div>

      {/* Atmospheric Moon Aura */}
      <div
        className="absolute w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(118, 86, 201, 0.25) 0%, rgba(100, 139, 255, 0.12) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Poetic Stage Hint */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <span className="text-xs uppercase font-body tracking-[0.25em] text-[#F1D5A5] block mb-2">
            ✦ Chapter Five · Celestial Secret ✦
          </span>
          <p className="font-heading italic text-xl sm:text-2xl text-[#C4D4FF] tracking-wide font-light">
            {tapCount === 0
              ? 'There is a quiet secret in this night sky…'
              : tapCount < REQUIRED_TAPS
              ? `The moon responds to your touch (${tapCount} of ${REQUIRED_TAPS})…`
              : 'You have awakened our secret.'}
          </p>
        </motion.div>

        {/* Enormous 3D-Shaded Celestial Crescent Moon */}
        <div className="relative flex items-center justify-center">
          {/* Burst Particles on 5th tap */}
          {burstParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: 2 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.color,
                boxShadow: `0 0 15px ${p.color}, 0 0 25px #648BFF`,
              }}
            />
          ))}

          {/* Interactive Moon Button with 3D Shading */}
          <motion.button
            onClick={handleMoonTap}
            animate={{
              scale: pulse ? 1.12 : [1, 1.03, 1],
              rotate: [0, 1.5, -1.5, 0],
            }}
            transition={{
              scale: pulse ? { duration: 0.3 } : { duration: 7, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer focus:outline-none p-6 rounded-full group"
            aria-label="Tap the crescent moon"
          >
            {/* Ambient Radial Moon Bloom */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
                pulse || tapCount >= REQUIRED_TAPS
                  ? 'opacity-100 shadow-[0_0_80px_rgba(241,213,165,0.7)]'
                  : 'opacity-50 group-hover:opacity-85 shadow-[0_0_50px_rgba(118,86,201,0.5)]'
              }`}
            />

            {/* High-Fidelity Celestial Moon SVG */}
            <svg
              width="190"
              height="190"
              viewBox="0 0 100 100"
              className="filter drop-shadow-[0_0_30px_rgba(241,213,165,0.5)]"
            >
              <defs>
                {/* Luminous Moon Gradient */}
                <radialGradient id="moonSurface" cx="35%" cy="35%" r="70%">
                  <stop offset="0%" stopColor="#FFFDF7" />
                  <stop offset="35%" stopColor="#F5E8C9" />
                  <stop offset="70%" stopColor="#D4A7E0" />
                  <stop offset="100%" stopColor="#58439B" />
                </radialGradient>

                {/* Moon Mask */}
                <mask id="crescentMask">
                  <rect width="100" height="100" fill="white" />
                  <circle cx="64" cy="40" r="39" fill="black" />
                </mask>
              </defs>

              {/* Atmospheric Halo Ring */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke={tapCount >= REQUIRED_TAPS ? '#F1D5A5' : 'rgba(100, 139, 255, 0.4)'}
                strokeWidth={pulse ? '3' : '1'}
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />

              {/* Main Shaded Crescent Moon */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="url(#moonSurface)"
                mask="url(#crescentMask)"
              />

              {/* Crater Details on Crescent Limb */}
              <g mask="url(#crescentMask)" opacity="0.45">
                <circle cx="32" cy="40" r="4.5" fill="#C49AD4" opacity="0.6" />
                <circle cx="26" cy="55" r="3" fill="#A87DBA" opacity="0.5" />
                <circle cx="38" cy="62" r="5" fill="#B386C7" opacity="0.6" />
                <circle cx="28" cy="28" r="2.5" fill="#E8D1B5" opacity="0.8" />
              </g>

              {/* Sparkling Stardust on the Moon Tip */}
              <circle cx="28" cy="18" r="1.5" fill="#FFFFFF" className="animate-pulse" />
              <circle cx="48" cy="85" r="1.2" fill="#F1D5A5" className="animate-pulse" />
            </svg>
          </motion.button>

          {/* Orbiting Stardust Rings */}
          <div
            className="absolute w-64 h-64 rounded-full pointer-events-none"
            style={{
              border: '1px dashed rgba(241, 213, 165, 0.25)',
              animation: 'portal-spin 30s linear infinite',
            }}
          />
        </div>

        {/* Read Button if already unlocked */}
        {secretUnlocked && !showSecretModal && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSecretModal(true)}
              className="flex items-center gap-2 text-xs uppercase tracking-widest cursor-pointer shadow-xl"
            >
              <Sparkles size={14} className="text-[#F1D5A5]" />
              Read Our Secret Message ✦
            </Button>
          </motion.div>
        )}
      </div>

      {/* Secret Message Modal in Cinematic Glass */}
      <AnimatePresence>
        {showSecretModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050713]/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 25 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg rounded-2xl p-6 sm:p-10 text-left glass-cinematic shadow-2xl"
              style={{
                borderColor: 'rgba(241, 213, 165, 0.4)',
                boxShadow:
                  '0 30px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(118, 86, 201, 0.3)',
              }}
            >
              {/* Corner Gold Frame Accents */}
              <div className="absolute top-2 left-2 text-[#F1D5A5]/60 text-xs pointer-events-none">⌜</div>
              <div className="absolute top-2 right-2 text-[#F1D5A5]/60 text-xs pointer-events-none">⌝</div>
              <div className="absolute bottom-2 left-2 text-[#F1D5A5]/60 text-xs pointer-events-none">⌞</div>
              <div className="absolute bottom-2 right-2 text-[#F1D5A5]/60 text-xs pointer-events-none">⌟</div>

              {/* Close Button */}
              <button
                onClick={() => setShowSecretModal(false)}
                aria-label="Close secret message"
                className="absolute top-4 right-4 p-2 text-[#A9AEC5] hover:text-white rounded-full glass-cinematic transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Title with Moon Icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F1D5A5]/15 border border-[#F1D5A5]/40 text-[#F1D5A5]">
                  <Moon size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-body tracking-[0.25em] text-[#F1D5A5] block">
                    Private Message
                  </span>
                  <h3 className="font-heading italic text-2xl sm:text-3xl text-white font-light text-glow-gold">
                    Our Little Secret
                  </h3>
                </div>
              </div>

              {/* Secret Message Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base leading-relaxed font-body text-[#C4D4FF] font-light">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className="whitespace-pre-line">
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSecretModal(false)}
                  className="text-xs uppercase tracking-widest text-[#A9AEC5] hover:text-white cursor-pointer"
                >
                  Close Secret ✦
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
