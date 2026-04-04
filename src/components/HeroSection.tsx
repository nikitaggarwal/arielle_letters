"use client";

import { createRef, useCallback, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";
import { getDistance, lerp } from "@/lib/utils";
import { letters } from "@/lib/letters";
import LetterTrailImage, { type LetterTrailImageRef } from "./LetterTrailImage";
import LetterLightbox from "./LetterLightbox";
import Heart from "./illustrations/Heart";

const TRAIL_COUNT = 14;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 12]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.88]);
  const opacity = useTransform(scrollYProgress, [0.3, 0.6], [1, 0]);
  const filterBlur = useTransform(blur, (v) => `blur(${v}px)`);

  const trailsRef = useRef(
    Array.from({ length: TRAIL_COUNT }, () => createRef<LetterTrailImageRef>())
  );
  const lastPosition = useRef({ x: 0, y: 0 });
  const cachedPosition = useRef({ x: 0, y: 0 });
  const imageIndex = useRef(0);
  const zIndex = useRef(1);
  const letterCycle = useRef(0);

  const update = useCallback((cursor: { x: number; y: number }) => {
    const activeCount = trailsRef.current.filter(
      (r) => r.current?.isActive()
    ).length;
    if (activeCount === 0) zIndex.current = 1;

    const distance = getDistance(
      cursor.x,
      cursor.y,
      lastPosition.current.x,
      lastPosition.current.y
    );

    const newCache = {
      x: lerp(cachedPosition.current.x || cursor.x, cursor.x, 0.15),
      y: lerp(cachedPosition.current.y || cursor.y, cursor.y, 0.15),
    };
    cachedPosition.current = newCache;

    if (distance > 120) {
      imageIndex.current = (imageIndex.current + 1) % TRAIL_COUNT;
      zIndex.current += 1;
      const currentLetterIdx = letterCycle.current % letters.length;
      letterCycle.current += 1;
      lastPosition.current = cursor;
      trailsRef.current[imageIndex.current].current?.show({
        x: newCache.x,
        y: newCache.y,
        zIndex: zIndex.current,
        newX: cursor.x,
        newY: cursor.y,
        letterIndex: currentLetterIdx,
        imageSrc: letters[currentLetterIdx].image,
      });
    }
  }, []);

  useMousePosition(trailContainerRef, update);

  const handleTrailClick = useCallback((letterIndex: number) => {
    setLightboxIndex(letterIndex);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      >
        {/* Image trail container */}
        <div
          ref={trailContainerRef}
          className="absolute inset-0 z-10"
        >
          {trailsRef.current.map((ref, i) => (
            <LetterTrailImage
              key={i}
              ref={ref}
              onClick={handleTrailClick}
            />
          ))}
        </div>

        {/* Content + surrounding drawings */}
        <motion.div
          className="relative z-20 flex flex-col items-center gap-4 px-6 text-center pointer-events-none"
          style={{ scale, filter: filterBlur, opacity }}
        >
          {/* Drawings surrounding the text — closer to center, 2x darker */}

          {/* Balloons — top-right */}
          <motion.img
            src="/drawings/balloons.png"
            alt=""
            className="absolute -top-14 -right-4 h-auto w-20 md:-right-20 md:-top-16 md:w-28"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1.5, delay: 1 }}
          />
          {/* Cake — bottom-left */}
          <motion.img
            src="/drawings/cake.png"
            alt=""
            className="absolute -bottom-4 -left-8 h-auto w-12 md:-bottom-6 md:-left-20 md:w-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          />
          {/* Gift — top-left */}
          <motion.img
            src="/drawings/gift.png"
            alt=""
            className="absolute -top-10 -left-6 h-auto w-12 md:-left-20 md:-top-12 md:w-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 1.4 }}
          />
          {/* Hearts — bottom-right */}
          <motion.img
            src="/drawings/hearts.png"
            alt=""
            className="absolute -bottom-4 -right-2 h-auto w-16 md:-bottom-6 md:-right-16 md:w-22"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1.5, delay: 1.1 }}
          />
          {/* Chinese characters — left side */}
          <motion.img
            src="/drawings/chinese.png"
            alt=""
            className="absolute top-2 -left-12 h-auto w-6 md:-left-28 md:top-0 md:w-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1.5, delay: 1.3 }}
          />
          {/* Gujarati script — right side */}
          <motion.img
            src="/drawings/gujarati.png"
            alt=""
            className="absolute -right-6 bottom-4 h-auto w-16 md:-right-24 md:bottom-2 md:w-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1.5, delay: 1.5 }}
          />
          {/* Bunny — upper right */}
          <motion.img
            src="/drawings/bunny.png"
            alt=""
            className="absolute -top-16 right-4 h-auto w-10 md:-top-20 md:-right-8 md:w-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 1.6 }}
          />
          {/* "27" — lower left */}
          <motion.img
            src="/drawings/twentyseven.png"
            alt=""
            className="absolute -bottom-2 -left-10 h-auto w-10 md:-left-24 md:-bottom-2 md:w-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1.5, delay: 1.7 }}
          />
          {/* Dog on skateboard — bottom center-left */}
          <motion.img
            src="/drawings/dog.png"
            alt=""
            className="absolute -bottom-12 left-0 h-auto w-14 md:-bottom-14 md:-left-4 md:w-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1.5, delay: 1.8 }}
          />
          {/* Cat in blanket — left side */}
          <motion.img
            src="/drawings/cat.png"
            alt=""
            className="absolute -left-6 bottom-8 h-auto w-10 md:-left-24 md:bottom-6 md:w-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1.5, delay: 2 }}
          />

          {/* Snoopy */}
          <motion.img
            src="/snoopy.png"
            alt="Snoopy with heart"
            className="mb-2 h-24 w-auto object-contain md:h-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          {/* Handwritten "arielle" from Avika's letter */}
          <motion.img
            src="/drawings/arielle_calligraphy.png"
            alt="Arielle"
            className="h-auto w-[clamp(12rem,40vw,28rem)] object-contain"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0, 1] }}
          />

          {/* Subtitle with hearts */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Heart className="w-3.5 h-3.5 text-accent/40" />
            <p className="text-sm tracking-[0.3em] uppercase text-muted">
              Happy Birthday
            </p>
            <Heart className="w-3.5 h-3.5 text-accent/40" />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <motion.div
              className="h-10 w-px bg-foreground/15"
              animate={{ scaleY: [0, 1, 0], originY: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      </section>

      <LetterLightbox
        letters={letters}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
