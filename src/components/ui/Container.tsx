import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  size?: "default" | "narrow" | "wide";
}

export const Container: React.FC<ContainerProps> = ({
  className,
  children,
  size = "default",
  ...props
}) => {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full",
        size === "default" && "max-w-7xl",
        size === "narrow" && "max-w-5xl",
        size === "wide" && "max-w-[1440px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

