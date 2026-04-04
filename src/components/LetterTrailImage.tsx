"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { motion, useAnimation } from "framer-motion";

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
    const [src, setSrc] = useState("");

    useImperativeHandle(ref, () => ({
      isActive: () => isRunning.current,
      show: async ({ x, y, newX, newY, zIndex, letterIndex, imageSrc }) => {
        const el = imgRef.current;
        if (!el) return;

        currentLetterIndex.current = letterIndex;
        setSrc(imageSrc);

        // Wait a tick for src to update so getBoundingClientRect is accurate
        await new Promise((r) => requestAnimationFrame(r));

        const rect = el.getBoundingClientRect();
        const center = (posX: number, posY: number) =>
          `translate(${posX - rect.width / 2}px, ${posY - rect.height / 2}px)`;

        controls.stop();

        controls.set({
          opacity: isRunning.current ? 1 : 0.85,
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
        src={src || undefined}
        alt=""
        className="absolute max-h-36 max-w-32 cursor-none rounded-sm object-contain shadow-md md:max-h-44 md:max-w-36"
        style={{ width: "auto", height: "auto", display: src ? "block" : "none" }}
        onClick={() => {
          if (isRunning.current && onClick && currentLetterIndex.current >= 0) {
            onClick(currentLetterIndex.current);
          }
        }}
      />
    );
  }
);

LetterTrailImage.displayName = "LetterTrailImage";
export default LetterTrailImage;
