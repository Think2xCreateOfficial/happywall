"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { ProductCarousel } from "@/components/products/ProductCarousel";
import { ProductDetailsModal } from "@/components/products/ProductDetailsModal";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

const BEST_SELLING_TABS = [
  { id: "all", label: "All Favorites" },
  { id: "anime", label: "Anime" },
  { id: "games", label: "Games" },
  { id: "split", label: "Split Poster" },
];

export const BestSellingSection: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredProducts = activeTab === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category.toLowerCase().includes(activeTab.toLowerCase()));

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
              Our highest-rated customer favorites across Anime, Gaming, and Split Posters. Printed in authentic 1,414 × 2,000 proportion on 300 GSM archival matte paper.
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
            const count = tab.id === "all"
              ? PRODUCTS.length
              : PRODUCTS.filter((p) => p.category.toLowerCase().includes(tab.id.toLowerCase())).length;

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
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                  isSelected ? "bg-charcoal-dark/20 text-charcoal-dark" : "bg-white/10 text-white/60"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Carousel with strict 1,414 x 2,000 poster cards */}
        <ProductCarousel
          products={filteredProducts}
          onOpenDetails={(product: Product) => setSelectedProduct(product)}
        />
      </Container>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};
