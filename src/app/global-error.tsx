"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Happy Walls Global Application Error:", error);

    const isChunkMismatch =
      error?.message?.includes("Cannot find module") ||
      error?.message?.includes("Loading chunk") ||
      error?.name === "ChunkLoadError";

    if (isChunkMismatch && typeof window !== "undefined") {
      const reloadKey = "hw_global_reload_attempted";
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, "true");
        window.location.reload();
      }
    }
  }, [error]);

  const handleRetry = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("hw_global_reload_attempted");
    }
    reset();
  };

  const handleReload = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("hw_global_reload_attempted");
      window.location.reload();
    }
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-3xl p-8 text-center shadow-2xl">
          {/* Logo */}
          <div className="w-16 h-16 mx-auto mb-4 relative rounded-full overflow-hidden bg-amber-500/10 border border-[#F5B700]/30 flex items-center justify-center">
            <span className="text-2xl font-black text-[#F5B700]">HW</span>
          </div>

          <span className="text-[11px] font-bold text-[#F5B700] uppercase tracking-widest block mb-2">
            Something Went Wrong
          </span>

          <h1 className="text-2xl font-extrabold text-white mb-2">
            Temporary Glitch Detected
          </h1>

          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            We encountered an unexpected issue while loading this page.
            Click below to refresh and resume browsing.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleRetry}
              className="flex-1 py-3 px-4 rounded-xl bg-[#F5B700] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              type="button"
              onClick={handleReload}
              className="py-3 px-4 rounded-xl bg-[#262626] border border-[#333] hover:border-white/30 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Reload
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-[#333]">
            <a
              href="https://wa.me/917339564538?text=Hi%20Happy%20Walls%20team%2C%20I%20encountered%20an%20issue%20on%20the%20website%20and%20need%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#F5B700] hover:underline"
            >
              Need help? Chat with our team on WhatsApp →
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
