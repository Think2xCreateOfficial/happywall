"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, RotateCcw, Volume2, VolumeX, CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { InfinityGauntlet, InfinityGauntletHandle } from "@/components/transformation/InfinityGauntlet";
import { SnapCanvas, SnapCanvasHandle } from "@/components/transformation/SnapCanvas";
import { snapAudio } from "@/components/transformation/SnapAudio";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";

type TransformationState = "before" | "snapping" | "materializing" | "after" | "resetting";

interface WallPosterConfig {
  id: string;
  title: string;
  category: string;
  image: string; // Supabase storage path or image URL
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
  heightPercent: number;
  elevationShadow: string;
}

// 3 Curated Wall Posters properly mapped to the physical wall space in empty-wall-living.jpg
const WALL_POSTERS: WallPosterConfig[] = [
  {
    id: "wall-poster-left",
    title: "Demon Slayer: Tanjiro",
    category: "Anime",
    image: "posters/anime/tanjiro.webp",
    leftPercent: 36.5,
    topPercent: 18.5,
    widthPercent: 11.0,
    heightPercent: 20.0,
    elevationShadow: "shadow-[0_12px_24px_rgba(0,0,0,0.8)]",
  },
  {
    id: "wall-poster-main",
    title: "The Batman Split Triptych",
    category: "Split Poster",
    image: "posters/split-poster/batman-split-full.webp",
    // Positioned strictly inside the physical empty frame on the wall
    leftPercent: 52.25,
    topPercent: 15.83,
    widthPercent: 14.35,
    heightPercent: 25.74,
    elevationShadow: "shadow-[0_18px_36px_rgba(0,0,0,0.9)]",
  },
  {
    id: "wall-poster-right",
    title: "Cyberpunk Battlestation",
    category: "Games",
    image: "posters/games/cyber-gaming-01.webp",
    leftPercent: 69.5,
    topPercent: 18.5,
    widthPercent: 11.0,
    heightPercent: 20.0,
    elevationShadow: "shadow-[0_12px_24px_rgba(0,0,0,0.8)]",
  },
];

