"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOutAdmin } from "@/services/auth.service";

interface AdminHeaderProps {
  adminEmail?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ adminEmail }) => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOutAdmin();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link
          href="/admin"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B700] rounded-lg p-1"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 bg-white shadow-sm ring-1 ring-gray-100">
            <Image
              src="/icon.png"
              alt="Happy Wall"
              width={40}
              height={40}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <span className="font-manrope font-bold text-lg sm:text-xl text-gray-900 tracking-tight">
            Happy Wall
          </span>
        </Link>

        {/* Right: Admin Info & Sign Out */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 hidden md:inline-block">
              {adminEmail ? adminEmail : "Admin"}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 md:hidden">
              Admin
            </span>
          </div>

          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex items-center gap-1.5 bg-[#F5B700] hover:bg-[#E5AB00] text-gray-900 font-semibold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors shadow-sm disabled:opacity-50"
            aria-label="Sign out of admin dashboard"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
