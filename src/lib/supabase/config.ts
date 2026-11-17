/**
 * Supabase Configuration & Environment Validation
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const SUPABASE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "happy-walls-posters";

export function isSupabaseConfigured(): boolean {
  return (
    typeof SUPABASE_URL === "string" &&
    SUPABASE_URL.trim().length > 0 &&
    typeof SUPABASE_ANON_KEY === "string" &&
    SUPABASE_ANON_KEY.trim().length > 0 &&
    !SUPABASE_URL.includes("your-project-id")
  );
}
