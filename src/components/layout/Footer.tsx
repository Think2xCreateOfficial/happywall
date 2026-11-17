import React from "react";
import Image from "next/image";
import { Instagram, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { NAVIGATION_ITEMS } from "@/data/navigation";
import { SITE_CONFIG } from "@/data/site-config";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal border-t border-charcoal-border pt-12 pb-8 text-brand-muted">
      <Container size="wide">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-charcoal-border/60">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-2 max-w-sm">
            <div className="flex items-center gap-3">
              <Image
                src="/happywall_logo.png"
                alt="Happy Wall"
                width={150}
                height={44}
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-brand-muted font-inter">
              {SITE_CONFIG.tagline}
            </p>
            <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
              <MapPin className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
              <span>{SITE_CONFIG.address.locality}, {SITE_CONFIG.address.city} – {SITE_CONFIG.address.postalCode}</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {NAVIGATION_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-manrope font-medium text-white/70 hover:text-brand-yellow transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Social Icons & WhatsApp CTA */}
          <div className="flex items-center gap-4">
            <a
              href={SITE_CONFIG.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-charcoal-surface border border-charcoal-border text-white/70 hover:text-brand-yellow hover:border-brand-yellow transition-colors"
              aria-label="Happy Wall Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <WhatsAppButton size="sm" label="Chat on WhatsApp" />
          </div>
        </div>

        {/* Bottom Bar: Copyright & Location Note */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <p>© {new Date().getFullYear()} Happy Wall. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Handcrafted with precision for walls with personality • Chennai, India
          </p>
        </div>
      </Container>
    </footer>
  );
};

