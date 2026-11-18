"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { signInAdmin } from "@/services/auth.service";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { parseAppError } from "@/lib/errorHandler";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    urlError === "unauthorized"
      ? "Access denied. Your account is authenticated but not authorized as an administrator."
      : ""
  );

  const configured = isSupabaseConfigured();

  // Log detailed developer diagnostics in dev mode without exposing internals in the UI
  useEffect(() => {
    if (!configured && process.env.NODE_ENV === "development") {
      console.warn(
        "[HappyWalls Dev Notice] Backend service is unconfigured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file to enable database and authentication features."
      );
    }
  }, [configured]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (!configured) {
      setErrorMessage("The administration service is currently unavailable. Please contact your system administrator.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await signInAdmin(email, password);

      if (!result.success) {
        setErrorMessage(parseAppError(result.error, "Invalid administrator credentials or service unavailable."));
        setIsLoading(false);
        return;
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(parseAppError(err, "Network error or connection timed out. Please try again."));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] flex flex-col justify-center items-center p-4 sm:p-6 text-gray-900 selection:bg-[#F5B700] selection:text-gray-900">
      {/* Centered Login Card */}
      <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-amber-900/5 border border-amber-100/60 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Logo */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 shadow-sm ring-4 ring-amber-50">
          <Image
            src="/icon.png"
            alt="Happy Walls Mascot"
            width={128}
            height={128}
            priority
            className="object-contain w-full h-full"
          />
        </div>

        {/* Brand Title */}
        <h1 className="font-manrope font-bold text-xl sm:text-2xl text-gray-900 tracking-tight text-center">
          Happy Walls
        </h1>

        {/* Welcome Back & Subtitle */}
        <h2 className="font-manrope font-extrabold text-2xl sm:text-3xl text-gray-900 mt-5 text-center">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 text-center">
          Sign in to manage your poster collection.
        </p>

        {/* System Service Notice */}
        {!configured && (
          <div className="w-full mt-4 p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-2xl text-left">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <span className="font-semibold block text-amber-950 mb-0.5">Service Unavailable</span>
                The administration service is currently offline or undergoing maintenance. Please contact your system administrator.
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full mt-6 space-y-4">
          {/* Email input */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              Email address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F5B700] focus:border-transparent transition-all"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 sm:top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F5B700] focus:border-transparent transition-all"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 sm:top-3.5 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 sm:top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none p-0.5"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit CTA Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 bg-[#F5B700] hover:bg-[#E5AB00] text-gray-900 font-bold rounded-xl text-sm sm:text-base transition-all shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Bottom Secure Access Indicator */}
        <div className="mt-8 flex items-center gap-1.5 text-gray-400 text-xs">
          <ShieldCheck className="w-4 h-4 text-gray-400" />
          <span>Secure admin access</span>
        </div>
      </div>
    </div>
  );
}
