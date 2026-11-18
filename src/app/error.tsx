"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RotateCcw, Home, AlertTriangle } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/data/site-config";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error securely for diagnostics
    console.error("Happy Walls Application Caught Exception:", error);

    // Auto-recover from transient stale webpack chunk mismatch (MODULE_NOT_FOUND or ChunkLoadError)
    const isChunkMismatch =
      error?.message?.includes("Cannot find module") ||
      error?.message?.includes("Loading chunk") ||
      error?.name === "ChunkLoadError";

    if (isChunkMismatch && typeof window !== "undefined") {
      const reloadKey = "hw_chunk_reload_attempted";
      const hasReloaded = sessionStorage.getItem(reloadKey);
      if (!hasReloaded) {
        sessionStorage.setItem(reloadKey, "true");
        window.location.reload();
      }
    }
  }, [error]);

  const handleRetry = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("hw_chunk_reload_attempted");
    }
    reset();
  };

  const handleHardReload = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("hw_chunk_reload_attempted");
      window.location.reload();
    }
  };

  return (
    <main className="min-h-screen bg-charcoal-dark text-white flex flex-col justify-between selection:bg-brand-yellow selection:text-charcoal-dark relative overflow-hidden">
      {/* Background ambient radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-yellow/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[250px] bg-black/50 blur-[90px] pointer-events-none -z-10" />

      {/* Header Logo */}
      <header className="w-full pt-8 px-6 sm:px-12 flex items-center justify-between z-10">
        <Link href="/" className="inline-block transition-transform hover:scale-105">
          <Image
            src="/happywall_logo.png"
            alt="Happy Walls"
            width={140}
            height={38}
            className="h-8 sm:h-9 w-auto object-contain"
            priority
          />
        </Link>
      </header>

      {/* Main Content */}
      <Container size="narrow" className="py-14 sm:py-20 text-center z-10 flex flex-col items-center">
        {/* Visual Frame */}
        <div className="relative mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-brand-yellow shadow-xl">
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-brand-yellow" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-brand-yellow" />
        </div>

        {/* Text */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-3 h-0.5 bg-brand-yellow rounded-full inline-block" />
          <span className="text-xs font-manrope font-extrabold uppercase tracking-widest text-brand-yellow">
            SOMETHING WENT WRONG
          </span>
          <span className="w-3 h-0.5 bg-brand-yellow rounded-full inline-block" />
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-manrope font-extrabold text-white tracking-tight uppercase mb-3">
          WE HIT A TEMPORARY GLITCH ON <br />
          <span className="text-brand-yellow">THIS PAGE.</span>
        </h1>

        <p className="text-xs sm:text-sm text-brand-muted font-inter max-w-md mx-auto leading-relaxed mb-8">
          We encountered an unexpected issue while loading this page. Don&apos;t worry — your cart items, preferences, and session data remain safe.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm">
          <button
            type="button"
            onClick={handleRetry}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-yellow text-charcoal-dark font-manrope font-extrabold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-glow-yellow"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <button
            type="button"
            onClick={handleHardReload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-charcoal-surface border border-charcoal-border hover:border-brand-yellow/50 text-white font-manrope font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <span>Reload Page</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-transparent hover:bg-white/5 text-brand-muted hover:text-white font-manrope font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>

        {/* Support Link */}
        <div className="mt-8 pt-6 border-t border-white/10 w-full max-w-sm flex flex-col items-center">
          <p className="text-xs text-brand-muted mb-2 font-inter">Need help or looking to complete an order?</p>
          <a
            href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=Hi%20Happy%20Walls%20team%2C%20I%20encountered%20an%20issue%20on%20the%20website%20and%20need%20assistance.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-manrope font-bold text-xs transition-colors"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>Message Support on WhatsApp</span>
          </a>
        </div>
      </Container>

      {/* Footer minimal tag */}
      <footer className="w-full pb-8 text-center text-xs text-brand-muted/50 font-inter">
        © {new Date().getFullYear()} Happy Walls · Curated Wall Decor & Fine Art Prints
      </footer>
    </main>
  );
}
