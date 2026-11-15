import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "yellowOutline";
  size?: "sm" | "md" | "lg";
  href?: string;
  isExternal?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      isExternal,
      icon,
      iconPosition = "right",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-manrope font-bold transition-all duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "px-4 py-2 text-xs tracking-wide gap-1.5",
      md: "px-6 py-3 text-sm tracking-wide gap-2",
      lg: "px-8 py-3.5 text-base tracking-wide gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-brand-yellow text-charcoal-dark hover:bg-brand-yellowHover shadow-sm hover:shadow-glow-yellow",
      secondary:
        "bg-charcoal-surface text-white hover:bg-charcoal-muted border border-charcoal-border",
      outline:
        "bg-transparent text-white border border-white/20 hover:border-brand-yellow hover:text-brand-yellow",
      yellowOutline:
        "bg-transparent text-brand-yellow border border-brand-yellow/60 hover:bg-brand-yellow hover:text-charcoal-dark",
      ghost:
        "bg-transparent text-brand-muted hover:text-white hover:bg-white/5",
    };

    const combinedClassName = cn(
      baseStyles,
      sizeStyles[size],
      variantStyles[variant],
      className
    );

    const content = (
      <>
        {icon && iconPosition === "left" && <span className="inline-flex shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === "right" && <span className="inline-flex shrink-0">{icon}</span>}
      </>
    );

    if (href) {
      return (
        <a
          href={href}
          className={combinedClassName}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

