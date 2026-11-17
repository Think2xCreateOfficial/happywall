"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AdminSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
  fullHeight?: boolean;
}

export const AdminSpinner: React.FC<AdminSpinnerProps> = ({
  size = "md",
  label = "Loading...",
  className,
  fullHeight = false,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
  };

  const textClasses = {
    sm: "text-xs",
    md: "text-xs sm:text-sm",
    lg: "text-sm sm:text-base",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex flex-col items-center justify-center gap-2.5 text-gray-500",
        fullHeight ? "py-16 sm:py-24" : "py-6",
        className
      )}
    >
      <span
        className={cn(
          "rounded-full border-gray-200 border-t-[#F5B700] animate-spin",
          sizeClasses[size]
        )}
      />
      {label && (
        <span className={cn("font-medium font-inter", textClasses[size])}>
          {label}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
};
