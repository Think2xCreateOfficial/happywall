"use client";

import React from "react";
import { ShieldCheck, Truck, Package, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Container } from "@/components/ui/Container";
import { CustomPosterForm } from "@/components/forms/CustomPosterForm";
import { SITE_CONFIG } from "@/data/site-config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const CustomPosterSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="py-20 lg:py-28 bg-charcoal-dark relative border-t border-charcoal-border/50 overflow-hidden"
    >
      {/* Legacy Anchor support */}
      <span id="custom-posters" className="sr-only" aria-hidden="true" />
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Custom Art Value Proposition */}
          <div className="lg:col-span-5 flex flex-col items-start lg:sticky lg:top-28">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-0.5 bg-brand-yellow rounded-full inline-block" />
              <span className="text-xs font-manrope font-extrabold uppercase tracking-widest text-brand-yellow">
                CUSTOM POSTER STUDIO
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-manrope font-extrabold text-white tracking-tight leading-tight mb-4">
              BRING YOUR IDEAS <br />
              <span className="text-brand-yellow">TO LIFE.</span>
            </h2>

            <p className="text-sm sm:text-base text-brand-muted font-inter leading-relaxed mb-8 max-w-lg">
              Have a favorite digital artwork, anime still, gaming screenshot, or personal photograph? Happy Walls prints and frames custom orders from our Palavakkam studio in Chennai with zero visual loss.
            </p>

            {/* Studio Specifications & Trust Signals */}
            <div className="space-y-4 text-sm text-white/90 font-inter mb-8 w-full">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-charcoal-card/60 border border-charcoal-border/60">
                <div className="p-2 rounded-xl bg-brand-yellow/15 text-brand-yellow shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-manrope font-bold text-white block text-sm">
                    270 GSM High Quality Glossy Photo Sheet
                  </span>
                  <span className="text-xs text-brand-muted leading-relaxed">
                    Printed on premium 270 GSM glossy photo sheets to deliver rich colours, sharp details, and a beautiful glossy finish for your walls.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-charcoal-card/60 border border-charcoal-border/60">
                <div className="p-2 rounded-xl bg-brand-yellow/15 text-brand-yellow shrink-0 mt-0.5">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-manrope font-bold text-white block text-sm">
                    Box Packaging
                  </span>
                  <span className="text-xs text-brand-muted leading-relaxed">
                    Heavy-duty reinforced packaging ensuring zero creasing or edge damages during transit.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-charcoal-card/60 border border-charcoal-border/60">
                <div className="p-2 rounded-xl bg-brand-yellow/15 text-brand-yellow shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-manrope font-bold text-white block text-sm">
                    Palavakkam, Chennai Studio
                  </span>
                  <span className="text-xs text-brand-muted leading-relaxed">
                    Local Chennai delivery within 24–48 hours, plus express shipping across Tamil Nadu.
                  </span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="p-4 rounded-2xl bg-charcoal-card border border-brand-yellow/30 flex items-center justify-between gap-3 w-full">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-yellow/15 flex items-center justify-center text-brand-yellow shrink-0">
                  <WhatsAppIcon className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <p className="text-xs font-manrope font-bold text-white">
                    Need Direct Consultation?
                  </p>
                  <p className="text-[11px] text-brand-muted">
                    WhatsApp: {SITE_CONFIG.contact.phoneDisplay}
                  </p>
                </div>
              </div>

              <a
                href={buildWhatsAppUrl("Hello Happy Walls! I have questions regarding custom poster printing and sizes.")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-brand-yellow hover:bg-brand-yellowHover text-charcoal-dark font-manrope font-extrabold text-[11px] transition-colors shrink-0"
              >
                Chat Direct
              </a>
            </div>
          </div>

          {/* Right Column: Custom Poster Booking Form */}
          <div className="lg:col-span-7 w-full">
            <CustomPosterForm />
          </div>
        </div>
      </Container>
    </section>
  );
};
