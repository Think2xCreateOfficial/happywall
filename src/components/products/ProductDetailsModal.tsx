"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, Check, ShoppingBag } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Product, PosterSize } from "@/types/product";
import { formatINR, cn } from "@/lib/utils";
import { getDriveImageUrl } from "@/lib/drive";
import { buildWhatsAppUrl, formatProductOrderMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  const [selectedSizeId, setSelectedSizeId] = useState<PosterSize>("A3");
  const [quantity, setQuantity] = useState<number>(1);
  const [customerNote, setCustomerNote] = useState<string>("" );
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      setSelectedSizeId("A3");
      setQuantity(1);
      setCustomerNote("");
      setIsAdded(false);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && product) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const activeSize =
    product.availableSizes.find((s) => s.id === selectedSizeId) || product.availableSizes[0];
  const unitPrice = activeSize.price;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(product, activeSize.id, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  const handleOrderWhatsApp = () => {
    const message = formatProductOrderMessage({
      productName: product.name,
      productId: product.id,
      size: activeSize.id,
      dimensions: activeSize.dimensions,
      quantity,
      totalPrice,
      customerNote: customerNote.trim() || undefined,
    });

    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-charcoal-card rounded-2xl border border-charcoal-border overflow-hidden shadow-2xl flex flex-col md:flex-row my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-charcoal-surface/80 text-white/70 hover:text-white border border-white/10 hover:border-brand-yellow transition-colors focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          aria-label="Close product details dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: High-Resolution Artwork Preview */}
        <div className="relative md:w-1/2 aspect-[1414/2000] md:aspect-auto bg-charcoal-surface min-h-[300px]">
          <Image
            src={getDriveImageUrl(product.image)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-card via-transparent to-transparent md:hidden" />

          {/* Tag */}
          {product.tag && (
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-brand-yellow text-charcoal-dark text-xs font-manrope font-extrabold uppercase tracking-wider shadow-md">
              {product.tag}
            </div>
          )}
        </div>

        {/* Right: Specifications & Add to Cart / Order Actions */}
        <div className="p-6 sm:p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <span className="text-xs font-manrope font-extrabold uppercase tracking-widest text-brand-yellow block mb-1">
              {product.category}
            </span>
            <h3
              id="modal-product-title"
              className="text-xl sm:text-2xl font-manrope font-extrabold text-white mb-2 leading-tight"
            >
              {product.name}
            </h3>

            <p className="text-xs sm:text-sm text-brand-muted font-inter leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <label className="text-xs font-manrope font-bold text-white/90 uppercase tracking-wider block mb-2.5">
                Select Size &amp; Finish:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.availableSizes.map((size) => {
                  const isSelected = size.id === selectedSizeId;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSizeId(size.id)}
                      className={cn(
                        "p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between",
                        isSelected
                          ? "border-brand-yellow bg-brand-yellow/10 shadow-sm"
                          : "border-charcoal-border bg-charcoal-surface hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-manrope font-extrabold text-xs text-white">
                          {size.id}
                        </span>
                        <span className="text-xs font-manrope font-bold text-brand-yellow">
                          {formatINR(size.price)}
                        </span>
                      </div>
                      <span className="text-[10px] text-brand-muted mt-1">
                        {size.dimensions}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Live Total */}
            <div className="flex items-center justify-between gap-4 mb-6 p-3 rounded-xl bg-charcoal-surface border border-charcoal-border">
              <span className="text-xs font-manrope font-bold text-white/90 uppercase">
                Quantity:
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-charcoal-card border border-charcoal-border flex items-center justify-center text-white hover:border-brand-yellow transition-colors disabled:opacity-40"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-manrope font-extrabold text-sm text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-charcoal-card border border-charcoal-border flex items-center justify-center text-white hover:border-brand-yellow transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Total, Add to Cart & WhatsApp Order */}
          <div className="pt-4 border-t border-charcoal-border flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-brand-muted font-medium">Estimated Total:</span>
              <span className="text-2xl font-manrope font-extrabold text-brand-yellow">
                {formatINR(totalPrice)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleAddToCart}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-manrope font-extrabold text-xs uppercase tracking-wider transition-all border",
                  isAdded
                    ? "bg-green-500/20 text-green-400 border-green-500/40"
                    : "bg-brand-yellow text-charcoal-dark border-brand-yellow hover:brightness-110 active:scale-95 shadow-glow-yellow"
                )}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleOrderWhatsApp}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-manrope font-extrabold text-xs uppercase tracking-wider bg-charcoal-surface hover:bg-white/10 text-white border border-white/10 transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                <span>WhatsApp</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-brand-muted">
              Add multiple items to build a custom gallery wall order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
