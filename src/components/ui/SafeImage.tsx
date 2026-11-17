"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { resolveImageUrl, DEFAULT_FALLBACK_IMAGE } from "@/services/storage.service";
import { cn } from "@/lib/utils";

export interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  fallbackSrc?: string;
  containerClassName?: string;
}

/**
 * Enterprise Safe Image Component for Happy Walls
 * - Automatically resolves Supabase Storage paths through resolveImageUrl()
 * - Guaranteed fallback to DEFAULT_FALLBACK_IMAGE on network/decoding errors
 * - Prevents infinite retry loops
 * - Never exposes broken image indicators to end users
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  alt,
  className,
  containerClassName,
  onError,
  ...props
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string>(() => resolveImageUrl(src));
  const [hasError, setHasError] = useState<boolean>(false);

  // Sync when prop changes
  useEffect(() => {
    const nextUrl = resolveImageUrl(src);
    setResolvedSrc(nextUrl);
    setHasError(false);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && resolvedSrc !== fallbackSrc) {
      setHasError(true);
      setResolvedSrc(fallbackSrc);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt || "Happy Walls Poster"}
      className={cn(className, hasError && "opacity-90")}
      onError={handleError}
    />
  );
};
