import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  actionHref?: string;
  actionText?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  highlight,
  description,
  actionHref,
  actionText,
  align = "left",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12",
        align === "center" && "text-center md:flex-col md:items-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {badge && (
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-0.5 bg-brand-yellow rounded-full inline-block" />
            <span className="text-xs font-manrope font-extrabold uppercase tracking-widest text-brand-yellow">
              {badge}
            </span>
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-manrope font-extrabold text-white tracking-tight leading-tight">
          {title}{" "}
          {highlight && <span className="text-brand-yellow">{highlight}</span>}
        </h2>

        {description && (
          <p className="mt-3 text-sm sm:text-base text-brand-muted max-w-xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actionHref && actionText && (
        <a
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-manrope font-semibold text-white/90 hover:text-brand-yellow transition-colors group shrink-0"
        >
          <span>{actionText}</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      )}
    </div>
  );
};

