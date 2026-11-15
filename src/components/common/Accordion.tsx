"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQItem } from "@/data/faqs";
import { cn } from "@/lib/utils";

interface AccordionProps {
  items: FAQItem[];
  defaultOpenIndex?: number | null;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = 0,
  className,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn("flex flex-col gap-3.5 w-full", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.id}
            className={cn(
              "rounded-2xl transition-all duration-300 border bg-charcoal-card overflow-hidden",
              isOpen
                ? "border-brand-yellow/60 bg-charcoal-card shadow-lg shadow-black/50"
                : "border-charcoal-border hover:border-white/20"
            )}
          >
            <h3>
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow select-none group"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
                id={`faq-question-${item.id}`}
              >
                <span className={cn(
                  "font-manrope font-extrabold text-sm sm:text-base leading-snug transition-colors",
                  isOpen ? "text-brand-yellow" : "text-white group-hover:text-white/90"
                )}>
                  {item.question}
                </span>

                <span
                  className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                    isOpen
                      ? "bg-brand-yellow text-charcoal-dark rotate-180 shadow-glow-yellow"
                      : "bg-charcoal-surface text-white/70 group-hover:bg-charcoal-border group-hover:text-white"
                  )}
                  aria-hidden="true"
                >
                  {isOpen ? <Minus className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
                </span>
              </button>
            </h3>

            {isOpen && (
              <div
                id={`faq-answer-${item.id}`}
                role="region"
                aria-labelledby={`faq-question-${item.id}`}
                className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-brand-muted font-inter leading-relaxed border-t border-charcoal-border/50 animate-in fade-in duration-200"
              >
                <p className="text-white/80">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
