import React from "react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl, formatGeneralInquiryMessage } from "@/lib/whatsapp";

interface WhatsAppButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "compact";
  className?: string;
  label?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message,
  size = "md",
  variant = "solid",
  className,
  label = "Chat on WhatsApp",
  ...props
}) => {
  const finalMessage = message || formatGeneralInquiryMessage();
  const url = buildWhatsAppUrl(finalMessage);

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  };

  const variantClasses = {
    solid:
      "bg-brand-yellow text-charcoal-dark font-manrope font-bold hover:bg-brand-yellowHover shadow-sm hover:shadow-glow-yellow",
    outline:
      "bg-transparent text-brand-yellow border border-brand-yellow/80 hover:bg-brand-yellow hover:text-charcoal-dark font-manrope font-bold",
    compact:
      "bg-brand-yellow text-charcoal-dark p-2 rounded-full hover:bg-brand-yellowHover shadow-sm",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-95 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-label={label}
      {...props}
    >
      <WhatsAppIcon className={cn(size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4", "shrink-0")} />
      {variant !== "compact" && <span>{label}</span>}
    </a>
  );
};

