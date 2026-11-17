"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown, Plus, Trash2, Sparkles, Layers } from "lucide-react";
import { CategoryRow, PosterWithCategory } from "@/types/database.types";
import {
  PosterInput,
  PosterVariantInput,
  DEFAULT_VARIANT_PRESETS,
  SPLIT_SET_VARIANT_PRESETS,
} from "@/services/poster.service";
import { ImageUploader } from "./ImageUploader";
import { uploadImage, deleteStorageImage } from "@/services/storage.service";
import { parseAppError } from "@/lib/errorHandler";

interface PosterDrawerProps {
  isOpen: boolean;
  poster?: PosterWithCategory | null;
  categories: CategoryRow[];
  onClose: () => void;
  onSave: (data: PosterInput) => Promise<boolean>;
}

export const PosterDrawer: React.FC<PosterDrawerProps> = ({
  isOpen,
  poster,
  categories,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [stagedImageFile, setStagedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [isBestSelling, setIsBestSelling] = useState(false);
  const [variants, setVariants] = useState<PosterVariantInput[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(poster);

  useEffect(() => {
    if (poster) {
      setTitle(poster.title);
      setDescription(poster.description || "");
      setPrice(poster.price);
      setCategoryId(poster.category_id);
      setImagePath(poster.image_path);
      setImagePreviewUrl(poster.image_path);
      setStagedImageFile(null);
      setIsActive(poster.is_active);
      setIsBestSelling(poster.is_best_selling ?? false);
      setVariants(
        poster.variants && poster.variants.length > 0
          ? poster.variants.map((v) => ({
              id: v.id,
              variant_name: v.variant_name,
              size_code: v.size_code,
              dimensions: v.dimensions,
              price: Number(v.price),
              inclusions: v.inclusions,
              is_active: v.is_active,
              display_order: v.display_order,
            }))
          : []
      );
    } else {
      setTitle("");
      setDescription("");
      setPrice(39);
      setCategoryId(categories.length > 0 ? categories[0].id : "");
      setImagePath("");
      setImagePreviewUrl("");
      setStagedImageFile(null);
      setIsActive(true);
      // Preload standard presets for new poster
      setVariants(DEFAULT_VARIANT_PRESETS.map((v) => ({ ...v })));
    }
    setError("");
  }, [poster, categories, isOpen]);

  if (!isOpen) return null;

  const handleApplyPresets = (presetType: "standard" | "split") => {
    if (presetType === "standard") {
      setVariants(DEFAULT_VARIANT_PRESETS.map((v) => ({ ...v })));
      setPrice(9);
    } else {
      setVariants(SPLIT_SET_VARIANT_PRESETS.map((v) => ({ ...v })));
      setPrice(109);
    }
  };

  const handleAddCustomVariant = () => {
    const newVariant: PosterVariantInput = {
      variant_name: "Custom Size",
      size_code: "Custom",
      dimensions: "Dimensions here",
      price: typeof price === "number" ? price : 49,
      inclusions: "1 × Poster Print",
      is_active: true,
      display_order: variants.length + 1,
    };
    setVariants((prev) => [...prev, newVariant]);
  };

  const handleUpdateVariant = (
    index: number,
    field: keyof PosterVariantInput,
    value: string | number | boolean | null
  ) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagePath && !stagedImageFile) {
      setError("Please select or upload an image for the poster.");
      return;
    }

    if (!title.trim()) {
      setError("Poster title is required.");
      return;
    }

    if (price === "" || isNaN(Number(price)) || Number(price) < 0) {
      setError("Please enter a valid non-negative base price in INR.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    let finalImagePath = imagePath;
    let newlyUploadedStoragePath: string | null = null;

    try {
      // 1. Transactional Save-time Image Upload
      if (stagedImageFile) {
        const selectedCategory = categories.find((c) => c.id === categoryId);
        const folderSlug = selectedCategory?.slug || "general";
        const uploadRes = await uploadImage(stagedImageFile, folderSlug);

        if (!uploadRes.success || !uploadRes.publicUrl) {
          setError(uploadRes.error || "Failed to upload image. Please try again.");
          setIsSubmitting(false);
          return;
        }

        finalImagePath = uploadRes.storagePath || uploadRes.publicUrl;
        newlyUploadedStoragePath = uploadRes.storagePath || null;
      }

      // 2. Enforce business rule: Frames are strictly available for A4 posters only
      const sanitizedVariants = variants.map((v) => {
        const isA4 = v.size_code === "A4" || v.variant_name.toLowerCase().includes("a4");
        return {
          ...v,
          frame_available: isA4 ? Boolean(v.frame_available ?? true) : false,
          frame_price: isA4 && (v.frame_available ?? true) ? Number(v.frame_price ?? 210) : 0,
        };
      });

      // 3. Call parent onSave
      const success = await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        price: Number(price),
        category_id: categoryId,
        image_path: finalImagePath,
        is_active: isActive,
        is_best_selling: isBestSelling,
        variants: sanitizedVariants.length > 0 ? sanitizedVariants : undefined,
      });

      if (!success) {
        // Rollback uploaded image if database save did not succeed
        if (newlyUploadedStoragePath) {
          await deleteStorageImage(newlyUploadedStoragePath);
        }
      } else {
        onClose();
      }
    } catch (err: unknown) {
      // Rollback on error
      if (newlyUploadedStoragePath) {
        await deleteStorageImage(newlyUploadedStoragePath);
      }
      setError(parseAppError(err, "Failed to save poster. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} />

      {/* Mobile-safe wrapper: pl-0 sm:pl-10 eliminates horizontal overflow on <=480px viewports */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
        <div className="w-screen max-w-md pointer-events-auto bg-white shadow-2xl border-l border-gray-100 flex flex-col text-charcoal relative animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isEditing ? "Edit Poster" : "Add Poster"}
              </h2>
              <p className="text-xs text-gray-500">Configure artwork, details & size pricing</p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
            {error && (
              <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl animate-in fade-in">
                {error}
              </div>
            )}

            {/* Poster Image Upload (Save-time staging) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Poster Image <span className="text-rose-500">*</span>
              </label>
              <ImageUploader
                currentImageUrl={imagePreviewUrl}
                stagedFile={stagedImageFile}
                onFileSelected={(file, previewUrl) => {
                  setStagedImageFile(file);
                  setImagePreviewUrl(previewUrl);
                  setError("");
                }}
                disabled={isSubmitting}
              />
              {stagedImageFile && (
                <p className="text-[11px] text-amber-600 mt-1 font-medium">
                  Image staged for upload. Will be stored securely on save.
                </p>
              )}
            </div>

            {/* Poster Title - text-base sm:text-sm avoids iOS Safari zoom */}
            <div>
              <label htmlFor="poster-title" className="block text-xs font-semibold text-gray-700 mb-1">
                Poster title <span className="text-rose-500">*</span>
              </label>
              <input
                id="poster-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Gojo Blue, Pixel World"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F5B700] focus:border-transparent transition-all"
              />
            </div>

            {/* Description (optional) */}
            <div>
              <label htmlFor="poster-desc" className="block text-xs font-semibold text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="poster-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the art print"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F5B700] focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Category Select */}
            <div>
              <label htmlFor="poster-cat" className="block text-xs font-semibold text-gray-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="poster-cat"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full appearance-none px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F5B700] focus:border-transparent transition-all pr-10"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Base Starting Price (INR) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="poster-price" className="block text-xs font-semibold text-gray-700">
                  Base / Starting Price (₹) <span className="text-rose-500">*</span>
                </label>
                {variants.length > 0 && (
                  <span className="text-[11px] text-gray-400">
                    Min variant: ₹{Math.min(...variants.map((v) => Number(v.price) || 0))}
                  </span>
                )}
              </div>
              <input
                id="poster-price"
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="99"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F5B700] focus:border-transparent transition-all"
              />
            </div>

            {/* Size & Pricing Variants Section */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#F5B700]" />
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Size & Pricing Options
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomVariant}
                  className="text-xs font-semibold text-[#B8860B] hover:text-[#996F00] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Size</span>
                </button>
              </div>

              {/* Quick Presets Buttons */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => handleApplyPresets("standard")}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors font-medium"
                >
                  Load A6/A5/A4
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresets("split")}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors font-medium"
                >
                  Load Split Set (₹109)
                </button>
              </div>

              {/* Variants List */}
              {variants.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">
                  No specific size variants. The base price above will be applied.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {variants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={variant.variant_name}
                          onChange={(e) =>
                            handleUpdateVariant(idx, "variant_name", e.target.value)
                          }
                          placeholder="e.g. A6 Pocket Size"
                          className="flex-1 font-semibold text-xs text-gray-900 bg-white px-2 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#F5B700]"
                          required
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500 font-semibold">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={variant.price}
                            onChange={(e) =>
                              handleUpdateVariant(idx, "price", Number(e.target.value))
                            }
                            placeholder="Price"
                            className="w-16 text-xs font-bold text-gray-900 bg-white px-2 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#F5B700]"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors"
                          title="Remove variant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={variant.dimensions}
                          onChange={(e) =>
                            handleUpdateVariant(idx, "dimensions", e.target.value)
                          }
                          placeholder="Dimensions (e.g. 10.5 × 14.8 cm)"
                          className="text-[11px] text-gray-600 bg-white px-2 py-1 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#F5B700]"
                        />
                        <input
                          type="text"
                          value={variant.inclusions || ""}
                          onChange={(e) =>
                            handleUpdateVariant(idx, "inclusions", e.target.value)
                          }
                          placeholder="Inclusions (e.g. 1 × Poster)"
                          className="text-[11px] text-gray-600 bg-white px-2 py-1 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#F5B700]"
                        />
                      </div>

                      {/* Frame Configuration: Strictly for A4 */}
                      {(variant.size_code === "A4" || variant.variant_name.toLowerCase().includes("a4")) ? (
                        <div className="pt-2 border-t border-gray-200/60 bg-amber-50/60 p-2 rounded-lg mt-1">
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={variant.frame_available ?? true}
                                onChange={(e) =>
                                  handleUpdateVariant(idx, "frame_available", e.target.checked)
                                }
                                className="w-3.5 h-3.5 rounded text-[#F5B700] focus:ring-[#F5B700] border-gray-300"
                              />
                              <span className="text-[11px] font-bold text-gray-800">
                                Optional Frame (A4 Only)
                              </span>
                            </label>

                            {(variant.frame_available ?? true) && (
                              <div className="flex items-center gap-1 text-[11px]">
                                <span className="text-gray-500 font-medium">Add-on: ₹</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={variant.frame_price ?? 210}
                                  onChange={(e) =>
                                    handleUpdateVariant(idx, "frame_price", Number(e.target.value))
                                  }
                                  className="w-14 text-[11px] font-bold text-gray-900 bg-white px-1.5 py-0.5 rounded border border-gray-200 text-right focus:outline-none focus:ring-1 focus:ring-[#F5B700]"
                                />
                                <span className="text-amber-800 font-bold ml-1">
                                  = ₹{Number(variant.price || 0) + Number(variant.frame_price ?? 210)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="pt-1 text-[10px] text-gray-400 italic">
                          Frame add-on disabled (available strictly for A4 size)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Toggle Switch */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-sm font-semibold text-gray-800">Active</span>
                <p className="text-xs text-gray-500">Show this poster in the public store catalog</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5B700] ${
                  isActive ? "bg-[#F5B700]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Best Seller Toggle Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <span className="text-sm font-semibold text-gray-800">Best Seller</span>
                <p className="text-xs text-gray-500">Feature this poster in the Best Selling carousel</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isBestSelling}
                onClick={() => setIsBestSelling(!isBestSelling)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#F5B700] ${
                  isBestSelling ? "bg-[#F5B700]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isBestSelling ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3 pb-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-semibold text-gray-900 bg-[#F5B700] hover:bg-[#E5AB00] rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save poster"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
