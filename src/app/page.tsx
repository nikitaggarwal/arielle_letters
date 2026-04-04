"use client";

import { useDvh } from "@/hooks/useDvh";
import CustomCursor from "@/components/CustomCursor";
import HeroSection from "@/components/HeroSection";
import LetterList from "@/components/LetterList";
import Footer from "@/components/Footer";
import PlaceholderNotice from "@/components/GeneratePlaceholders";

export default function Home() {
  useDvh();

  return (
    <main className="relative min-h-screen bg-background">
      <CustomCursor />
      <HeroSection />
      <LetterList />
      <Footer />
      <PlaceholderNotice />
    </main>
  );
}
