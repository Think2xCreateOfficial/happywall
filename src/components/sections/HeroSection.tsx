"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SplitPosterDisplay } from "@/components/ui/SplitPosterDisplay";
import { initHeroAnimation } from "@/animations/hero-animations";

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = initHeroAnimation(heroRef.current);
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen pt-32 sm:pt-36 lg:pt-40 pb-20 lg:pb-28 flex flex-col items-center justify-center bg-charcoal-dark overflow-hidden text-center"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-yellow/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-black/40 blur-[120px] pointer-events-none -z-10" />

      <Container size="wide" className="relative z-10 flex flex-col items-center">

        {/* A. Bold Memorable Centered Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-manrope font-extrabold text-white tracking-tight leading-[1.08] max-w-4xl mb-6">
          <span className="hero-headline-line block">YOUR WALLS.</span>
          <span className="hero-headline-line block text-white/95">
            YOUR PERSONALITY.
          </span>
          <span className="hero-headline-line block">
            YOUR{" "}
            <span className="brush-accent relative text-brand-yellow font-extrabold italic tracking-normal inline-block">
              STORY.
              {/* Organic golden underline wave */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-brand-yellow pointer-events-none"
                viewBox="0 0 100 20"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 15C25 5 70 4 97 12"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </span>
        </h1>

        {/* B. Supporting Description */}
        <p className="hero-subtext text-base sm:text-lg md:text-xl text-brand-muted max-w-xl font-inter leading-relaxed mb-8 mx-auto">
          Find posters that feel like you. Give your walls a personality of their own.
        </p>

        {/* C. Split Poster Artwork (The Visual Centrepiece) */}
        <div className="w-full">
          <SplitPosterDisplay />
        </div>
      </Container>
    </section>
  );
};
