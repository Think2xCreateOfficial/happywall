"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CategoryRow } from "@/types/database.types";
import { CategoryInput } from "@/services/category.service";
import { ImageUploader } from "../posters/ImageUploader";
import { uploadImage, deleteStorageImage, DEFAULT_FALLBACK_IMAGE } from "@/services/storage.service";
import { parseAppError } from "@/lib/errorHandler";

interface CategoryModalProps {
  isOpen: boolean;
  category?: CategoryRow | null;
  onClose: () => void;
  onSave: (data: CategoryInput) => Promise<boolean>;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  category,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [stagedImageFile, setStagedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(category);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
      setImagePath(category.image_path || "");
      setImagePreviewUrl(category.image_path || "");
      setStagedImageFile(null);
      setIsActive(category.is_active);
      setDisplayOrder(category.display_order || 0);
    } else {
      setName("");
      setDescription("");
      setImagePath("");
      setImagePreviewUrl("");
      setStagedImageFile(null);
      setIsActive(true);
      setDisplayOrder(0);
    }
    setError("");
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    let finalImagePath = imagePath;
    let newlyUploadedStoragePath: string | null = null;

    try {
      // 1. Transactional Save-time Image Upload
      if (stagedImageFile) {
        const uploadRes = await uploadImage(stagedImageFile, "categories");
        if (!uploadRes.success || !uploadRes.publicUrl) {
          setError(uploadRes.error || "Failed to upload category thumbnail. Please try again.");
          setIsSubmitting(false);
          return;
        }

        finalImagePath = uploadRes.storagePath || uploadRes.publicUrl;
        newlyUploadedStoragePath = uploadRes.storagePath || null;
      }

      // 2. Call parent onSave
      const success = await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        image_path: finalImagePath || undefined,
        is_active: isActive,
        display_order: Number(displayOrder) || 0,
      });

      if (!success) {
        if (newlyUploadedStoragePath) {
          await deleteStorageImage(newlyUploadedStoragePath);
        }
      } else {
        onClose();
      }
    } catch (err: unknown) {
      if (newlyUploadedStoragePath) {
        await deleteStorageImage(newlyUploadedStoragePath);
      }
      setError(parseAppError(err, "Failed to save category"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 text-charcoal max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEditing ? "Edit Category" : "Add Category"}
            </h3>
            <p className="text-xs text-gray-500">Configure catalog group and display order</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl animate-in fade-in">
              {error}
            </div>
          )}

          {/* Thumbnail Uploader */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Category Thumbnail
            </label>
            <ImageUploader
              currentImageUrl={imagePreviewUrl}
              stagedFile={stagedImageFile}
              onFileSelected={(file, previewUrl) => {
                setStagedImageFile(file);
                setImagePreviewUrl(previewUrl);
                setError("");
              }}
              label="Upload category image"
              disabled={isSubmitting}
            />
            {stagedImageFile && (
              <p className="text-[11px] text-amber-600 mt-1 font-medium">
                Image staged for upload. Will be stored on save.
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="category-name" className="block text-xs font-semibold text-gray-700 mb-1">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anime, Games, Split Poster"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F5B700] focus:border-transparent transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="category-desc" className="block text-xs font-semibold text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="category-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of this collection"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F5B700] focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Display Order */}
          <div>
            <label htmlFor="category-order" className="block text-xs font-semibold text-gray-700 mb-1">
              Display Order
            </label>
            <input
              id="category-order"
              type="number"
              min="0"
              step="1"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              placeholder="0"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-base sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F5B700] focus:border-transparent transition-all"
            />
          </div>

          {/* Active status */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-sm font-semibold text-gray-800">Active</span>
              <p className="text-xs text-gray-500">Show this category in the public catalog</p>
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

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-gray-900 bg-[#F5B700] hover:bg-[#E5AB00] rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
