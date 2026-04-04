"use client";

import { createRef, useCallback, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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

  const [drawingsVisible, setDrawingsVisible] = useState(true);
  const fadeBackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      setDrawingsVisible(false);
      if (fadeBackTimer.current) clearTimeout(fadeBackTimer.current);
      fadeBackTimer.current = setTimeout(() => {
        setDrawingsVisible(true);
      }, 2800);

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
        imageSrc: letters[currentLetterIdx].trailImage ?? letters[currentLetterIdx].image,
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
          {/* Drawings — fade out when mouse trail is active */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: drawingsVisible ? 1 : 0 }}
            transition={{ duration: drawingsVisible ? 0.8 : 0.4, ease: "easeInOut" }}
          >
            {/* Top-center — 27th */}
            <motion.img
              src="/drawings/twentyseventh.png"
              alt=""
              className="absolute -top-10 left-1/2 -translate-x-1/2 h-auto w-12 md:-top-14 md:w-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1.5, delay: 1 }}
            />
            {/* Top-right — Balloons */}
            <motion.img
              src="/drawings/balloons.png"
              alt=""
              className="absolute -top-14 -right-4 h-auto w-20 md:-right-20 md:-top-16 md:w-28"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1.5, delay: 1.1 }}
            />
            {/* Right upper — Miffy bunny */}
            <motion.img
              src="/drawings/miffy_bunny.png"
              alt=""
              className="absolute -top-2 -right-10 h-auto w-16 md:-right-26 md:-top-4 md:w-22"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              transition={{ duration: 1.5, delay: 1.2 }}
            />
            {/* Right middle — Happy Birthday text */}
            <motion.img
              src="/drawings/happy_birthday_text.png"
              alt=""
              className="absolute top-1/2 -right-12 -translate-y-1/2 h-auto w-24 md:-right-36 md:w-36"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1.5, delay: 1.3 }}
            />
            {/* Bottom-right — Dog on skateboard */}
            <motion.img
              src="/drawings/dog.png"
              alt=""
              className="absolute -bottom-14 -right-2 h-auto w-20 md:-bottom-18 md:-right-12 md:w-28"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ duration: 1.5, delay: 1.4 }}
            />
            {/* Bottom-center — Small symbol */}
            <motion.img
              src="/drawings/small_symbol.png"
              alt=""
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-auto w-8 md:-bottom-14 md:w-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ duration: 1.5, delay: 1.5 }}
            />
            {/* Bottom-left — Coffee cup */}
            <motion.img
              src="/drawings/coffee_cup.png"
              alt=""
              className="absolute -bottom-14 -left-2 h-auto w-10 md:-bottom-18 md:-left-12 md:w-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1.5, delay: 1.6 }}
            />
            {/* Left lower — Cat */}
            <motion.img
              src="/drawings/cat.png"
              alt=""
              className="absolute bottom-4 -left-10 h-auto w-14 md:-left-26 md:bottom-2 md:w-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ duration: 1.5, delay: 1.7 }}
            />
            {/* Left middle — Hearts */}
            <motion.img
              src="/drawings/hearts.png"
              alt=""
              className="absolute top-1/3 -left-8 h-auto w-14 md:-left-20 md:w-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1.5, delay: 1.8 }}
            />
            {/* Top-left — Cake & Gift */}
            <motion.img
              src="/drawings/cake_and_gift.png"
              alt=""
              className="absolute -top-14 -left-6 h-auto w-20 md:-left-24 md:-top-16 md:w-28"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1.5, delay: 1.9 }}
            />
            {/* Left upper — Chinese characters */}
            <motion.img
              src="/drawings/chinese.png"
              alt=""
              className="absolute top-0 -left-14 h-auto w-5 md:-left-32 md:-top-2 md:w-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ duration: 1.5, delay: 2 }}
            />
            {/* Right lower — Smiley face */}
            <motion.img
              src="/drawings/smiley_face.png"
              alt=""
              className="absolute bottom-0 -right-6 h-auto w-10 md:-right-18 md:-bottom-2 md:w-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1.5, delay: 2.1 }}
            />
          </motion.div>

          {/* Foreground — always visible */}
          <div className="relative flex items-center justify-center">
            <motion.img
              src="/drawings/arielle_calligraphy.png"
              alt="Arielle"
              className="h-auto w-[clamp(10rem,35vw,24rem)] object-contain"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0, 1] }}
            />
            <motion.img
              src="/snoopy.png"
              alt="Snoopy with heart"
              className="absolute -right-12 -bottom-2 h-12 w-auto object-contain md:-right-20 md:-bottom-4 md:h-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>

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
