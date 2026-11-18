'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useChapter } from '@/context/ChapterContext';
import Chapter1Intro from '@/components/chapters/Chapter1Intro';
import Chapter2Constellation from '@/components/chapters/Chapter2Constellation';
import Chapter3Gallery from '@/components/chapters/Chapter3Gallery';
import Chapter4Letter from '@/components/chapters/Chapter4Letter';
import Chapter5Secret from '@/components/chapters/Chapter5Secret';
import Chapter6Final from '@/components/chapters/Chapter6Final';
import Navigation from '@/components/Navigation';
import MusicPlayer from '@/components/MusicPlayer';

export default function Home() {
  const { currentChapter, goToChapter } = useChapter();

  const renderChapter = () => {
    switch (currentChapter) {
      case 0:
        return <Chapter1Intro onEnter={() => goToChapter(1)} />;
      case 1:
        return <Chapter2Constellation />;
      case 2:
        return <Chapter3Gallery />;
      case 3:
        return <Chapter4Letter />;
      case 4:
        return <Chapter5Secret />;
      case 5:
        return <Chapter6Final />;
      default:
        return <Chapter1Intro onEnter={() => goToChapter(1)} />;
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-[#050713] text-[#F8F7FF] overflow-x-hidden selection:bg-[#7656C9]/40">
      {/* Persistent floating music player */}
      <MusicPlayer />

      {/* Cinematic Chapter View Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentChapter}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0] } }}
          className="w-full min-h-screen"
        >
          {renderChapter()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom chapter navigation (visible after intro) */}
      <Navigation visible={currentChapter > 0} currentChapter={currentChapter} />
    </main>
  );
}
