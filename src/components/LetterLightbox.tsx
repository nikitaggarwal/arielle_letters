"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Letter } from "@/lib/letters";

interface LetterLightboxProps {
  letters: Letter[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const SWIPE_THRESHOLD = 50;

export default function LetterLightbox({
  letters,
  activeIndex,
  onClose,
  onNavigate,
}: LetterLightboxProps) {
  const isOpen = activeIndex !== null;
  const letter = activeIndex !== null ? letters[activeIndex] : null;

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchDelta = useRef({ x: 0, y: 0 });

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate((activeIndex + 1) % letters.length);
  }, [activeIndex, letters.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate((activeIndex - 1 + letters.length) % letters.length);
  }, [activeIndex, letters.length, onNavigate]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    touchDelta.current = { x: 0, y: 0 };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = e.touches[0];
    touchDelta.current = {
      x: touch.clientX - touchStart.current.x,
      y: touch.clientY - touchStart.current.y,
    };
  }, []);

  const handleTouchEnd = useCallback(() => {
    const { x, y } = touchDelta.current;
    const isHorizontalSwipe = Math.abs(x) > Math.abs(y);
    if (isHorizontalSwipe && Math.abs(x) > SWIPE_THRESHOLD) {
      if (x < 0) goNext();
      else goPrev();
    }
    touchStart.current = null;
    touchDelta.current = { x: 0, y: 0 };
  }, [goNext, goPrev]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose, goNext, goPrev]);

  return (
    <AnimatePresence>
      {isOpen && letter && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/95 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <div
            className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 py-16 md:py-8"
            onClick={onClose}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <motion.div
              className="absolute top-4 right-4 left-4 flex items-center justify-between md:top-10 md:right-12 md:left-12"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.15 }}
            >
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted md:text-xs">
                  Letter {letter.id} of {letters.length}
                </p>
                <p className="mt-0.5 text-base font-light md:mt-1 md:text-lg">
                  From {letter.from}
                </p>
              </div>
              <button
                onClick={onClose}
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground/20 hover:bg-foreground/5 md:h-10 md:w-10"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  className="text-muted transition-colors group-hover:text-foreground"
                >
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </motion.div>

            {/* Image */}
            <motion.div
              className="relative max-h-[60vh] max-w-[92vw] overflow-hidden rounded-sm shadow-xl md:max-h-[75vh] md:max-w-[70vw]"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                delay: 0.05,
              }}
              key={letter.id}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={letter.image}
                alt={`Letter from ${letter.from}`}
                className="h-full max-h-[60vh] w-auto object-contain md:max-h-[75vh]"
              />
            </motion.div>

            {/* Preview */}
            <motion.p
              className="mt-4 max-w-xs px-4 text-center text-xs font-light text-muted italic md:mt-6 md:max-w-md md:text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              key={`preview-${letter.id}`}
            >
              &ldquo;{letter.preview}&rdquo;
            </motion.p>

            {/* Navigation */}
            <motion.div
              className="absolute bottom-4 right-4 left-4 flex items-center justify-between md:bottom-10 md:right-12 md:left-12"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={goPrev}
                className="group flex min-h-[44px] items-center gap-2 px-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="transition-transform group-hover:-translate-x-1"
                >
                  <path
                    d="M10 3L5 8l5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <span className="hidden md:inline">Previous</span>
              </button>
              {/* Swipe hint — mobile only */}
              <p className="text-[10px] text-muted/50 md:hidden">
                swipe to navigate
              </p>
              <button
                onClick={goNext}
                className="group flex min-h-[44px] items-center gap-2 px-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                <span className="hidden md:inline">Next</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path
                    d="M6 3l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
