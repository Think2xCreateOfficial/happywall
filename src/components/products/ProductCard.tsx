"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, Plus, Check } from "lucide-react";
import { Product } from "@/types/product";
import { formatINR, cn } from "@/lib/utils";
import { getDriveImageUrl } from "@/lib/drive";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const [addedRecently, setAddedRecently] = useState(false);
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, "A3", 1);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1500);
  };

  // Original regular price calculation (e.g. ₹ 799 vs ₹ 499)
  const originalPrice = product.basePrice + 300;

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative flex flex-col bg-charcoal-card rounded-2xl overflow-hidden border border-charcoal-border hover:border-brand-yellow/70 transition-all duration-300 hover:shadow-2xl hover:shadow-black/80 cursor-pointer select-none"
    >
      {/* 
        Artwork Container:
        Strict Aspect Ratio 1,414 x 2,000 (aspect-[1414/2000])
        Maintains identical proportion and visual weight across mobile, tablet, and desktop
      */}
      <div className="relative aspect-[1414/2000] w-full bg-charcoal-surface overflow-hidden">
        <Image
          src={getDriveImageUrl(product.image)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 300px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Tag / Discount Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-charcoal-dark/90 text-brand-yellow border border-brand-yellow/30 text-[9px] sm:text-[10px] font-manrope font-extrabold uppercase tracking-wider shadow">
            Save ₹300
          </span>
          {product.tag && (
            <span className="px-2 py-0.5 rounded-full bg-brand-yellow text-charcoal-dark text-[9px] sm:text-[10px] font-manrope font-black uppercase tracking-wider shadow">
              {product.tag}
            </span>
          )}
        </div>

        {/* Hover Quick View Pill */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 pointer-events-none p-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal-dark/90 border border-brand-yellow/60 text-xs font-manrope font-bold text-brand-yellow shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Card Content & Details (Cleanly Below Image) */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          <span className="text-[10px] font-manrope font-extrabold text-brand-yellow uppercase tracking-widest block mb-1">
            {product.category}
          </span>
          <h3 className="font-manrope font-extrabold text-sm sm:text-base text-white group-hover:text-brand-yellow transition-colors leading-snug tracking-tight line-clamp-1">
            {product.name}
          </h3>
        </div>

        {/* Pricing & Add to Selection Action */}
        <div className="mt-3 pt-2.5 border-t border-charcoal-border/70 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-manrope font-black text-brand-yellow tracking-tight">
                {formatINR(product.basePrice)}
              </span>
              <span className="text-[11px] text-white/40 line-through font-medium">
                {formatINR(originalPrice)}
              </span>
            </div>
            <span className="text-[10px] text-brand-muted font-medium">
              300 GSM Archival Matte
            </span>
          </div>

          {/* Quick Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            className={cn(
              "p-2 rounded-full border transition-all duration-200 flex items-center justify-center shadow-sm",
              addedRecently
                ? "bg-brand-yellow text-charcoal-dark border-brand-yellow"
                : "bg-charcoal-surface border-charcoal-border text-white/80 hover:text-charcoal-dark hover:bg-brand-yellow hover:border-brand-yellow"
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            {addedRecently ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
