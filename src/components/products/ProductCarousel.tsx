"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types/product.types";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, onOpenDetails }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Check scroll boundary status and compute exact active card index using DOM geometry
  const updateScrollBounds = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || products.length === 0) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 15;
    setCanScrollRight(!isAtEnd);

    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;

    if (isAtEnd) {
      setActiveIndex(children.length - 1);
      return;
    }

    // Determine which card is physically closest to the viewport start
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, idx) => {
      const cardOffset = child.offsetLeft - el.offsetLeft;
      const distance = Math.abs(cardOffset - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, [products.length]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollBounds();
    el.addEventListener("scroll", updateScrollBounds, { passive: true });
    window.addEventListener("resize", updateScrollBounds, { passive: true });

    return () => {
      el.removeEventListener("scroll", updateScrollBounds);
      window.removeEventListener("resize", updateScrollBounds);
    };
  }, [updateScrollBounds, products]);

  // Smooth slide-to-slide navigation using exact child element geometry
  const scrollToSlide = useCallback((index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const children = Array.from(el.children) as HTMLElement[];
    if (!children[index]) return;

    const targetCard = children[index];
    const targetLeft = targetCard.offsetLeft - el.offsetLeft;

    el.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
    setActiveIndex(index);
  }, []);

  // Directional step scroll linked directly to card indices
  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;

    const targetIndex =
      direction === "left"
        ? Math.max(0, activeIndex - 1)
        : Math.min(children.length - 1, activeIndex + 1);

    scrollToSlide(targetIndex);
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-brand-muted">
        No products available in this category.
      </div>
    );
  }

  return (
    <div className="relative group w-full" role="region" aria-label="Best selling products carousel">
      {/* Top Desktop Navigation Arrows */}
      <div className="hidden sm:flex items-center gap-2 absolute -top-14 right-0 z-20">
        <button
          type="button"
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          className={cn(
            "w-10 h-10 rounded-full bg-charcoal-surface border border-charcoal-border transition-all flex items-center justify-center text-white/90 shadow-md",
            canScrollLeft
              ? "hover:border-brand-yellow hover:text-brand-yellow hover:bg-charcoal-card active:scale-95 cursor-pointer"
              : "opacity-30 cursor-not-allowed border-white/5"
          )}
          aria-label="Previous products"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          className={cn(
            "w-10 h-10 rounded-full bg-charcoal-surface border border-charcoal-border transition-all flex items-center justify-center text-white/90 shadow-md",
            canScrollRight
              ? "hover:border-brand-yellow hover:text-brand-yellow hover:bg-charcoal-card active:scale-95 cursor-pointer"
              : "opacity-30 cursor-not-allowed border-white/5"
          )}
          aria-label="Next products"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 
        Horizontal Slider Track:
        - Snap scrolling (snap-x snap-mandatory)
        - Inertia touch scroll on mobile with 74vw peek width
        - Responsive desktop 4-card visible width
      */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-3.5 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory no-scrollbar overscroll-x-contain select-none px-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[74vw] sm:w-[260px] md:w-[280px] lg:w-[calc(25%-18px)] shrink-0 snap-start flex flex-col"
          >
            <ProductCard product={product} onOpenDetails={onOpenDetails} />
          </div>
        ))}
      </div>

      {/* Mobile / Tablet Bottom Navigation Controls & Progress Dots */}
      <div className="flex items-center justify-between sm:justify-center gap-3 pt-2">
        {/* Mobile Left Arrow */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          className={cn(
            "sm:hidden w-11 h-11 rounded-full bg-charcoal-surface border border-charcoal-border flex items-center justify-center text-white/90 transition-all shadow shrink-0",
            canScrollLeft ? "active:scale-95 text-brand-yellow border-brand-yellow/50" : "opacity-30"
          )}
          aria-label="Previous product"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dynamic Pagination Indicator Dots */}
        {products.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
            {products.map((p, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    isActive
                      ? "w-6 bg-brand-yellow shadow-glow-yellow"
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  )}
                  aria-label={`Go to product ${idx + 1}: ${p.name}`}
                  aria-current={isActive}
                />
              );
            })}
          </div>
        )}

        {/* Mobile Right Arrow */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          className={cn(
            "sm:hidden w-11 h-11 rounded-full bg-charcoal-surface border border-charcoal-border flex items-center justify-center text-white/90 transition-all shadow shrink-0",
            canScrollRight ? "active:scale-95 text-brand-yellow border-brand-yellow/50" : "opacity-30"
          )}
          aria-label="Next product"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
