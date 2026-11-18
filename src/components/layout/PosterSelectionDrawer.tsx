"use client";

import React, { useEffect, useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import { SafeImage } from "@/components/ui/SafeImage";
import { buildWhatsAppUrl, formatCartOrderMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";

export const PosterSelectionDrawer: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  // Prevent background scrolling while cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    const message = formatCartOrderMessage(items, totalAmount);
    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");

    // Clear selected posters from cart and close drawer after order submission
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Poster Selection Cart"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-charcoal-card border-l border-charcoal-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-border bg-charcoal-surface/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-yellow/15 flex items-center justify-center text-brand-yellow">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-manrope font-extrabold text-base text-white">
                Your Poster Selection
              </h3>
              <p className="text-[11px] text-brand-muted">
                {totalItems} {totalItems === 1 ? "poster" : "posters"} in cart
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-white/70 hover:text-white rounded-full bg-charcoal-surface border border-charcoal-border hover:border-brand-yellow transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-charcoal-surface border border-charcoal-border flex items-center justify-center text-white/30 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-manrope font-bold text-lg text-white mb-2">
                Your Cart is Empty
              </h4>
              <p className="text-xs text-brand-muted max-w-xs mb-6">
                Explore our curated Anime, Games, and Split Poster collections to start decorating your room sanctuary.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsCartOpen(false);
                  const el = document.getElementById("collections");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Browse Collections
              </Button>
            </div>
          ) : (
            items.map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-charcoal-surface border border-charcoal-border hover:border-brand-yellow/30 transition-all"
                >
                  {/* Poster Thumbnail */}
                  <div className="relative w-16 h-22 aspect-[1414/2000] rounded-lg overflow-hidden shrink-0 border border-white/10 bg-charcoal-dark flex items-center justify-center">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-manrope font-extrabold text-brand-yellow uppercase tracking-widest block mb-0.5">
                      {item.category}
                    </span>
                    <h4 className="font-manrope font-bold text-sm text-white truncate">
                      {item.name}
                    </h4>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] font-manrope font-extrabold px-2 py-0.5 rounded-md bg-brand-yellow/15 text-brand-yellow">
                        {item.size}
                      </span>
                      {item.hasFrame && (
                        <span className="text-[10px] font-manrope font-bold px-1.5 py-0.5 rounded-md bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30">
                          With Frame (+₹210)
                        </span>
                      )}
                      <span className="text-[10px] text-brand-muted truncate">
                        {item.dimensions}
                      </span>
                    </div>

                    {item.inclusions && (
                      <p className="text-[10px] text-brand-yellow/90 font-mono mt-1 truncate">
                        Includes: {item.inclusions}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-manrope font-black text-sm text-brand-yellow">
                          {formatINR(item.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-white/50 font-mono">
                            ({formatINR(item.price)} each)
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-charcoal-card rounded-lg border border-charcoal-border px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-white/70 hover:text-white p-0.5 transition-colors"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-white/70 hover:text-white p-0.5 transition-colors"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer with Subtotal & WhatsApp Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-charcoal-border bg-charcoal-surface/90 flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-brand-muted font-medium">Estimated Subtotal:</span>
              <span className="text-2xl font-manrope font-extrabold text-brand-yellow">
                {formatINR(totalAmount)}
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleWhatsAppCheckout}
              icon={<WhatsAppIcon className="w-5 h-5 shrink-0" />}
              className="w-full text-sm font-extrabold shadow-glow-yellow"
            >
              Order Selection on WhatsApp
            </Button>

            <div className="flex items-center justify-between text-[11px] text-brand-muted">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-yellow" />
                <span>Delivery across Chennai in 24-48 hrs</span>
              </div>
              <button
                onClick={clearCart}
                className="text-white/40 hover:text-white underline transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
