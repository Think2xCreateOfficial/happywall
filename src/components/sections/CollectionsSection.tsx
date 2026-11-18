"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Check, RefreshCw } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { PosterCollectionItem } from "@/types/collection";
import { formatINR, cn } from "@/lib/utils";
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from "@/services/storage.service";
import { SafeImage } from "@/components/ui/SafeImage";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useCart } from "@/context/CartContext";
import { getPosters } from "@/services/poster.service";
import { getCategories } from "@/services/category.service";
import { CategoryRow } from "@/types/database.types";

export const CollectionsSection: React.FC = () => {
  const [posters, setPosters] = useState<PosterCollectionItem[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, CategoryRow>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentlyAdded, setRecentlyAdded] = useState<Record<string, boolean>>({});
  const { addItem } = useCart();

  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [postRes, catRes] = await Promise.all([
        getPosters({ includeInactive: false }),
        getCategories(false),
      ]);

      if (catRes.error && postRes.error) {
        setError("Unable to load the catalog right now. Please check your connection and try again.");
      }

      // 1. Process dynamic categories from Supabase
      if (catRes.data) {
        setCategories(catRes.data);
        const map: Record<string, CategoryRow> = {};
        catRes.data.forEach((c) => {
          const slug = (c.slug || "").toLowerCase();
          map[slug] = c;
          map[c.id] = c;
        });
        setCategoriesMap(map);
      }

      // 2. Process dynamic posters from Supabase
      if (postRes.data) {
        const mappedPosters: PosterCollectionItem[] = postRes.data.map((p) => {
          const rawSlug = p.category?.slug?.toLowerCase() || "";
          const isSplit = rawSlug.includes("split");
          const minPrice =
            p.variants && p.variants.length > 0
              ? Math.min(...p.variants.map((v) => Number(v.price) || 0))
              : Number(p.price);

          return {
            id: p.id,
            slug: p.slug,
            title: p.title,
            category: (p.category?.name || (isSplit ? "Split Poster" : "Art Poster")) as any,
            categorySlug: (rawSlug || "all") as any,
            image: p.image_path,
            badge: p.is_best_selling ? "Best Seller" : isSplit ? "Signature" : undefined,
            sizeText: isSplit ? "3 × A4 Set · ₹109" : `From ₹${minPrice}`,
            price: minPrice,
            inclusions: isSplit ? "3 × A4 size posters" : "1 × Poster Print",
            whatsappMessage: `Hello Happy Walls! I want to order the *${p.title}* poster.`,
          };
        });
        setPosters(mappedPosters);
      }
    } catch (err) {
      console.error("Error loading dynamic catalog from Supabase:", err);
      setError("An unexpected error occurred while loading the catalog.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  // Construct dynamic category tabs from database records
  const categoryTabs = [
    { id: "all", label: "All Products", slug: "all", image_path: null },
    ...categories.map((c) => ({
      id: c.slug,
      label: c.name,
      slug: c.slug,
      image_path: c.image_path,
    })),
  ];

  const filteredPosters =
    activeCategory === "all"
      ? posters
      : posters.filter(
          (item) =>
            item.categorySlug === activeCategory ||
            item.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  const activeCategoryRecord = activeCategory !== "all" ? categoriesMap[activeCategory] : null;

  const handleAddToCart = (poster: PosterCollectionItem) => {
    const sizeChoice =
      poster.categorySlug === "split-poster" ? "Split Poster Set" : "A4 Size Poster";

    addItem(poster, sizeChoice, 1);
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
              Premium 270 GSM glossy photo sheets. Curated Anime icons, Gaming battlestation artwork, and 3-piece continuous panoramic split triptychs.
            </p>
          </div>

          {/* Dynamic Category Filter Pills */}
          {!isLoading && categoryTabs.length > 1 && (
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categoryTabs.map((tab) => {
                const isActive = activeCategory === tab.id;
                const count =
                  tab.id === "all"
                    ? posters.length
                    : posters.filter(
                        (p) =>
                          p.categorySlug === tab.id ||
                          p.category?.toLowerCase() === tab.label.toLowerCase()
                      ).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-manrope font-extrabold transition-all duration-200 shrink-0 flex items-center gap-2 border",
                      isActive
                        ? "bg-brand-yellow text-charcoal-dark border-brand-yellow shadow-sm shadow-brand-yellow/30 font-black"
                        : "bg-charcoal-surface text-white/70 border-charcoal-border hover:border-brand-yellow/40 hover:text-white"
                    )}
                    aria-pressed={isActive}
                  >
                    {/* Category Thumbnail Image from Supabase Storage */}
                    {tab.id !== "all" && tab.image_path && (
                      <span className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 border border-current/20">
                        <Image
                          src={resolveImageUrl(tab.image_path)}
                          alt={tab.label}
                          fill
                          sizes="16px"
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                          }}
                        />
                      </span>
                    )}
                    <span>{tab.label}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
                        isActive
                          ? "bg-charcoal-dark/20 text-charcoal-dark font-bold"
                          : "bg-white/10 text-brand-muted"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div
                key={n}
                className="flex flex-col bg-charcoal-card rounded-xl sm:rounded-2xl overflow-hidden border border-charcoal-border animate-pulse"
              >
                <div className="w-full aspect-[1414/2000] bg-charcoal-surface" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-1/3 bg-white/10 rounded" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                  <div className="h-3 w-1/2 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State with Retry */
          <div className="py-16 text-center rounded-2xl bg-charcoal-card border border-rose-500/20 p-8">
            <p className="text-sm sm:text-base font-manrope font-bold text-white mb-2">
              {error}
            </p>
            <button
              onClick={loadCatalog}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-yellow text-charcoal-dark font-manrope font-bold text-xs hover:bg-brand-yellowHover transition-colors mt-3"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : filteredPosters.length === 0 ? (
          /* Clean Empty State */
          <div className="py-16 text-center rounded-2xl bg-charcoal-card border border-charcoal-border p-8">
            <p className="text-base sm:text-lg font-manrope font-extrabold text-white mb-1">
              No posters found in this collection.
            </p>
            <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto">
              Please check back soon or select another category above.
            </p>
            {activeCategory !== "all" && (
              <button
                onClick={() => setActiveCategory("all")}
                className="mt-4 px-4 py-2 rounded-xl bg-charcoal-surface text-brand-yellow border border-brand-yellow/30 text-xs font-manrope font-bold hover:bg-brand-yellow hover:text-charcoal-dark transition-all"
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          /* 
            Responsive Grid: 
            - Desktop (lg): 5 columns
            - Tablet (sm/md): 3 columns
            - Mobile (<sm): 2 columns with tight gap-3
            - Aspect Ratio: Exactly 1,414 x 2,000 (aspect-[1414/2000]) for all screen sizes
          */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {filteredPosters.map((poster, index) => {
              const whatsappUrl = buildWhatsAppUrl(poster.whatsappMessage);
              const isAdded = recentlyAdded[poster.id];

              return (
                <div
                  key={poster.id}
                  className="group flex flex-col bg-charcoal-card rounded-xl sm:rounded-2xl overflow-hidden border border-charcoal-border hover:border-brand-yellow/70 transition-all duration-300 hover:shadow-xl hover:shadow-black/60"
                >
                  {/* Poster Image Container (1,414 x 2,000 Aspect Ratio) */}
                  <div className="relative w-full aspect-[1414/2000] bg-charcoal-surface overflow-hidden">
                    <SafeImage
                      src={poster.image}
                      alt={`${poster.title} - ${poster.category} Wall Poster`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      priority={index < 2}
                    />
                  </div>

                  {/* Content Details Block */}
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

                      {/* Size & Inclusions Note */}
                      <p className="text-[10px] sm:text-[11px] text-brand-muted/70 truncate mt-0.5 font-inter">
                        {poster.inclusions ? `Inclusions: ${poster.inclusions}` : poster.sizeText}
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
        )}
      </Container>
    </section>
  );
};
