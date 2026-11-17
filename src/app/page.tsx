import React from "react";
import { Header } from "@/components/layout/Header";
import { PosterSelectionDrawer } from "@/components/layout/PosterSelectionDrawer";
import { HeroSection } from "@/components/sections/HeroSection";
import { CollectionsSection } from "@/components/sections/CollectionsSection";
import { RoomInspirationSection } from "@/components/sections/RoomInspirationSection";
import { BestSellingSection } from "@/components/sections/BestSellingSection";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { CustomPosterSection } from "@/components/sections/CustomPosterSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { Footer } from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-charcoal-dark text-white selection:bg-brand-yellow selection:text-charcoal-dark flex flex-col relative">
      <ErrorBoundary fallbackTitle="Navigation Temporarily Unavailable">
        <Header />
      </ErrorBoundary>
      <ErrorBoundary fallbackTitle="Cart Temporarily Unavailable">
        <PosterSelectionDrawer />
      </ErrorBoundary>
      <ErrorBoundary fallbackTitle="Hero Showcase Unavailable">
        <HeroSection />
      </ErrorBoundary>
      <ErrorBoundary fallbackTitle="Unable to load collections catalog">
        <BestSellingSection />
      </ErrorBoundary>
      <ErrorBoundary fallbackTitle="Unable to load room inspiration gallery">
        <RoomInspirationSection />
      </ErrorBoundary>
      <ErrorBoundary fallbackTitle="Unable to load best sellers">
        <CollectionsSection />
      </ErrorBoundary>
      <ErrorBoundary fallbackTitle="Wall transformation unavailable">
        <BeforeAfterSection />
      </ErrorBoundary>
      <ErrorBoundary fallbackTitle="Custom poster studio unavailable">
        <CustomPosterSection />
      </ErrorBoundary>
      <ErrorBoundary fallbackTitle="Help & FAQ Temporarily Unavailable">
        <FAQSection />
      </ErrorBoundary>
      <Footer />
    </main>
  );
}
