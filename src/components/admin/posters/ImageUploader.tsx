"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, AlertCircle, X, CheckCircle2 } from "lucide-react";
import {
  uploadImage,
  resolveImageUrl,
  validateImageFile,
  DEFAULT_FALLBACK_IMAGE,
} from "@/services/storage.service";

interface ImageUploaderProps {
  currentImageUrl?: string;
  stagedFile?: File | null;
  onFileSelected?: (file: File | null, previewUrl: string) => void;
  onImageUploaded?: (url: string, storagePath?: string) => void;
  folder?: string;
  label?: string;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  stagedFile,
  onFileSelected,
  onImageUploaded,
  folder = "products",
  label = "Upload poster image",
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || "");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [stagedFileName, setStagedFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if currentImageUrl or stagedFile changes externally
  useEffect(() => {
    if (stagedFile) {
      const objUrl = URL.createObjectURL(stagedFile);
      setPreviewUrl(objUrl);
      setStagedFileName(stagedFile.name);
      return () => {
        URL.revokeObjectURL(objUrl);
      };
    } else if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
      setStagedFileName("");
    } else {
      setPreviewUrl("");
      setStagedFileName("");
    }
  }, [currentImageUrl, stagedFile]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage("");

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || "Invalid file format or size.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Save-time mode: if parent provided onFileSelected, stage the file and create local object URL
    if (onFileSelected) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setStagedFileName(file.name);
      onFileSelected(file, localUrl);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Fallback immediate upload mode
    setIsUploading(true);
    try {
      const result = await uploadImage(file, folder);
      if (!result.success || !result.publicUrl) {
        setErrorMessage(result.error || "Failed to upload image. Please try again.");
      } else {
        setPreviewUrl(result.publicUrl);
        if (onImageUploaded) {
          onImageUploaded(result.publicUrl, result.storagePath);
        }
      }
    } catch {
      setErrorMessage("An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl("");
    setStagedFileName("");
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onFileSelected) {
      onFileSelected(null, "");
    }
    if (onImageUploaded) {
      onImageUploaded("", "");
    }
  };

  const displaySrc = previewUrl ? resolveImageUrl(previewUrl) : DEFAULT_FALLBACK_IMAGE;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Thumbnail Preview */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/90 flex-shrink-0 shadow-xs group">
          <Image
            src={displaySrc}
            alt="Preview"
            fill
            sizes="96px"
            className="object-cover"
            unoptimized
            onError={(e) => {
              // Graceful fallback to default graphic placeholder
              (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
            }}
          />
          {previewUrl && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
              title="Remove image"
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Upload Dropzone */}
        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`flex-1 border-2 border-dashed rounded-xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            disabled || isUploading
              ? "bg-gray-50 border-gray-300 cursor-not-allowed opacity-75"
              : "border-gray-200 hover:border-[#F5B700] hover:bg-amber-50/20 active:scale-[0.99]"
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled && !isUploading) {
              fileInputRef.current?.click();
            }
          }}
          aria-label={label}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-1.5">
              <span className="w-5 h-5 border-2 border-[#F5B700] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <div className="p-1.5 rounded-full bg-amber-50 text-amber-700">
                <UploadCloud className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-800">
                {stagedFileName ? (
                  <span className="text-amber-800 font-medium line-clamp-1 max-w-[180px] sm:max-w-xs">
                    {stagedFileName}
                  </span>
                ) : previewUrl ? (
                  "Replace image"
                ) : (
                  label
                )}
              </p>
              <p className="text-[10px] sm:text-[11px] text-gray-400">
                JPG, PNG or WebP · Max 5MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="flex items-center gap-2 text-rose-600 text-xs bg-rose-50 px-3 py-2 rounded-lg border border-rose-200 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
