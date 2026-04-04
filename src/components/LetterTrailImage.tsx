"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import { motion, useAnimation } from "framer-motion";

const imageCache = new Set<string>();

function preloadImage(src: string): Promise<void> {
  if (imageCache.has(src)) return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { imageCache.add(src); resolve(); };
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function preloadAllImages(srcs: string[]) {
  srcs.forEach((s) => preloadImage(s));
}

export interface LetterTrailImageRef {
  show: (params: {
    x: number;
    y: number;
    newX: number;
    newY: number;
    zIndex: number;
    letterIndex: number;
    imageSrc: string;
  }) => void;
  isActive: () => boolean;
}

interface LetterTrailImageProps {
  onClick?: (letterIndex: number) => void;
}

const LetterTrailImage = forwardRef<LetterTrailImageRef, LetterTrailImageProps>(
  ({ onClick }, ref) => {
    const controls = useAnimation();
    const isRunning = useRef(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const currentLetterIndex = useRef(-1);
    const currentSrc = useRef("");

    const handleClick = useCallback(() => {
      if (isRunning.current && onClick && currentLetterIndex.current >= 0) {
        onClick(currentLetterIndex.current);
      }
    }, [onClick]);

    useImperativeHandle(ref, () => ({
      isActive: () => isRunning.current,
      show: async ({ x, y, newX, newY, zIndex, letterIndex, imageSrc }) => {
        const el = imgRef.current;
        if (!el) return;

        currentLetterIndex.current = letterIndex;

        controls.stop();
        controls.set({ opacity: 0 });

        el.src = imageSrc;
        currentSrc.current = imageSrc;
        el.style.display = "block";

        if (!el.complete || el.naturalHeight === 0) {
          await new Promise<void>((resolve) => {
            const done = () => { el.removeEventListener("load", done); el.removeEventListener("error", done); resolve(); };
            el.addEventListener("load", done, { once: true });
            el.addEventListener("error", done, { once: true });
          });
        }

        const rect = el.getBoundingClientRect();
        const center = (posX: number, posY: number) =>
          `translate(${posX - rect.width / 2}px, ${posY - rect.height / 2}px)`;

        controls.set({
          opacity: 0.85,
          zIndex,
          transform: `${center(x, y)} scale(0.95)`,
        });

        isRunning.current = true;

        await controls.start({
          opacity: 1,
          transform: `${center(newX, newY)} scale(1)`,
          transition: { duration: 0.7, ease: "circOut" },
        });

        await new Promise((r) => setTimeout(r, 1000));

        await Promise.all([
          controls.start({
            transform: `${center(newX, newY)} scale(0.15)`,
            transition: { duration: 0.8, ease: "easeInOut" },
          }),
          controls.start({
            opacity: 0,
            transition: { duration: 0.9, ease: "easeOut" },
          }),
        ]);

        isRunning.current = false;
      },
    }));

    return (
      <motion.img
        ref={imgRef}
        initial={{ opacity: 0, scale: 1 }}
        animate={controls}
        alt=""
        className="absolute max-h-36 max-w-32 rounded-sm object-contain shadow-md md:max-h-44 md:max-w-36"
        style={{ width: "auto", height: "auto", display: "none" }}
        onClick={handleClick}
      />
    );
  }
);

LetterTrailImage.displayName = "LetterTrailImage";
export default LetterTrailImage;
