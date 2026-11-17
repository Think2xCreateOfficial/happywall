"use client";

import React from "react";
import { Edit2, Trash2, Plus, Image as ImageIcon, Search, ChevronDown } from "lucide-react";
import { PosterWithCategory, CategoryRow } from "@/types/database.types";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatINR } from "@/lib/utils";
import { AdminSpinner } from "../AdminSpinner";

interface PosterTableProps {
  posters: PosterWithCategory[];
  totalCount: number;
  categories: CategoryRow[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onAddPoster: () => void;
  onEditPoster: (poster: PosterWithCategory) => void;
  onDeletePoster: (poster: PosterWithCategory) => void;
  isLoading?: boolean;
}

export const PosterTable: React.FC<PosterTableProps> = ({
  posters,
  totalCount,
  categories,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onAddPoster,
  onEditPoster,
  onDeletePoster,
  isLoading = false,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 sm:p-6 text-charcoal">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Posters</h2>
            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2.5 py-0.5 rounded-full">
              {totalCount} {totalCount === 1 ? "poster" : "posters"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Manage products, pricing variants, and catalog status</p>
        </div>

        <button
          onClick={onAddPoster}
          className="inline-flex items-center justify-center gap-1.5 bg-[#F5B700] hover:bg-[#E5AB00] text-gray-900 font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors shadow-sm self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add poster</span>
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <AdminSpinner label="Loading posters..." fullHeight />
      ) : posters.length === 0 ? (
        <div className="py-16 text-center">
          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-800">No posters found</p>
          <p className="text-xs text-gray-500 mt-1">
            {searchQuery || selectedCategory !== "all"
              ? "Try clearing your search query or filter."
              : 'Click "+ Add poster" to create your first poster.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View (>=md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold text-gray-500 border-b border-gray-100">
                  <th scope="col" className="py-3 px-2">
                    Poster
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Category
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Price
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-2 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posters.map((poster) => {
                  const categoryName = poster.category?.name || "Unassigned";

                  // Display lowest price if variants exist
                  const displayPrice =
                    poster.variants && poster.variants.length > 0
                      ? Math.min(...poster.variants.map((v) => Number(v.price) || 0))
                      : poster.price;

                  return (
                    <tr
                      key={poster.id}
                      className="group hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Thumbnail & Title */}
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200/80 shadow-xs">
                            <SafeImage
                              src={poster.image_path}
                              alt={poster.title}
                              fill
                              sizes="44px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 line-clamp-1">
                              {poster.title}
                            </span>
                            {poster.description && (
                              <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">
                                {poster.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-gray-600 font-medium">
                        {categoryName}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        <div>
                          {poster.variants && poster.variants.length > 1 ? (
                            <span>From {formatINR(displayPrice)}</span>
                          ) : (
                            <span>{formatINR(poster.price)}</span>
                          )}
                          {poster.variants?.some(
                            (v) =>
                              (v.size_code === "A4" || v.variant_name.includes("A4")) &&
                              (v as unknown as { frame_available?: boolean }).frame_available
                          ) && (
                            <span className="block text-[10px] text-amber-700 font-normal">
                              A4 Frame: +₹210
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {poster.is_active ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Inactive
                            </span>
                          )}
                          {poster.is_best_selling && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                              ★ Best Seller
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-2 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onEditPoster(poster)}
                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label={`Edit ${poster.title}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeletePoster(poster)}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            aria-label={`Delete ${poster.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Listing (<md) */}
          <div className="md:hidden divide-y divide-gray-100">
            {posters.map((poster) => {
              const categoryName = poster.category?.name || "Unassigned";

              const displayPrice =
                poster.variants && poster.variants.length > 0
                  ? Math.min(...poster.variants.map((v) => Number(v.price) || 0))
                  : poster.price;

              return (
                <div key={poster.id} className="py-3.5 flex items-start gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-xs">
                    <SafeImage
                      src={poster.image_path}
                      alt={poster.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {poster.title}
                      </h3>
                      <span className="font-bold text-sm text-gray-900 flex-shrink-0">
                        {poster.variants && poster.variants.length > 1
                          ? `From ${formatINR(displayPrice)}`
                          : formatINR(poster.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{categoryName}</span>
                      <span className="text-gray-300">·</span>
                      {poster.is_active ? (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50">
                      <button
                        onClick={() => onEditPoster(poster)}
                        className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 font-medium px-2.5 py-1 rounded-lg bg-gray-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDeletePoster(poster)}
                        className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium px-2.5 py-1 rounded-lg bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
