'use client';

import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import config from '@/data/config';

interface MusicContextValue {
  isPlaying: boolean;
  isMuted: boolean;
  hasInteracted: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  setHasInteracted: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusicContext(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusicContext must be used inside MusicProvider');
  return ctx;
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteractedState] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load audio only after the user has interacted
  useEffect(() => {
    if (!hasInteracted) return;

    const audio = new Audio(`/audio/${config.musicFilename}`);
    audio.loop = true;
    audio.muted = isMuted;
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    // Attempt to play immediately after the user has interacted
    // Attempt to play only if audio source is ready
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.warn('[MusicProvider] Could not auto-play audio:', err);
    }).catch(() => {
      // Audio file might not exist yet or autoplay blocked
      setIsPlaying(false);
    });

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInteracted]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn('[MusicProvider] play() failed:', err);
        setIsPlaying(false);
      });
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  const setHasInteracted = useCallback(() => {
    setHasInteractedState(true);
  }, []);

    return (
      <MusicContext.Provider
        value={{
          isPlaying,
          isMuted,
          hasInteracted,
          currentTime,
          duration,
          play,
          pause,
          togglePlay,
          toggleMute,
          setHasInteracted,
        }}
      >
        {children}
      </MusicContext.Provider>
    );
  }
