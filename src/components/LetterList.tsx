"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { letters } from "@/lib/letters";
import LetterRow from "./LetterRow";
import LetterLightbox from "./LetterLightbox";

export default function LetterList() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <section className="relative px-4 py-24 md:px-8 lg:px-16">
        <motion.div
          className="mb-12 flex items-baseline justify-between border-b border-border pb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-sm tracking-[0.3em] uppercase text-muted">
            Letters
          </h2>
          <span className="text-sm text-muted">
            {letters.length} letters
          </span>
        </motion.div>

        <div className="border-t border-border">
          {letters.map((letter, index) => (
            <LetterRow
              key={letter.id}
              letter={letter}
              index={index}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              onClick={() => setLightboxIndex(index)}
            />
          ))}
        </div>
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
