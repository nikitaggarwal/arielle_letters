"use client";

import { motion } from "framer-motion";
import Heart from "./illustrations/Heart";

export default function Footer() {
  return (
    <footer className="px-4 py-16 md:px-8 lg:px-16">
      <motion.div
        className="border-t border-border pt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted/40">
              hbd arielle
            </p>
            <Heart className="w-3 h-3 text-accent/40" />
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
