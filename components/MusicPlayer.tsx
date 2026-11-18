'use client'

import React, { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useMusicContext } from '@/context/MusicContext'
import config from '@/data/config'

export default function MusicPlayer() {
  const { isPlaying, isMuted, hasInteracted, currentTime, duration, togglePlay, toggleMute } =
    useMusicContext()

  // Hide player if no music file configured
  if (!config.musicFilename) return null

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Only trigger if no input/textarea is focused
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute()
      }
    },
    [togglePlay, toggleMute],
  )

  useEffect(() => {
    if (!hasInteracted) return
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasInteracted, handleKeyDown])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      key="music-player"
      className="fixed top-4 right-4 z-50"
      style={{ maxWidth: '130px' }}
      aria-label="Music player"
      role="region"
    >
          {/* Glass container */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: 'rgba(16, 21, 42, 0.65)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(248, 247, 255, 0.08)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            {/* Progress bar */}
            <div
              className="w-full relative"
              style={{ height: '3px', background: 'rgba(255,255,255,0.08)' }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #7656C9, #648BFF)',
                  transition: 'width 0.5s linear',
                }}
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between px-2 py-2 gap-1">
              {/* Music note with bounce animation */}
              <span
                aria-hidden="true"
                className="text-xs select-none flex-shrink-0"
                style={{
                  color: '#7656C9',
                  display: 'inline-block',
                  animation: isPlaying ? 'music-bounce 0.8s ease-in-out infinite alternate' : 'none',
                }}
              >
                ♪
              </span>

              {/* Waveform bars (only when playing) */}
              <div
                className="flex items-end gap-px flex-shrink-0"
                aria-hidden="true"
                style={{ height: '12px' }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '2px',
                      borderRadius: '1px',
                      background: '#648BFF',
                      opacity: isPlaying ? 0.8 : 0.3,
                      height: isPlaying ? undefined : '4px',
                      animation: isPlaying
                        ? `waveform-bar 0.6s ease-in-out ${i * 0.15}s infinite alternate`
                        : 'none',
                    }}
                  />
                ))}
              </div>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
                className="flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                style={{
                  width: '24px',
                  height: '24px',
                  background: 'rgba(118, 86, 201, 0.25)',
                  color: '#F8F7FF',
                }}
              >
                {isPlaying ? <Pause size={11} /> : <Play size={11} />}
              </button>

              {/* Mute/Unmute */}
              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute music' : 'Mute music'}
                className="flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                style={{
                  width: '24px',
                  height: '24px',
                  background: 'rgba(255,255,255,0.06)',
                  color: isMuted ? '#777F9F' : '#A9AEC5',
                }}
              >
                {isMuted ? <VolumeX size={11} /> : <Volume2 size={11} />}
              </button>
            </div>
          </div>

          {/* CSS keyframes injected inline */}
          <style>{`
            @keyframes music-bounce {
              from { transform: translateY(0px); }
              to   { transform: translateY(-3px); }
            }
            @keyframes waveform-bar {
              from { height: 3px; }
              to   { height: 12px; }
            }
          `}</style>
      </div>
  );
}