export const BeforeAfterSection: React.FC = () => {
  const [state, setState] = useState<TransformationState>("before");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const gauntletRef = useRef<InfinityGauntletHandle>(null);
  const canvasRef = useRef<SnapCanvasHandle>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);
  const postersGroupRef = useRef<HTMLDivElement>(null);
  const activeTimeline = useRef<gsap.core.Timeline | null>(null);

  // Sync mute state with audio engine
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    snapAudio.setMuted(nextMuted);
  };

  // Cleanup GSAP timelines on unmount
  useEffect(() => {
    return () => {
      if (activeTimeline.current) {
        activeTimeline.current.kill();
      }
    };
  }, []);

  /**
   * THE REAL INFINITY GAUNTLET SNAP INTERACTION
   * Triggered when customer clicks the Thanos Gauntlet hand in the center of the room
   */
  const handleSnap = () => {
    if (state !== "before") return;

    setState("snapping");

    if (activeTimeline.current) {
      activeTimeline.current.kill();
    }

    // Call the Gauntlet's internal snap choreography
    gauntletRef.current?.playSnap(
      // 1. Exact contact frame callback (Thumb & Middle finger snap)
      () => {
        // A. Synchronized snap sound
        snapAudio.playSnap();

        // B. Cinematic screen micro-shake / impact
        if (sceneRef.current) {
          gsap.to(sceneRef.current, {
            x: "+=4",
            y: "-=4",
            duration: 0.04,
            yoyo: true,
            repeat: 5,
            ease: "power1.inOut",
            onComplete: () => {
              if (sceneRef.current) {
                gsap.set(sceneRef.current, { x: 0, y: 0 });
              }
            },
          });
        }

        // C. Golden cosmic energy flash
        if (flashOverlayRef.current) {
          gsap.fromTo(
            flashOverlayRef.current,
            { opacity: 0 },
            {
              opacity: 0.75,
              duration: 0.15,
              yoyo: true,
              repeat: 1,
              ease: "power2.out",
            }
          );
        }

        // D. Canvas cosmic dust dispersal & dual shockwaves
        canvasRef.current?.triggerBurst(50, 45);
      },

      // 2. Snap motion complete callback -> Materialize posters onto the wall
      () => {
        setState("materializing");

        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              setState("after");
            },
          });
          activeTimeline.current = tl;

          // Staggered materialization of poster frames onto the empty wall
          tl.fromTo(
            ".snap-poster-frame",
            {
              opacity: 0,
              scale: 0.82,
              filter: "blur(14px)",
              y: 12,
            },
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              y: 0,
              stagger: 0.25,
              duration: 1.1,
              ease: "back.out(1.3)",
              onStart: () => {
                snapAudio.playCosmicChime();
              },
            }
          );

          // Golden wall ambient aura settles behind the posters
          tl.fromTo(
            ".snap-aura-glow",
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
            "-=0.4"
          );
        }, containerRef);
      }
    );
  };

  /**
   * REPLAY / RESET FUNCTIONALITY
   * Returns room to empty wall and restores the Infinity Gauntlet to center stage
   */
  const handleReset = () => {
    if (state !== "after") return;

    setState("resetting");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          canvasRef.current?.clearParticles();
          gauntletRef.current?.reset();
          setState("before");
        },
      });

      // Smoothly dissolve the materialized posters
      tl.to(".snap-poster-frame", {
        opacity: 0,
        scale: 0.9,
        filter: "blur(8px)",
        stagger: 0.1,
        duration: 0.45,
        ease: "power2.inOut",
      });

      tl.to(".snap-aura-glow", { opacity: 0, duration: 0.3 }, "<");
    }, containerRef);
  };

  return (
    <section
      id="before-after"
      ref={containerRef}
      className="py-16 sm:py-20 lg:py-28 bg-charcoal relative border-t border-charcoal-border/50 overflow-hidden"
    >
      {/* Ambient Cosmic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-yellow/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <Container size="wide">
        {/* Typographic Header (Switches dynamically with transformation state) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 lg:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-5 h-0.5 bg-brand-yellow rounded-full inline-block" />
              <span className="text-xs font-manrope font-extrabold uppercase tracking-widest text-brand-yellow">
                {state === "after" ? "TRANSFORMATION COMPLETE" : "CINEMATIC WALL TRANSFORMATION"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-manrope font-extrabold text-white tracking-tight leading-tight uppercase">
              {state === "after" ? (
                <>
                  THAT&apos;S THE POWER OF <br />
                  <span className="text-brand-yellow">A SNAP.</span>
                </>
              ) : (
                <>
                  YOUR WALL IS <br />
                  <span className="text-brand-yellow">WAITING.</span>
                </>
              )}
            </h2>

            <p className="mt-2.5 text-xs sm:text-sm md:text-base text-brand-muted max-w-xl font-inter leading-relaxed">
              {state === "after"
                ? "From a plain, forgotten wall to a personalized gallery sanctuary. Museum-grade archival pigment prints that transform your everyday living space."
                : "Tap the Infinity Gauntlet hand in the center of the room to execute the cinematic snap and watch the empty wall transform."}
            </p>
          </div>

          {/* Sound Mute Control Pill */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={toggleMute}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-charcoal-surface border border-charcoal-border hover:border-brand-yellow/50 text-white/70 hover:text-white text-xs font-manrope font-bold transition-all shadow-sm"
              aria-label={isMuted ? "Unmute transformation sound" : "Mute transformation sound"}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-brand-muted" />
                  <span>Sound Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>Sound On</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 
          THE CINEMATIC ROOM SHOWCASE CONTAINER
          - Layer 1: Background Room Image (16:9 aspect ratio)
          - Layer 2: Empty Wall Cue
          - Layer 3: Materializing Poster Frames
          - Layer 4: Cosmic Particle & Shockwave Canvas
          - Layer 5: The Interactive Infinity Gauntlet Hand (Center Stage)
          - Layer 6: After-State Badges
        */}
        <div
          ref={sceneRef}
          className="relative w-full aspect-[16/12] md:aspect-[16/7] overflow-hidden border border-charcoal-border shadow-2xl bg-charcoal-surface select-none"
        >
          {/* LAYER 1: BASE ROOM BACKGROUND IMAGE (Warm Minimalist Living Room) */}
          <Image
            src="/images/transformations/empty-wall-living.jpg"
            alt="Living room with empty wall waiting for Happy Wall transformation"
            fill
            sizes="(max-width: 1200px) 100vw, 1400px"
            className="object-cover object-center pointer-events-none"
            priority
          />

          {/* LAYER 2: EMPTY WALL PULSE INDICATOR (Visible before the snap) */}
          {state === "before" && (
            <div
              className="absolute z-10 border-2 border-dashed border-brand-yellow/60 rounded-md sm:rounded-lg pointer-events-none animate-pulse flex flex-col items-center justify-center p-2 text-center"
              style={{
                left: `${WALL_POSTERS[1].leftPercent}%`,
                top: `${WALL_POSTERS[1].topPercent}%`,
                width: `${WALL_POSTERS[1].widthPercent}%`,
                height: `${WALL_POSTERS[1].heightPercent}%`,
              }}
            >
              <span className="px-1.5 py-0.5 rounded bg-charcoal-dark/90 text-brand-yellow font-manrope font-black text-[8px] sm:text-[10px] uppercase tracking-wider shadow">
                Blank Wall
              </span>
            </div>
          )}

          {/* LAYER 3: POSTER ARTWORK FRAMES (Materialized via GSAP) */}
          <div ref={postersGroupRef} className="absolute inset-0 pointer-events-none z-20">
            {WALL_POSTERS.map((poster) => (
              <div
                key={poster.id}
                className={cn(
                  "snap-poster-frame absolute rounded-sm sm:rounded-md overflow-hidden bg-charcoal-dark",
                  "border-2 sm:border-[3px] border-[#1C1C1C] ring-1 ring-white/10",
                  poster.elevationShadow,
                  state === "before" ? "opacity-0" : ""
                )}
                style={{
                  left: `${poster.leftPercent}%`,
                  top: `${poster.topPercent}%`,
                  width: `${poster.widthPercent}%`,
                  height: `${poster.heightPercent}%`,
                }}
              >
                {/* Poster Artwork Image */}
                <div className="relative w-full h-full bg-charcoal-surface">
                  <SafeImage
                    src={poster.image}
                    alt={`${poster.title} - ${poster.category}`}
                    fill
                    sizes="(max-width: 640px) 120px, 200px"
                    className="object-cover"
                  />
                  {/* Subtle gallery glass reflection glare */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />
                </div>
              </div>
            ))}

            {/* Subtle Golden Wall Ambient Aura when transformation completes */}
            {state === "after" && (
              <div
                className="snap-aura-glow absolute pointer-events-none -z-10 bg-brand-yellow/15 blur-2xl rounded-full"
                style={{
                  left: "32%",
                  top: "12%",
                  width: "50%",
                  height: "32%",
                }}
              />
            )}
          </div>

          {/* LAYER 4: HTML5 CANVAS COSMIC DUST & SHOCKWAVE SYSTEM */}
          <SnapCanvas ref={canvasRef} />

          {/* GOLDEN ENERGY FLASH OVERLAY */}
          <div
            ref={flashOverlayRef}
            className="absolute inset-0 bg-gradient-to-r from-brand-yellow/40 via-white/70 to-brand-yellow/40 pointer-events-none opacity-0 z-25"
          />

          {/* LAYER 5: THE INTERACTIVE REAL INFINITY GAUNTLET HAND (CENTER STAGE) */}
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 pointer-events-none">
            <InfinityGauntlet
              ref={gauntletRef}
              isIdle={state === "before"}
              isSnapping={state === "snapping" || state === "materializing"}
              hasSnapped={state === "after"}
              onClick={handleSnap}
            />
          </div>
        </div>

        {/* 
          BOTTOM ACTION BAR
          - Before state: Feature highlights (300 GSM Archival, 2mm gaps, Chennai delivery)
          - After state: "EXPLORE POSTER COLLECTIONS" primary CTA + "REPLAY THE MAGIC ↻"
        */}
        <div className="mt-2 sm:mt-4 p-4 sm:p-6 rounded-2xl bg-charcoal-card border border-charcoal-border flex flex-col sm:flex-row items-center justify-between gap-4">
          {state === "after" ? (
            <>
              <div className="flex items-center gap-3">
                <p className="text-xs sm:text-sm text-white font-inter">
                  <strong className="text-brand-yellow font-manrope font-bold">Love this look?</strong>{" "}
                  Browse our complete Anime, Gaming, and Split Poster collections or create a custom set.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  href="#collections"
                  variant="primary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto shadow-glow-yellow"
                >
                  Explore Collections
                </Button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-charcoal-surface hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-manrope font-bold transition-all shrink-0"
                  aria-label="Replay transformation animation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Replay the Magic</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
                <div className="flex items-center gap-2 text-xs text-white/80 font-inter">
                  <span className="w-2 h-2 rounded-full bg-brand-yellow shrink-0" />
                  <span>Museum-Grade 300 GSM Matte</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80 font-inter">
                  <span className="w-2 h-2 rounded-full bg-brand-yellow shrink-0" />
                  <span>Fade-Resistant Pigment Inks</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80 font-inter">
                  <span className="w-2 h-2 rounded-full bg-brand-yellow shrink-0" />
                  <span>Solid Wooden Gallery Moulding</span>
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
};
