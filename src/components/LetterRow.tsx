"use client";

import { motion } from "framer-motion";
import type { Letter } from "@/lib/letters";

interface LetterRowProps {
  letter: Letter;
  index: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export default function LetterRow({
  letter,
  index,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: LetterRowProps) {
  return (
    <motion.div
      className="group border-b border-border/60 py-6 md:py-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.04 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className="flex cursor-none items-baseline justify-between gap-4 px-2 md:px-4">
        <div className="flex items-baseline gap-4 md:gap-8">
          <span className="text-xs tabular-nums text-muted transition-colors duration-300 group-hover:text-accent">
            {letter.id}
          </span>
          <h3 className="text-xl font-light tracking-tight transition-all duration-300 group-hover:tracking-wide md:text-3xl lg:text-4xl">
            {letter.from}
          </h3>
        </div>
        <p className="hidden text-sm text-muted/70 transition-colors duration-300 group-hover:text-foreground/50 md:block">
          {letter.preview}
        </p>
      </div>
    </motion.div>
  );
}
