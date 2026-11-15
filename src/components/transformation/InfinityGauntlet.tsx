"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { AntigravityScene } from "./AntigravityScene";
import { cn } from "@/lib/utils";

export interface InfinityGauntletHandle {
  playSnap: (onContact: () => void, onComplete: () => void) => void;
  reset: () => void;
  getElement: () => HTMLDivElement | null;
}

export interface InfinityGauntletProps {
  isIdle: boolean;
  isSnapping: boolean;
  hasSnapped: boolean;
  onClick: () => void;
  className?: string;
}

// Precise percentage coordinates of all 6 Infinity Stones on thanos-gauntlet.webp
const INFINITY_STONES = [
  {
    name: "Mind Stone (Yellow)",
    x: 37.0,
    y: 57.8,
    size: "w-5 h-6 sm:w-7 sm:h-9 md:w-9 md:h-11",
    color: "#FFD700",
    glowColor: "rgba(255, 215, 0, 0.95)",
    boxShadow: "0 0 16px 5px rgba(255, 215, 0, 0.9)",
  },
  {
    name: "Power Stone (Purple)",
    x: 49.4,
    y: 38.0,
    size: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
    color: "#D05CE3",
    glowColor: "rgba(208, 92, 227, 0.95)",
    boxShadow: "0 0 12px 4px rgba(208, 92, 227, 0.9)",
  },
  {
    name: "Space Stone (Blue)",
    x: 39.4,
    y: 41.2,
    size: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
    color: "#40C4FF",
    glowColor: "rgba(64, 196, 255, 0.95)",
    boxShadow: "0 0 12px 4px rgba(64, 196, 255, 0.9)",
  },
  {
    name: "Reality Stone (Red)",
    x: 29.3,
    y: 46.5,
    size: "w-2.5 h-3 sm:w-3.5 sm:h-4 md:w-4 md:h-5",
    color: "#FF5252",
    glowColor: "rgba(255, 82, 82, 0.95)",
    boxShadow: "0 0 12px 4px rgba(255, 82, 82, 0.9)",
  },
  {
    name: "Soul Stone (Orange)",
    x: 25.2,
    y: 48.0,
    size: "w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4",
    color: "#FF9100",
    glowColor: "rgba(255, 145, 0, 0.95)",
    boxShadow: "0 0 10px 3px rgba(255, 145, 0, 0.9)",
  },
  {
    name: "Time Stone (Green)",
    x: 72.4,
    y: 55.9,
    size: "w-4 h-5 sm:w-5 sm:h-6 md:w-7 md:h-8",
    color: "#69F0AE",
    glowColor: "rgba(105, 240, 174, 0.95)",
    boxShadow: "0 0 14px 4px rgba(105, 240, 174, 0.9)",
  },
];

