"use client";

import { createRef, useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";
import { getDistance, lerp } from "@/lib/utils";
import { letters } from "@/lib/letters";
import LetterTrailImage, { type LetterTrailImageRef, preloadAllImages } from "./LetterTrailImage";
import LetterLightbox from "./LetterLightbox";
import Heart from "./illustrations/Heart";

const TRAIL_COUNT = 14;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trailContainerRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    preloadAllImages(letters.map((l) => l.image));
  }, []);

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
        {/* Image trail container — pointer-events disabled on touch devices so scrolling works */}
        <div
          ref={trailContainerRef}
          className="absolute inset-0 z-10 pointer-events-none md:pointer-events-auto"
        >
          {trailsRef.current.map((ref, i) => (
            <LetterTrailImage
              key={i}
              ref={ref}
              onClick={handleTrailClick}
            />
          ))}
        </div>

        {/* Scroll effects wrapper for all decorative content */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ scale, filter: filterBlur, opacity }}
        >
        {/* Drawings at viewport edges — fade out during mouse trail */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: drawingsVisible ? 1 : 0 }}
          transition={{ duration: drawingsVisible ? 0.8 : 0.4, ease: "easeInOut" }}
        >
          {/* Top-left corner */}
          <motion.img
            src="/drawings/cake_and_gift.png"
            alt=""
            className="absolute top-6 left-4 h-auto w-16 md:top-8 md:left-8 md:w-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 1 }}
          />
          <motion.img
            src="/drawings/chinese.png"
            alt=""
            className="absolute top-6 left-24 h-auto w-4 md:top-10 md:left-36 md:w-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1.5, delay: 2 }}
          />

          {/* Top-right corner */}
          <motion.img
            src="/drawings/balloons.png"
            alt=""
            className="absolute top-4 right-4 h-auto w-16 md:top-6 md:right-8 md:w-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1.5, delay: 1.1 }}
          />
          <motion.img
            src="/drawings/twentyseventh.png"
            alt=""
            className="absolute top-4 right-24 h-auto w-10 md:top-6 md:right-36 md:w-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 1.2 }}
          />

          {/* Left edge */}
          <motion.img
            src="/drawings/hearts.png"
            alt=""
            className="absolute top-1/3 left-4 h-auto w-12 md:left-8 md:w-18"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1.5, delay: 1.3 }}
          />
          <motion.img
            src="/drawings/cat.png"
            alt=""
            className="absolute bottom-1/4 left-4 h-auto w-12 md:left-8 md:w-18"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1.5, delay: 1.8 }}
          />

          {/* Right edge */}
          <motion.img
            src="/drawings/miffy_bunny.png"
            alt=""
            className="absolute top-1/4 right-4 h-auto w-14 md:right-8 md:w-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ duration: 1.5, delay: 1.4 }}
          />
          <motion.img
            src="/drawings/happy_birthday_text.png"
            alt=""
            className="absolute top-1/2 right-4 -translate-y-1/2 h-auto w-20 md:right-8 md:w-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 1.5 }}
          />
          <motion.img
            src="/drawings/smiley_face.png"
            alt=""
            className="absolute bottom-1/4 right-6 h-auto w-10 md:right-10 md:w-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 2.1 }}
          />

          {/* Bottom-left */}
          <motion.img
            src="/drawings/coffee_cup.png"
            alt=""
            className="absolute bottom-6 left-4 h-auto w-8 md:bottom-8 md:left-8 md:w-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 1.6 }}
          />
          <motion.img
            src="/drawings/small_symbol.png"
            alt=""
            className="absolute bottom-8 left-20 h-auto w-6 md:bottom-10 md:left-24 md:w-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1.5, delay: 1.9 }}
          />

          {/* Bottom-right */}
          <motion.img
            src="/drawings/dog.png"
            alt=""
            className="absolute bottom-6 right-4 h-auto w-16 md:bottom-8 md:right-8 md:w-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1.5, delay: 1.7 }}
          />
        </motion.div>

        {/* Centered content — always visible */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center pointer-events-none">
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

          {/* Scroll arrow */}
          <motion.div
            className="mt-16 flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <motion.svg
              width="16"
              height="32"
              viewBox="0 0 16 32"
              fill="none"
              className="text-foreground/20"
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                d="M8 0v26m0 0l-6-6m6 6l6-6"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>
        </div>
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
