"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductCarouselProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, onOpenDetails }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 320;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      {/* Scroll Navigation Arrows (Visible on Desktop / Tablet) */}
      <div className="hidden sm:flex items-center gap-2 absolute -top-14 right-0 z-10">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="p-2 rounded-full bg-charcoal-surface border border-charcoal-border hover:border-brand-yellow hover:text-brand-yellow text-white/80 transition-all shadow-md active:scale-95"
          aria-label="Scroll left in best sellers"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="p-2 rounded-full bg-charcoal-surface border border-charcoal-border hover:border-brand-yellow hover:text-brand-yellow text-white/80 transition-all shadow-md active:scale-95"
          aria-label="Scroll right in best sellers"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Responsive Grid / Horizontal Scroll for Best Sellers */}
      <div
        ref={scrollContainerRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-4 no-scrollbar"
      >
        {products.map((product) => (
          <div key={product.id} className="min-w-[150px] sm:min-w-0">
            <ProductCard product={product} onOpenDetails={onOpenDetails} />
          </div>
        ))}
      </div>
    </div>
  );
};

