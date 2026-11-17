"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, LayoutDashboard, LogIn, AlertCircle } from "lucide-react";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error("Happy Walls Admin Caught Exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-center items-center p-4 sm:p-6 text-gray-900 font-inter">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-amber-900/5 border border-amber-100/60 text-center animate-in fade-in duration-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
          <AlertCircle className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold text-[#B8860B] uppercase tracking-wider block mb-1">
          Admin Portal Notice
        </span>

        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-manrope mb-2">
          Unable to Load Admin Module
        </h1>

        <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
          A temporary synchronization or network error occurred in the administration area.
          Your existing database changes remain intact.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3 px-4 rounded-xl bg-[#F5B700] hover:bg-[#E5AB00] text-gray-900 font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Action</span>
          </button>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <Link
              href="/admin"
              className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/login"
              className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
