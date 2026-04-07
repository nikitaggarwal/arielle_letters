"use client";

import { useDvh } from "@/hooks/useDvh";
import CustomCursor from "@/components/CustomCursor";
import HeroSection from "@/components/HeroSection";
import LetterList from "@/components/LetterList";
import Footer from "@/components/Footer";
import PlaceholderNotice from "@/components/GeneratePlaceholders";
import PasswordGate from "@/components/PasswordGate";

export default function Home() {
  useDvh();

  return (
    <PasswordGate>
      <main className="relative min-h-screen bg-background">
        <CustomCursor />
        <HeroSection />
        <LetterList />
        <Footer />
        <PlaceholderNotice />
      </main>
    </PasswordGate>
  );
}
