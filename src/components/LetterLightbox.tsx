"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Letter } from "@/lib/letters";

interface LetterLightboxProps {
  letters: Letter[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function LetterLightbox({
  letters,
  activeIndex,
  onClose,
  onNavigate,
}: LetterLightboxProps) {
  const isOpen = activeIndex !== null;
  const letter = activeIndex !== null ? letters[activeIndex] : null;

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate((activeIndex + 1) % letters.length);
  }, [activeIndex, letters.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate((activeIndex - 1 + letters.length) % letters.length);
  }, [activeIndex, letters.length, onNavigate]);

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
          className="fixed inset-0 z-50 flex cursor-none items-center justify-center"
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
            className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 py-8"
            onClick={onClose}
          >
            {/* Header */}
            <motion.div
              className="absolute top-6 right-6 left-6 flex items-center justify-between md:top-10 md:right-12 md:left-12"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.15 }}
            >
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-muted">
                  Letter {letter.id} of {letters.length}
                </p>
                <p className="mt-1 text-lg font-light">From {letter.from}</p>
              </div>
              <button
                onClick={onClose}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground/20 hover:bg-foreground/5"
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
              className="relative max-h-[70vh] max-w-[90vw] overflow-hidden rounded-sm shadow-xl md:max-h-[75vh] md:max-w-[70vw]"
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
                className="h-full max-h-[70vh] w-auto object-contain md:max-h-[75vh]"
              />
            </motion.div>

            {/* Preview */}
            <motion.p
              className="mt-6 max-w-md text-center text-sm font-light text-muted italic"
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
              className="absolute bottom-6 right-6 left-6 flex items-center justify-between md:bottom-10 md:right-12 md:left-12"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={goPrev}
                className="group flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
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
                Previous
              </button>
              <button
                onClick={goNext}
                className="group flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
              >
                Next
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