export const InfinityGauntlet = forwardRef<InfinityGauntletHandle, InfinityGauntletProps>(
  ({ isIdle, isSnapping, hasSnapped, onClick, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const handRef = useRef<HTMLDivElement>(null);
    const sparkFlashRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    // Expose control handles to parent (playSnap, reset)
    useImperativeHandle(ref, () => ({
      playSnap: (onContact: () => void, onComplete: () => void) => {
        if (!handRef.current || !containerRef.current) {
          onContact();
          onComplete();
          return;
        }

        // Hide prompt badge immediately
        if (badgeRef.current) {
          gsap.to(badgeRef.current, { opacity: 0, scale: 0.8, duration: 0.15 });
        }

        const tl = gsap.timeline({
          onComplete: () => {
            onComplete();
          },
        });

        // 1. Tension / Coil: Hand prepares for snap (rotates back and scales down slightly)
        tl.to(handRef.current, {
          scale: 0.94,
          rotation: -6,
          duration: 0.22,
          ease: "power2.in",
        });

        // 2. The Snap Whip: Fast flick forward into snap position
        tl.to(handRef.current, {
          scale: 1.08,
          rotation: 8,
          x: -10,
          y: -4,
          duration: 0.08,
          ease: "power4.out",
          onStart: () => {
            // Instant starburst spark flash at thumb & middle-finger contact point
            if (sparkFlashRef.current) {
              gsap.fromTo(
                sparkFlashRef.current,
                { opacity: 1, scale: 0.4 },
                { opacity: 0, scale: 2.2, duration: 0.4, ease: "power2.out" }
              );
            }
            // Trigger contact callback (plays snap sound, triggers particle shockwaves)
            onContact();
          },
        });

        // 3. Elastic Recoil & Settle
        tl.to(handRef.current, {
          scale: 1.0,
          rotation: 0,
          x: 0,
          y: 0,
          duration: 0.35,
          ease: "elastic.out(1, 0.4)",
        });

        // 4. Elegant Retreat: Fade and lower hand gracefully so user can see full decorated wall
        tl.to(
          containerRef.current,
          {
            y: 40,
            opacity: 0,
            scale: 0.9,
            duration: 0.55,
            ease: "power2.inOut",
          },
          "+=0.2"
        );
      },

      reset: () => {
        if (!containerRef.current || !handRef.current) return;

        gsap.to(containerRef.current, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            if (badgeRef.current) {
              gsap.to(badgeRef.current, { opacity: 1, scale: 1, duration: 0.3 });
            }
          },
        });
      },

      getElement: () => containerRef.current,
    }));

    // Handle keyboard interaction (Enter / Spacebar)
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isIdle) onClick();
      }
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative flex flex-col items-center justify-center select-none pointer-events-auto",
          hasSnapped && "pointer-events-none opacity-0",
          className
        )}
      >
        {/* REALISTIC 3D ANTIGRAVITY SCENE WRAPPER */}
        <AntigravityScene
          isActive={isIdle}
          particleCount={14}
          showShadow={true}
          showParticles={true}
          perspective={1000}
        >
          {/* THE REAL INTERACTIVE INFINITY GAUNTLET HAND */}
          <div
            ref={handRef}
            role="button"
            tabIndex={isIdle ? 0 : -1}
            onClick={isIdle ? onClick : undefined}
            onKeyDown={handleKeyDown}
            aria-label="Thanos Infinity Gauntlet - Tap to snap and transform the room wall"
            className={cn(
              "relative aspect-[840/859] w-36 sm:w-52 md:w-64 lg:w-72 cursor-pointer group focus:outline-none transition-transform duration-300",
              isIdle && "hover:scale-105 active:scale-95 focus-visible:ring-4 focus-visible:ring-brand-yellow/80 rounded-3xl",
              !isIdle && "cursor-default"
            )}
          >
            {/* Gauntlet PNG / WebP Asset */}
            <div className="relative w-full h-full pointer-events-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] filter group-hover:brightness-105 transition-all">
              <Image
                src="/images/transformations/thanos-gauntlet.webp"
                alt="Thanos Infinity Gauntlet Hand with 6 Glowing Infinity Stones"
                fill
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 240px, 300px"
                className="object-contain"
                priority
              />
            </div>

            {/* 6 INDIVIDUAL GLOWING INFINITY STONES */}
            <div className="absolute inset-0 pointer-events-none">
              {INFINITY_STONES.map((stone, idx) => (
                <div
                  key={stone.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-300"
                  style={{
                    left: `${stone.x}%`,
                    top: `${stone.y}%`,
                  }}
                >
                  {/* Stone Pulsing Glow Flare */}
                  <div
                    className={cn(
                      "rounded-full transition-all duration-300",
                      stone.size,
                      isIdle && "animate-pulse",
                      isSnapping
                        ? "scale-150 opacity-100"
                        : "opacity-85 group-hover:opacity-100 group-hover:scale-125"
                    )}
                    style={{
                      backgroundColor: stone.glowColor,
                      boxShadow: isSnapping
                        ? `0 0 28px 10px ${stone.color}`
                        : stone.boxShadow,
                      animationDelay: `${idx * 0.2}s`,
                      animationDuration: isSnapping ? "0.4s" : "2.2s",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* SNAP CONTACT POINT SPARK EMITTER (Thumb & Middle Finger Junction: 64.3%, 23.3%) */}
            <div
              ref={sparkFlashRef}
              className="snap-spark-flash absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 z-30"
              style={{
                left: "64.3%",
                top: "23.3%",
              }}
            >
              {/* Blinding Golden Starburst Flash */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-radial from-white via-brand-yellow to-transparent blur-sm shadow-[0_0_40px_16px_#FFD700]" />
            </div>

            {/* Ambient Cosmic Halo behind Gauntlet */}
            <div
              className={cn(
                "absolute inset-0 -z-10 rounded-full blur-2xl transition-all duration-700 pointer-events-none",
                isSnapping
                  ? "bg-brand-yellow/50 scale-125"
                  : "bg-brand-yellow/20 group-hover:bg-brand-yellow/35 scale-90"
              )}
            />
          </div>
        </AntigravityScene>

        {/* INTERACTION CALLOUT BADGE (Shows in idle state) */}
        {isIdle && (
          <div
            ref={badgeRef}
            className="mt-1 sm:mt-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-charcoal-dark/95 backdrop-blur-md border border-brand-yellow/60 text-white shadow-glow-yellow animate-bounce pointer-events-none z-30"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-yellow animate-ping" />
              <span className="font-manrope font-extrabold text-[10px] sm:text-xs text-brand-yellow tracking-wider uppercase">
                TAP GAUNTLET TO SNAP
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

InfinityGauntlet.displayName = "InfinityGauntlet";
