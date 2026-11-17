import { resolveImageUrl } from "@/services/storage.service";

/**
 * Adapter for backward compatibility.
 * Supabase Storage is the single source of truth for dynamically managed posters and categories.
 * All image resolution is routed through the centralized Supabase Storage resolver.
 */
export function getDriveImageUrl(imagePath: string): string {
  return resolveImageUrl(imagePath);
}
