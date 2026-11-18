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

  // Initialize and preload audio element on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio(`/audio/${config.musicFilename}`);
    audio.loop = true;
    audio.preload = 'auto';
    audio.muted = isMuted;
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = (e: Event) => {
      console.warn('[MusicProvider] Audio error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.pause();
    };
  }, []);

  const play = useCallback(() => {
    setHasInteractedState(true);
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(`/audio/${config.musicFilename}`);
      audio.loop = true;
      audio.preload = 'auto';
      audio.muted = isMuted;
      audioRef.current = audio;
    }
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn('[MusicProvider] play() failed or blocked by browser autoplay policy:', err);
        setIsPlaying(false);
      });
  }, [isMuted]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setHasInteractedState(true);
    if (!audioRef.current) {
      play();
      return;
    }
    if (audioRef.current.paused) {
      play();
    } else {
      pause();
    }
  }, [play, pause]);

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
