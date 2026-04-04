"use client";

/**
 * Run this component once to check that letter images exist.
 * In production, replace /public/letters/01.jpg through 20.jpg with real photos.
 */

import { useEffect, useState } from "react";
import { letters } from "@/lib/letters";

export default function PlaceholderNotice() {
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    const checkImages = async () => {
      const results = await Promise.all(
        letters.map(async (letter) => {
          try {
            const res = await fetch(letter.image, { method: "HEAD" });
            return res.ok ? null : letter.image;
          } catch {
            return letter.image;
          }
        })
      );
      setMissing(results.filter(Boolean) as string[]);
    };
    checkImages();
  }, []);

  if (missing.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] max-w-sm rounded-lg border border-accent/30 bg-background/90 p-4 text-xs text-muted backdrop-blur-md">
      <p className="mb-1 font-medium text-accent">Missing letter images</p>
      <p>
        Add your photos to <code className="text-foreground/70">public/letters/</code> as{" "}
        <code className="text-foreground/70">01.jpg</code> through{" "}
        <code className="text-foreground/70">{String(letters.length).padStart(2, "0")}.jpg</code>
      </p>
    </div>
  );
}
