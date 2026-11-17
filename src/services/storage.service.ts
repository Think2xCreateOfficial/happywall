import { createClient } from "@/lib/supabase/client";
import {
  SUPABASE_URL,
  SUPABASE_STORAGE_BUCKET,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

export const DEFAULT_FALLBACK_IMAGE = "/images/default-fallback_image.webp";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  storagePath?: string;
  error?: string;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file format. Please upload a JPG, PNG, or WebP image.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  return { valid: true };
}

/**
 * Uploads an image directly to Supabase Storage under a specified category/folder path.
 * Category images save to: categories/{folder}/{filename}
 * Poster images save to: posters/{folder}/{filename}
 */
export async function uploadImage(
  file: File,
  folder: string = "products"
): Promise<UploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  if (!isSupabaseConfigured()) {
    // If Supabase is not configured yet, generate a client-side object URL for preview
    const previewUrl = URL.createObjectURL(file);
    return {
      success: true,
      publicUrl: previewUrl,
      storagePath: `posters/${folder}/local-${Date.now()}-${file.name}`,
    };
  }

  try {
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
    const uniqueId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 10);
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const fileName = `${Date.now()}-${uniqueId}.${ext}`;

    const storagePath = sanitizedFolder.startsWith("categories")
      ? `${sanitizedFolder}/${fileName}`
      : `posters/${sanitizedFolder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${storagePath}`;

    return {
      success: true,
      publicUrl,
      storagePath,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Image upload failed";
    return { success: false, error: message };
  }
}

/**
 * Rollback / delete an uploaded image in Supabase storage.
 */
export async function deleteStorageImage(storagePath: string): Promise<boolean> {
  if (
    !isSupabaseConfigured() ||
    (!storagePath.startsWith("posters/") && !storagePath.startsWith("categories/"))
  ) {
    return false;
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      console.warn("Could not delete image from Supabase storage:", error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Centralized Image URL Resolver for Happy Walls
 * Supabase Storage is the single source of truth for dynamic category and poster images.
 * 
 * Handles:
 * 1. Supabase Storage paths (posters/*, categories/*) -> Returns public Supabase Storage CDN URL
 * 2. Already fully qualified HTTP/HTTPS URLs
 * 3. Client object URLs (blob: / data:)
 * 4. Local static assets (/images/*)
 * 5. Fallback placeholder for missing or invalid images
 */
export function resolveImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath || imagePath.trim() === "") {
    return DEFAULT_FALLBACK_IMAGE;
  }

  const clean = imagePath.trim();

  // Already a full HTTP or HTTPS URL (e.g. direct Supabase public URL or external CDN)
  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("blob:") ||
    clean.startsWith("data:")
  ) {
    return clean;
  }

  // Local static asset
  if (clean.startsWith("/")) {
    return clean;
  }

  // Supabase Storage object path (e.g. posters/anime/xyz.webp, categories/anime/xyz.webp)
  if (
    clean.startsWith("posters/") ||
    clean.startsWith("categories/") ||
    clean.startsWith("default/")
  ) {
    if (isSupabaseConfigured()) {
      return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${clean}`;
    }
    return DEFAULT_FALLBACK_IMAGE;
  }

  // If path begins with bucket name prefix
  if (clean.startsWith(`${SUPABASE_STORAGE_BUCKET}/`)) {
    const subPath = clean.replace(`${SUPABASE_STORAGE_BUCKET}/`, "");
    if (isSupabaseConfigured()) {
      return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${subPath}`;
    }
  }

  return DEFAULT_FALLBACK_IMAGE;
}
