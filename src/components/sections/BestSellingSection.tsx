"use client";

import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { ProductCarousel } from "@/components/products/ProductCarousel";
import { ProductDetailsModal } from "@/components/products/ProductDetailsModal";
import { Product, SizeOption } from "@/types/product";
import { cn } from "@/lib/utils";
import { getPosters } from "@/services/poster.service";
import { PosterWithCategory } from "@/types/database.types";
import {
  INDIVIDUAL_POSTER_SIZES,
  SPLIT_POSTER_SIZES,
} from "@/data/products/product-catalog";

const BEST_SELLING_TABS = [
  { id: "all", label: "All Favorites" },
  { id: "anime", label: "Anime" },
  { id: "games", label: "Games" },
  { id: "split", label: "Split Poster" },
];

function mapPosterToProduct(poster: PosterWithCategory): Product {
  const catName = poster.category?.name || "Anime";
  const catSlug = poster.category?.slug?.toLowerCase() || "anime";
  const isSplit = catSlug.includes("split");

  const availableSizes: SizeOption[] =
    poster.variants && poster.variants.length > 0
      ? poster.variants.map((v) => ({
          id: v.size_code,
          name: v.variant_name,
          dimensions: v.dimensions,
          price: Number(v.price),
          inclusions: v.inclusions || undefined,
          frameAvailable:
            v.size_code === "A4" || v.variant_name.toLowerCase().includes("a4")
              ? Boolean((v as unknown as { frame_available?: boolean }).frame_available ?? true)
              : false,
          framePrice:
            v.size_code === "A4" || v.variant_name.toLowerCase().includes("a4")
              ? Number((v as unknown as { frame_price?: number }).frame_price || 210)
              : 0,
        }))
      : isSplit
      ? SPLIT_POSTER_SIZES
      : INDIVIDUAL_POSTER_SIZES;

  const minPrice =
    availableSizes.length > 0
      ? Math.min(...availableSizes.map((s) => s.price))
      : Number(poster.price);

  return {
    id: poster.id,
    slug: poster.slug,
    name: poster.title,
    category: catName,
    description: poster.description || "High-resolution print on premium 270 GSM glossy photo sheet.",
    image: poster.image_path,
    basePrice: minPrice,
    availableSizes,
    inclusions: isSplit ? "3 × A4 size posters" : "1 × Poster Print",
    tag: isSplit ? "Signature Set" : "Best Seller",
    isFeatured: true,
    isBestSeller: true,
  };
}

export const BestSellingSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Retrieve dynamically managed posters from Supabase Storage and Database
  useEffect(() => {
    let isMounted = true;
    async function loadDynamicPosters() {
      setIsLoading(true);
      try {
        // Query best-selling active posters directly from Supabase
        let res = await getPosters({ includeInactive: false, isBestSelling: true });
        
        // If no posters are explicitly flagged as best sellers, query active posters
        if (!res.data || res.data.length === 0) {
          res = await getPosters({ includeInactive: false });
        }

        if (isMounted) {
          if (res.data && res.data.length > 0) {
            const dynamicProducts = res.data.map(mapPosterToProduct);
            setProducts(dynamicProducts);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.warn("Error loading dynamic best sellers from Supabase:", err);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadDynamicPosters();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts =
    activeTab === "all"
      ? products
      : products.filter((p) => {
          const cat = p.category.toLowerCase();
          if (activeTab === "split") return cat.includes("split");
          return cat.includes(activeTab.toLowerCase());
        });

  return (
    <section
      id="best-sellers"
      className="py-20 lg:py-28 bg-charcoal-dark border-t border-charcoal-border/50 relative overflow-hidden"
    >
      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-0.5 bg-brand-yellow rounded-full inline-block" />
              <span className="text-xs font-manrope font-extrabold uppercase tracking-widest text-brand-yellow">
                BEST SELLING
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-manrope font-extrabold text-white tracking-tight leading-none uppercase">
              MOST LOVED <span className="text-brand-yellow">POSTERS</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-brand-muted max-w-xl font-inter leading-relaxed">
              Our highest-rated customer favorites across Anime, Gaming, and Split Posters. Printed in authentic 1,414 × 2,000 proportion on premium 270 GSM glossy photo sheets.
            </p>
          </div>

          <a
            href="#collections"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-manrope font-extrabold uppercase tracking-wider text-white hover:text-brand-yellow transition-colors group shrink-0"
          >
            <span>View All Collections</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {BEST_SELLING_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            const count =
              tab.id === "all"
                ? products.length
                : products.filter((p) => {
                    const cat = p.category.toLowerCase();
                    if (tab.id === "split") return cat.includes("split");
                    return cat.includes(tab.id.toLowerCase());
                  }).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-manrope font-extrabold uppercase tracking-wider transition-all duration-200 shrink-0 select-none flex items-center gap-1.5",
                  isSelected
                    ? "bg-brand-yellow text-charcoal-dark shadow-glow-yellow font-black"
                    : "bg-charcoal-surface text-white/70 hover:text-white border border-charcoal-border hover:border-brand-yellow/40"
                )}
                aria-pressed={isSelected}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                    isSelected
                      ? "bg-charcoal-dark/20 text-charcoal-dark font-bold"
                      : "bg-white/10 text-white/60"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-brand-yellow border-t-transparent animate-spin" />
            <p className="text-xs text-brand-muted font-mono tracking-wider uppercase">Loading Best Sellers...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Clean Empty State */
          <div className="py-16 text-center rounded-2xl bg-charcoal-card border border-charcoal-border p-8">
            <p className="text-sm sm:text-base font-manrope font-bold text-white mb-1">
              No Best Selling Posters in this category yet.
            </p>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              Browse our complete catalog below to explore all available collections.
            </p>
          </div>
        ) : (
          /* Carousel with strict 1,414 x 2,000 poster cards */
          <ProductCarousel
            products={filteredProducts}
            onOpenDetails={(product: Product) => setSelectedProduct(product)}
          />
        )}
      </Container>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};
