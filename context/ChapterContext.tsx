'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ChapterContextValue {
  currentChapter: number;
  goToChapter: (n: number) => void;
  goNext: () => void;
  goPrev: () => void;
}

const TOTAL_CHAPTERS = 6; // chapters 0–5

const ChapterContext = createContext<ChapterContextValue | null>(null);

export function useChapter(): ChapterContextValue {
  const ctx = useContext(ChapterContext);
  if (!ctx) throw new Error('useChapter must be used inside ChapterProvider');
  return ctx;
}

export function ChapterProvider({ children }: { children: React.ReactNode }) {
  const [currentChapter, setCurrentChapter] = useState(0);

  const goToChapter = useCallback((n: number) => {
    if (n >= 0 && n < TOTAL_CHAPTERS) {
      setCurrentChapter(n);
    }
  }, []);

  const goNext = useCallback(() => {
    setCurrentChapter((prev) => Math.min(prev + 1, TOTAL_CHAPTERS - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentChapter((prev) => Math.max(prev - 1, 0));
  }, []);

  return (
    <ChapterContext.Provider value={{ currentChapter, goToChapter, goNext, goPrev }}>
      {children}
    </ChapterContext.Provider>
  );
}
