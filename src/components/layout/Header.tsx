"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { MobileNavigation } from "./MobileNavigation";
import { NAVIGATION_ITEMS } from "@/data/navigation";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = [
      "hero",
      "collections",
      "room-inspiration",
      "best-sellers",
      "contact",
      "faq",
    ];
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "-25% 0px -65% 0px",
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Floating Glassmorphism Navbar Container with Top Margin */}
      <header
        className={cn(
          "fixed top-4 sm:top-6 left-0 right-0 z-40 transition-all duration-300 pointer-events-none flex justify-center px-4 sm:px-6"
        )}
      >
        <div
          className={cn(
            "pointer-events-auto w-full max-w-6xl rounded-full px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 flex items-center justify-between",
            "bg-charcoal-dark/85 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80 ring-1 ring-white/5",
            isScrolled && "bg-charcoal-dark/95 border-brand-yellow/30 shadow-glow-yellow/10"
          )}
        >
          {/* Left: Happy Wall Logo (Official Image Logo) */}
          <a
            href="#hero"
            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded-full py-0.5 px-1"
            aria-label="Happy Wall Homepage"
          >
            <Image
              src="/happywall_logo.png"
              alt="Happy Wall"
              width={160}
              height={44}
              priority
              className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </a>

          {/* Centre: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1 rounded-full bg-charcoal-card/60 border border-white/5 backdrop-blur-md">
            {NAVIGATION_ITEMS.map((item) => {
              const targetId = item.href.replace("#", "");
              const isActive = activeSection === targetId;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "px-3 xl:px-4 py-1.5 text-xs xl:text-sm font-manrope font-semibold transition-all duration-200 rounded-full select-none relative",
                    isActive
                      ? "text-charcoal-dark bg-brand-yellow font-extrabold shadow-sm shadow-brand-yellow/30"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right: Cart Icon & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-full bg-charcoal-surface border border-charcoal-border hover:border-brand-yellow hover:text-brand-yellow text-white/90 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              aria-label={`Open poster selection cart (${totalItems} items)`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-yellow text-charcoal-dark font-manrope font-extrabold text-[10px] flex items-center justify-center shadow-glow-yellow animate-in zoom-in-75">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 sm:p-2.5 text-white/80 hover:text-white rounded-full bg-charcoal-surface border border-charcoal-border focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeSection={activeSection}
      />
    </>
  );
};
