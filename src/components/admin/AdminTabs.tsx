"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type AdminTab = "posters" | "categories";

interface AdminTabsProps {
  activeTab: AdminTab;
  onChange: (tab: AdminTab) => void;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="flex items-center gap-6 border-b border-gray-200 mt-6" role="tablist">
      <button
        role="tab"
        aria-selected={activeTab === "posters"}
        onClick={() => onChange("posters")}
        className={cn(
          "pb-3 text-sm sm:text-base font-semibold transition-all relative",
          activeTab === "posters"
            ? "text-gray-900 border-b-2 border-[#F5B700]"
            : "text-gray-500 hover:text-gray-800"
        )}
      >
        Posters
      </button>

      <button
        role="tab"
        aria-selected={activeTab === "categories"}
        onClick={() => onChange("categories")}
        className={cn(
          "pb-3 text-sm sm:text-base font-semibold transition-all relative",
          activeTab === "categories"
            ? "text-gray-900 border-b-2 border-[#F5B700]"
            : "text-gray-500 hover:text-gray-800"
        )}
      >
        Categories
      </button>
    </div>
  );
};
