"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { CollectionCategorySlug, PosterCollectionItem } from "@/types/collection";
import { COLLECTION_POSTERS, COLLECTIONS } from "@/data/collections";
import { formatINR, cn } from "@/lib/utils";
import { getDriveImageUrl } from "@/lib/drive";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useCart } from "@/context/CartContext";

const CATEGORY_TABS: { id: CollectionCategorySlug; label: string }[] = [
  { id: "all", label: "All Posters" },
  { id: "anime", label: "Anime" },
  { id: "games", label: "Games" },
  { id: "split-poster", label: "Split Poster" },
];

export const CollectionsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CollectionCategorySlug>("all");
  const [recentlyAdded, setRecentlyAdded] = useState<Record<string, boolean>>({});
  const { addItem } = useCart();

  const filteredPosters =
    activeCategory === "all"
      ? COLLECTION_POSTERS
      : COLLECTION_POSTERS.filter((item) => item.categorySlug === activeCategory);

  const handleAddToCart = (poster: PosterCollectionItem) => {
    addItem(poster, "A3 Standard", 1);
    setRecentlyAdded((prev) => ({ ...prev, [poster.id]: true }));
    setTimeout(() => {
      setRecentlyAdded((prev) => ({ ...prev, [poster.id]: false }));
    }, 1600);
  };

  return (
    <section
      id="collections"
      className="py-16 sm:py-20 lg:py-28 bg-charcoal-dark relative border-t border-charcoal-border/50"
    >
      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-5 h-0.5 bg-brand-yellow rounded-full inline-block" />
              <span className="text-xs font-manrope font-extrabold uppercase tracking-widest text-brand-yellow">
                WALL POSTER CATALOG
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-manrope font-extrabold text-white tracking-tight leading-tight uppercase">
              EXPLORE OUR <br />
              <span className="text-brand-yellow">COLLECTIONS.</span>
            </h2>

            <p className="mt-2 text-xs sm:text-sm md:text-base text-brand-muted max-w-xl font-inter leading-relaxed">
              Archival 300 GSM matte pigment prints. Curated Anime icons, Gaming battlestation artwork, and 3-piece continuous panoramic split triptychs.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              const count =
                tab.id === "all"
                  ? COLLECTION_POSTERS.length
                  : COLLECTION_POSTERS.filter((p) => p.categorySlug === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-manrope font-extrabold transition-all duration-200 shrink-0 flex items-center gap-1.5 border",
                    isActive
                      ? "bg-brand-yellow text-charcoal-dark border-brand-yellow shadow-sm shadow-brand-yellow/30"
                      : "bg-charcoal-surface text-white/70 border-charcoal-border hover:border-brand-yellow/40 hover:text-white"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full",
                      isActive
                        ? "bg-charcoal-dark/20 text-charcoal-dark"
                        : "bg-white/10 text-brand-muted"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 
          Responsive Grid: 
          - Desktop (lg): 5 columns
          - Tablet (sm/md): 3 columns
          - Mobile (<sm): 2 columns with tight gap-3
          - Aspect Ratio: Exactly 1,414 x 2,000 (aspect-[1414/2000]) for all screen sizes
          - Completely clean artwork: NO content or text overlaying the poster!
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {filteredPosters.map((poster) => {
            const whatsappUrl = buildWhatsAppUrl(poster.whatsappMessage);
            const isAdded = recentlyAdded[poster.id];

            return (
              <div
                key={poster.id}
                className="group flex flex-col bg-charcoal-card rounded-xl sm:rounded-2xl overflow-hidden border border-charcoal-border hover:border-brand-yellow/70 transition-all duration-300 hover:shadow-xl hover:shadow-black/60"
              >
                {/* 
                  Poster Image Container:
                  Aspect Ratio 1,414 x 2,000 (0.707 ratio - standard ISO poster proportion)
                  Unobstructed artwork without dark gradients or text overlay
                */}
                <div className="relative w-full aspect-[1414/2000] bg-charcoal-surface overflow-hidden">
                  <Image
                    src={getDriveImageUrl(poster.image)}
                    alt={`${poster.title} - ${poster.category} Wall Poster`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    priority={poster.id === "drive-anime-01"}
                  />
                </div>

                {/* Content Details Block (Positioned BELOW Image) */}
                <div className="p-2.5 sm:p-3.5 flex flex-col justify-between flex-1 gap-2">
                  <div className="min-w-0">
                    {/* Category Label */}
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[9px] sm:text-[10px] font-manrope font-extrabold text-brand-yellow uppercase tracking-wider truncate">
                        {poster.category}
                      </span>
                      {poster.badge && (
                        <span className="hidden sm:inline-block text-[9px] font-manrope font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-white/60 border border-white/5 shrink-0">
                          {poster.badge}
                        </span>
                      )}
                    </div>

                    {/* Poster Title */}
                    <h3 className="font-manrope font-extrabold text-xs sm:text-sm text-white group-hover:text-brand-yellow transition-colors leading-tight line-clamp-1">
                      {poster.title}
                    </h3>

                    {/* Size & Paper Note */}
                    <p className="text-[10px] sm:text-[11px] text-brand-muted/70 truncate mt-0.5 font-inter">
                      {poster.sizeText}
                    </p>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="pt-2 border-t border-charcoal-border/70 flex items-center justify-between gap-1.5">
                    <div>
                      <span className="text-xs sm:text-sm font-manrope font-black text-brand-yellow tracking-tight">
                        {formatINR(poster.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      {/* Functional Add to Cart Button */}
                      <button
                        type="button"
                        onClick={() => handleAddToCart(poster)}
                        className={cn(
                          "inline-flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-manrope font-extrabold transition-all border",
                          isAdded
                            ? "bg-green-500/20 text-green-400 border-green-500/40"
                            : "bg-brand-yellow text-charcoal-dark border-brand-yellow hover:brightness-110 active:scale-95 shadow-sm"
                        )}
                        aria-label={`Add ${poster.title} to cart`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span className="hidden sm:inline">Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </>
                        )}
                      </button>

                      {/* Direct WhatsApp Order Link */}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 sm:p-1.5 rounded-lg bg-charcoal-surface hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all shrink-0"
                        aria-label={`Order ${poster.title} directly on WhatsApp`}
                        title="Order directly on WhatsApp"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
