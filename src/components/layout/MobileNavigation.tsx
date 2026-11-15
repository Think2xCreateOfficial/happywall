"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { NAVIGATION_ITEMS } from "@/data/navigation";
import { SITE_CONFIG } from "@/data/site-config";
import { buildWhatsAppUrl, formatGeneralInquiryMessage } from "@/lib/whatsapp";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  activeSection,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const whatsappUrl = buildWhatsAppUrl(formatGeneralInquiryMessage());

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden flex flex-col bg-charcoal-dark/95 backdrop-blur-xl animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      {/* Top Bar with Close Button */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-border">
        <div className="flex items-center gap-3">
          <Image
            src="/happywall_logo.png"
            alt="Happy Walls"
            width={140}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </div>

        <button
          onClick={onClose}
          className="p-2 text-brand-muted hover:text-white rounded-full bg-charcoal-surface border border-charcoal-border focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = activeSection === item.href.replace("#", "");
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between text-xl font-manrope font-bold py-3 px-4 rounded-xl transition-all ${isActive
                  ? "text-brand-yellow border-b-2 border-brand-yellow/30"
                  : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
            >
              <span>{item.label}</span>
              <ArrowRight className="w-4 h-4 opacity-50" />
            </a>
          );
        })}
      </nav>

      {/* Mobile Footer WhatsApp Action */}
      <div className="p-6 border-t border-charcoal-border bg-charcoal-surface/60">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-full bg-brand-yellow text-charcoal-dark font-manrope font-extrabold text-sm shadow-glow-yellow hover:bg-brand-yellowHover transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5 shrink-0" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

