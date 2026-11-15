"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

// Single Authoritative Split Poster Config (1920x1080 Aspect Ratio 16:9)
const BATMAN_SPLIT_POSTER = {
  id: "batman-split-triptych",
  title: "The Batman Split Triptych",
  category: "DC Comics · Cinematic Art",
  fullImage: "/images/hero/batman-split-full.webp",
  panels: [
    "/images/hero/batman-split-1.webp",
    "/images/hero/batman-split-2.webp",
    "/images/hero/batman-split-3.webp",
  ] as [string, string, string],
  panelCaptions: [
    "PANEL 01 · BA",
    "PANEL 02 · THE BATMAN",
    "PANEL 03 · MAN.",
  ] as [string, string, string],
  roomDescription:
    "Three seamless continuous panels spanning the iconic Batman artwork with ultra-thin 2px physical gaps.",
};

export const SplitPosterDisplay: React.FC = () => {
  const [activePin, setActivePin] = useState<number | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);

  // Smooth Replay function to re-trigger the sequential assembly animation
  const replaySequence = () => {
    if (typeof window === "undefined" || isReplaying) return;
    setIsReplaying(true);
    setActivePin(null);

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => setIsReplaying(false),
    });

    // Reset center & right panels to hidden, soften glow
    tl.set(".hero-split-panel-1", { opacity: 0, y: -35, scale: 0.92 })
      .set(".hero-split-panel-2", { opacity: 0, x: 35, scale: 0.95 })
      .set(".hero-split-frame-glow", { opacity: 0.1, scale: 0.9 })
      // Pulse Left Panel (Anchor)
      .fromTo(
        ".hero-split-panel-0",
        { scale: 0.96, opacity: 0.6, x: -30 },
        { scale: 1, opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }
      )
      // Reveal Center Panel with snappy hero drop
      .to(
        ".hero-split-panel-1",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.2)",
        },
        "+=0.35"
      )
      // Reveal Right Panel to complete the 1920x1080 triptych
      .to(
        ".hero-split-panel-2",
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.75,
          ease: "power3.out",
        },
        "+=0.35"
      )
      // Final bloom on ambient backlight glow
      .to(
        ".hero-split-frame-glow",
        {
          opacity: 0.7,
          scale: 1.05,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .to(".hero-split-frame-glow", {
        opacity: 0.25,
        scale: 1,
        duration: 1.2,
        ease: "power2.inOut",
      });
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* Three-Panel Split Poster Frame Composition */}
      <div className="relative w-full p-2.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-charcoal-card/70 border border-charcoal-border/80 backdrop-blur-md shadow-2xl overflow-hidden group">
        {/* Subtle Ambient Backlight Glow behind frames */}
        <div className="hero-split-frame-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 bg-brand-yellow/15 rounded-full blur-[90px] pointer-events-none -z-10" />

        {/* 3 Connected Rectangular Panels with Strict 2px Gap and 16:9 Aspect Ratio (1920x1080) */}
        <div className="grid grid-cols-3 gap-[2px] w-full aspect-[16/9] md:aspect-[16/7] items-stretch relative z-10 bg-black/60 p-[2px] rounded-xl sm:rounded-2xl border border-white/15 shadow-2xl overflow-hidden">
          {BATMAN_SPLIT_POSTER.panels.map((_, index) => (
            <div
              key={`split-slot-${index}`}
              className="relative h-full w-full overflow-hidden"
            >
              {/* Subtle Empty Frame Placeholder Outline while waiting for sequential reveal */}
              <div className="absolute inset-0 bg-[#0d0d0d] flex flex-col items-center justify-center pointer-events-none border border-white/[0.04]">
                <span className="text-[8px] sm:text-[10px] font-mono tracking-widest text-white/20 uppercase font-semibold">
                  PANEL 0{index + 1}
                </span>
                <span className="text-[7px] sm:text-[8px] text-white/10 mt-0.5 tracking-wider">
                  ARCHIVAL MATTE
                </span>
              </div>

              {/* The Animated Panel (Left enters initially, Center follows, Right completes) */}
              <div
                className={cn(
                  `hero-split-panel hero-split-panel-${index} relative h-full w-full overflow-hidden bg-charcoal-surface cursor-pointer group/panel will-change-transform`,
                  index === 0 && "rounded-l-lg sm:rounded-l-xl",
                  index === 2 && "rounded-r-lg sm:rounded-r-xl"
                )}
                onClick={() => setActivePin(activePin === index ? null : index)}
              >
                {/* Seamless split full image (1920x1080) with subpixel 2px physical gap compensation */}
                <div
                  className="absolute inset-y-0 transition-transform duration-500 group-hover/panel:scale-105 pointer-events-none"
                  style={{
                    width: "calc(300% + 4px)",
                    left:
                      index === 0
                        ? "0px"
                        : index === 1
                        ? "calc(-100% - 2px)"
                        : "calc(-200% - 4px)",
                  }}
                >
                  <Image
                    src={BATMAN_SPLIT_POSTER.fullImage}
                    alt={BATMAN_SPLIT_POSTER.panelCaptions[index]}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
                    className="object-cover object-center"
                    priority={true}
                  />
                </div>

                {/* Subtle Realistic Glass Surface Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

                {/* Interactive Hotspot Pin */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePin(activePin === index ? null : index);
                  }}
                  className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 z-20 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-brand-yellow text-charcoal-dark flex items-center justify-center font-bold shadow-glow-yellow animate-pulse hover:scale-110 transition-transform"
                  aria-label={`View specs for panel ${index + 1}`}
                >
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-charcoal-dark" />
                </button>

                {/* Hotspot Floating Tooltip when clicked */}
                {activePin === index && (
                  <div className="absolute inset-x-1.5 sm:inset-x-2 bottom-1.5 sm:bottom-2 z-30 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-charcoal-dark/95 border border-brand-yellow/60 text-left shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
                    <p className="font-manrope font-extrabold text-[9px] sm:text-[11px] text-brand-yellow truncate">
                      {BATMAN_SPLIT_POSTER.panelCaptions[index]}
                    </p>
                    <p className="text-[8px] sm:text-[9px] text-white/80 mt-0.5 line-clamp-1">
                      300 GSM Archival Matte · 2px Precision Split
                    </p>
                    <div className="mt-1 flex items-center justify-between text-[7px] sm:text-[8px] text-white/60 font-semibold border-t border-charcoal-border pt-0.5">
                      <span>A5 · A4 · A3 · A3+</span>
                      <span className="text-brand-yellow font-bold">₹ 499 Base</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Clean Spec Badge & Replay Trigger (Tabs removed per user request) */}
        <div className="mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-charcoal-border/70 flex items-center justify-center gap-3 text-xs text-brand-muted w-full">
          
          {/* Replay Assembly Animation Button */}
          <button
            type="button"
            onClick={replaySequence}
            disabled={isReplaying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal-surface hover:bg-charcoal-border border border-white/10 hover:border-brand-yellow/50 text-[11px] font-manrope font-semibold text-white/80 hover:text-brand-yellow transition-all active:scale-95 shadow-sm disabled:opacity-50 group/btn"
            title="Replay Panel Assembly Sequence"
          >
            <RotateCcw className={cn("w-3 h-3 transition-transform duration-500", isReplaying ? "animate-spin" : "group-hover/btn:-rotate-90")} />
            <span>Replay Assembly</span>
          </button>
        </div>
      </div>
    </div>
  );
};
