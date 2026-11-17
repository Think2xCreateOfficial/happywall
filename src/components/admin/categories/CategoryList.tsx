"use client";

import React from "react";
import { Edit2, Trash2, Plus, Folder, Hash } from "lucide-react";
import { CategoryRow } from "@/types/database.types";
import { SafeImage } from "@/components/ui/SafeImage";
import { AdminSpinner } from "../AdminSpinner";

interface CategoryListProps {
  categories: CategoryRow[];
  posterCounts?: Record<string, number>;
  onAddCategory: () => void;
  onEditCategory: (category: CategoryRow) => void;
  onDeleteCategory: (category: CategoryRow) => void;
  isLoading?: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  posterCounts = {},
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  isLoading = false,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 sm:p-6 text-charcoal">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Categories</h2>
            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2.5 py-0.5 rounded-full">
              {categories.length} {categories.length === 1 ? "category" : "categories"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Manage collections, slugs and display ordering</p>
        </div>

        <button
          onClick={onAddCategory}
          className="inline-flex items-center justify-center gap-1.5 bg-[#F5B700] hover:bg-[#E5AB00] text-gray-900 font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors shadow-sm self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add category</span>
        </button>
      </div>

      {/* Category Rows */}
      {isLoading ? (
        <AdminSpinner label="Loading categories..." fullHeight />
      ) : categories.length === 0 ? (
        <div className="py-16 text-center">
          <Folder className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-800">No categories found</p>
          <p className="text-xs text-gray-500 mt-1">Get started by creating your first category.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {categories.map((category) => {
            const count = posterCounts[category.id] ?? 0;

            return (
              <div
                key={category.id}
                className="py-4 flex items-center justify-between gap-4 group hover:bg-gray-50/50 -mx-2 px-2 rounded-xl transition-colors"
              >
                {/* Left: Thumbnail & Name & Slug */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200/80 shadow-xs">
                    <SafeImage
                      src={category.image_path}
                      alt={category.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                        {category.name}
                      </h3>
                      <span className="text-[11px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        /{category.slug}
                      </span>
                      {category.is_active ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>
                        {count} {count === 1 ? "poster" : "posters"}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-0.5 text-gray-400">
                        <Hash className="w-3 h-3" />
                        <span>Order: {category.display_order ?? 0}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => onEditCategory(category)}
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(category)}
                    className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
