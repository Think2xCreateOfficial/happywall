import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-charcoal-dark text-white flex flex-col justify-between selection:bg-brand-yellow selection:text-charcoal-dark relative overflow-hidden">
      {/* Ambient Cosmic Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-yellow/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-black/40 blur-[100px] pointer-events-none -z-10" />

      {/* Minimal Top Brand Bar */}
      <header className="w-full pt-8 px-6 sm:px-12 flex items-center justify-between z-10">
        <Link href="/" className="inline-block transition-transform hover:scale-105">
          <Image
            src="/happywall_logo.png"
            alt="Happy Wall"
            width={150}
            height={42}
            className="h-8 sm:h-9 w-auto object-contain"
            priority
          />
        </Link>
      </header>

      {/* Main 404 Body */}
      <Container size="narrow" className="py-16 sm:py-24 text-center z-10 flex flex-col items-center">
        {/* Subtle Poster-Inspired Empty Gallery Frame Graphic */}
        <div className="relative mb-8 group">
          <div className="w-40 sm:w-52 aspect-[1414/2000] rounded-xl sm:rounded-2xl border-2 border-dashed border-brand-yellow/50 bg-charcoal-card/80 backdrop-blur-md p-3 sm:p-4 shadow-2xl flex flex-col items-center justify-center transition-transform group-hover:scale-105">
            <span className="font-manrope font-black text-4xl sm:text-6xl text-brand-yellow/90 tracking-tighter">
              404
            </span>
            <div className="mt-3 w-10 h-0.5 bg-brand-yellow/30 rounded-full" />
            <span className="mt-3 text-[10px] sm:text-xs font-manrope font-extrabold uppercase tracking-widest text-brand-muted/80">
              Blank Wall
            </span>
          </div>

          {/* Golden Frame Corner Badges */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-brand-yellow" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-brand-yellow" />
        </div>

        {/* Typographic Message */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-manrope font-extrabold uppercase tracking-widest text-brand-yellow">
            PAGE NOT FOUND
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-manrope font-extrabold text-white tracking-tight leading-tight uppercase mb-4">
          LOOKS LIKE THIS WALL IS <br />
          <span className="text-brand-yellow">STILL BLANK.</span>
        </h1>

        <p className="text-sm sm:text-base text-brand-muted font-inter max-w-md mx-auto leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back to discovering great wall posters for your home.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-yellow text-charcoal-dark font-manrope font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-glow-yellow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/#collections"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-charcoal-surface hover:bg-white/10 text-white font-manrope font-bold text-xs sm:text-sm uppercase tracking-wider border border-white/10 hover:border-brand-yellow/40 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-brand-yellow" />
            <span>Explore Collections</span>
          </Link>
        </div>
      </Container>

      {/* Clean Bottom Note */}
      <footer className="w-full pb-8 px-6 text-center text-xs text-brand-muted/60 z-10 font-inter">
        © {new Date().getFullYear()} Happy Wall · Handcrafted Wall Posters · Palavakkam, Chennai
      </footer>
    </main>
  );
}

