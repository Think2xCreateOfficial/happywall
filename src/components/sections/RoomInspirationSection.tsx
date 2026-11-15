"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Bed, Sofa, CheckCircle2, ChevronRight, Eye } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Container } from "@/components/ui/Container";
import { ROOM_ENVIRONMENTS, RoomHotspot } from "@/data/rooms";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getDriveImageUrl } from "@/lib/drive";
import { cn } from "@/lib/utils";

export const RoomInspirationSection: React.FC = () => {
  const [selectedEnvId, setSelectedEnvId] = useState<string>("bedroom");
  const [activeHotspotId, setActiveHotspotId] = useState<string>("bed-split-center");

  const activeEnv =
    ROOM_ENVIRONMENTS.find((env) => env.id === selectedEnvId) || ROOM_ENVIRONMENTS[0];

  // If activeHotspotId doesn't belong to activeEnv, fallback to first hotspot
  const activeHotspot: RoomHotspot =
    activeEnv.hotspots.find((h) => h.id === activeHotspotId) || activeEnv.hotspots[0];

  const handleHotspotClick = (hotspot: RoomHotspot) => {
    setActiveHotspotId(hotspot.id);
  };

  const handleEnvChange = (envId: string) => {
    setSelectedEnvId(envId);
    const targetEnv = ROOM_ENVIRONMENTS.find((e) => e.id === envId) || ROOM_ENVIRONMENTS[0];
    // Default to the central or first hotspot of the new room
    setActiveHotspotId(targetEnv.hotspots[1]?.id || targetEnv.hotspots[0]?.id);
  };

  return (
    <section
      id="room-inspiration"
      className="py-16 sm:py-20 lg:py-28 bg-charcoal relative overflow-hidden border-t border-charcoal-border/50"
    >
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-yellow/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <Container size="wide">
        {/* Section Heading with Room Switcher Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 lg:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-5 h-0.5 bg-brand-yellow rounded-full inline-block" />
              <span className="text-xs font-manrope font-extrabold uppercase tracking-widest text-brand-yellow">
                ROOM INSPIRATION &amp; STYLING
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-manrope font-extrabold text-white tracking-tight leading-tight">
              IMAGINE IT ON <br />
              <span className="text-brand-yellow">YOUR WALL.</span>
            </h2>

            <p className="mt-2.5 text-xs sm:text-sm md:text-base text-brand-muted max-w-xl font-inter leading-relaxed">
              Explore authentic room photographs styled with Happy Walls posters. Tap the numbered pins or frame buttons below to view sizing, details, and order directly on WhatsApp.
            </p>
          </div>

          {/* Clean Room Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
            {ROOM_ENVIRONMENTS.map((env) => {
              const isSelected = env.id === selectedEnvId;
              const Icon = env.id === "bedroom" ? Bed : Sofa;

              return (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => handleEnvChange(env.id)}
                  className={cn(
                    "px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-manrope font-extrabold uppercase tracking-wider transition-all duration-200 shrink-0 select-none flex items-center gap-2",
                    isSelected
                      ? "bg-brand-yellow text-charcoal-dark shadow-glow-yellow font-black ring-1 ring-brand-yellow"
                      : "bg-charcoal-card text-white/70 hover:text-white border border-charcoal-border hover:border-brand-yellow/40"
                  )}
                  aria-pressed={isSelected}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{env.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 
          FULL ROOM SHOWCASE CONTAINER
          - Natural 3:2 aspect ratio of the authentic room photos (6144x4096 & 6652x4435)
          - Numbered pulsing hotspot markers with generous 48px+ touch hit areas for mobile
        */}
        <div className="relative w-full overflow-hidden border border-charcoal-border shadow-2xl bg-charcoal-surface">
          <div className="relative w-full aspect-[3/2] overflow-hidden select-none">
            {/* Preloaded, stacked room images with zero-latency smooth crossfade */}
            {ROOM_ENVIRONMENTS.map((env) => {
              const isEnvActive = env.id === selectedEnvId;
              return (
                <div
                  key={env.id}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-300 ease-in-out",
                    isEnvActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  )}
                  aria-hidden={!isEnvActive}
                >
                  <Image
                    src={env.image}
                    alt={env.headline}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-cover object-center pointer-events-none"
                    priority
                  />
                </div>
              );
            })}

            {/* Interactive Numbered Hotspots Over Wall Frames */}
            {activeEnv.hotspots.map((hotspot, idx) => {
              const isActive = activeHotspot.id === hotspot.id;
              const frameNumber = idx + 1;

              return (
                <div
                  key={hotspot.id}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${hotspot.xPercent}%`,
                    top: `${hotspot.yPercent}%`,
                  }}
                >
                  {/* 
                    Hotspot Pulse Trigger Button
                    - Includes an invisible touch hit-area (`before:-inset-3`) ensuring 48px+ touch target on mobile
                    - Never misses or fails to register taps
                    - Clearly numbered (1, 2, 3...)
                  */}
                  <button
                    type="button"
                    onClick={() => handleHotspotClick(hotspot)}
                    className={cn(
                      "relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-manrope font-black text-[11px] sm:text-xs shadow-glow-yellow transition-all duration-300 focus:outline-none",
                      "before:absolute before:-inset-3 sm:before:-inset-2 before:content-[''] before:z-10",
                      isActive
                        ? "bg-white text-charcoal-dark scale-125 ring-4 ring-brand-yellow z-30"
                        : "bg-brand-yellow text-charcoal-dark hover:scale-115 z-20"
                    )}
                    aria-label={`Select frame ${frameNumber}: ${hotspot.name}`}
                    aria-pressed={isActive}
                  >
                    <span>{frameNumber}</span>

                    {/* Radiating Pulse Ping */}
                    <span className="absolute -inset-1 rounded-full border border-brand-yellow animate-ping pointer-events-none opacity-60" />
                  </button>

                  {/* DESKTOP HOVER/FOCUS POPOVER (Positioned safely above/below frame) */}
                  {isActive && (
                    <div
                      className={cn(
                        "hidden lg:block absolute z-30 w-72 p-3.5 rounded-2xl bg-charcoal-card/95 border border-brand-yellow/80 backdrop-blur-md shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200 pointer-events-auto",
                        hotspot.yPercent > 50 ? "bottom-12" : "top-12",
                        hotspot.xPercent > 65
                          ? "right-0"
                          : hotspot.xPercent < 35
                            ? "left-0"
                            : "left-1/2 -translate-x-1/2"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[9px] font-manrope font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
                          Frame {frameNumber} · {hotspot.category}
                        </span>
                      </div>

                      <div className="flex items-start gap-2.5 mb-2">
                        {hotspot.relatedImage && (
                          <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-charcoal-surface">
                            <Image
                              src={getDriveImageUrl(hotspot.relatedImage)}
                              alt={hotspot.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-manrope font-extrabold text-xs text-white leading-snug">
                            {hotspot.name}
                          </h4>
                          <p className="text-[10px] font-mono text-brand-yellow mt-0.5">
                            {hotspot.size}
                          </p>
                          <p className="text-xs font-manrope font-bold text-white mt-0.5">
                            {hotspot.priceText}
                          </p>
                        </div>
                      </div>

                      <p className="text-[11px] text-brand-muted leading-relaxed mb-2.5 font-inter line-clamp-2">
                        {hotspot.description}
                      </p>

                      <a
                        href={buildWhatsAppUrl(hotspot.whatsappMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-1.5 px-3 rounded-lg bg-brand-yellow hover:bg-brand-yellowHover text-charcoal-dark font-manrope font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>{hotspot.actionText}</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
