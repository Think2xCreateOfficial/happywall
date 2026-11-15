"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, HelpCircle, MessageCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/common/Accordion";
import { FAQS, FAQItem } from "@/data/faqs";
import { SITE_CONFIG } from "@/data/site-config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "collections", label: "Poster Collections" },
  { id: "custom", label: "Custom Posters" },
  { id: "ordering", label: "Ordering & Delivery" },
  { id: "support", label: "Product & Support" },
] as const;

export const FAQSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-charcoal-dark relative border-t border-charcoal-border/50">
      {/* Subtle Ambient Backlight Glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-brand-yellow/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-0.5 bg-brand-yellow rounded-full inline-block" />
              <span className="text-xs font-manrope font-extrabold uppercase tracking-widest text-brand-yellow">
                HELP &amp; FREQUENT QUESTIONS
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-manrope font-extrabold text-white tracking-tight leading-tight">
              FREQUENTLY ASKED <br />
              <span className="text-brand-yellow">QUESTIONS</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-brand-muted max-w-xl font-inter leading-relaxed">
              Find transparent answers about our poster collections, custom printing, sizing, and Chennai doorstep delivery from our Palavakkam studio.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. Chennai, Split, Sizes)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-charcoal-surface border border-charcoal-border text-xs sm:text-sm text-white placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-yellow transition-all"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === "all"
                ? FAQS.length
                : FAQS.filter((f) => f.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-manrope font-bold transition-all shrink-0 flex items-center gap-2 select-none",
                  isSelected
                    ? "bg-brand-yellow text-charcoal-dark shadow-glow-yellow shadow-sm"
                    : "bg-charcoal-surface text-white/70 hover:text-white border border-charcoal-border hover:border-white/20"
                )}
              >
                <span>{cat.label}</span>
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                  isSelected ? "bg-charcoal-dark/20 text-charcoal-dark font-extrabold" : "bg-black/40 text-white/50"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* FAQ Grid: Questions on Left/Center, Direct Help Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Accordion Column */}
          <div className="lg:col-span-8 w-full">
            {filteredFaqs.length > 0 ? (
              <Accordion items={filteredFaqs} defaultOpenIndex={0} />
            ) : (
              <div className="text-center py-12 px-6 rounded-2xl bg-charcoal-card border border-charcoal-border">
                <p className="text-sm text-white font-manrope font-bold mb-1">
                  No matching questions found for &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-xs text-brand-muted mb-4">
                  Have a specific question not listed here? Message our team directly on WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 rounded-full bg-brand-yellow text-charcoal-dark text-xs font-manrope font-bold"
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Direct WhatsApp Support Card */}
          <div className="lg:col-span-4 w-full lg:sticky lg:top-28">
            <div className="relative bg-charcoal-card rounded-3xl p-6 sm:p-7 border border-charcoal-border shadow-2xl overflow-hidden flex flex-col justify-between group">
              {/* Subtle Ambient Halo */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-brand-yellow/15 flex items-center justify-center text-brand-yellow mb-4">
                  <HelpCircle className="w-5 h-5" />
                </div>

                <h3 className="text-xl sm:text-2xl font-manrope font-extrabold text-white tracking-tight leading-tight mb-2">
                  Have Another <br />
                  <span className="text-brand-yellow">Question?</span>
                </h3>

                <p className="text-xs sm:text-sm text-brand-muted font-inter leading-relaxed mb-6">
                  Our Palavakkam studio team is always happy to assist with custom sizing, frame choices, delivery estimates, or bulk orders.
                </p>

                <a
                  href={buildWhatsAppUrl("Hello Happy Walls! I have a question regarding your posters and would like quick assistance.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-2xl bg-brand-yellow hover:bg-brand-yellowHover text-charcoal-dark text-xs sm:text-sm font-manrope font-extrabold flex items-center justify-center gap-2.5 transition-all shadow-glow-yellow"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
