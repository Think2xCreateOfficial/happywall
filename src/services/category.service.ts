import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CategoryRow, Database } from "@/types/database.types";
import { COLLECTIONS } from "@/data/collections";
import { parseAppError } from "@/lib/errorHandler";
import { DEFAULT_FALLBACK_IMAGE } from "./storage.service";

export interface CategoryInput {
  name: string;
  slug?: string;
  description?: string;
  image_path?: string;
  is_active?: boolean;
  display_order?: number;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Fallback initial categories matching COLLECTIONS
const DEFAULT_FALLBACK_CATEGORIES: CategoryRow[] = COLLECTIONS.map((c, index) => ({
  id: `cat-${c.slug}`,
  name: c.title,
  slug: c.slug,
  description: c.description,
  image_path: c.image || DEFAULT_FALLBACK_IMAGE,
  is_active: true,
  display_order: index + 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

export async function getCategories(
  includeInactive: boolean = false
): Promise<{ data: CategoryRow[]; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { data: DEFAULT_FALLBACK_CATEGORIES };
  }

  try {
    const supabase = createClient();
    let query = supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (!includeInactive) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("Supabase category fetch warning:", error.message);
      return { data: [], error: parseAppError(error) };
    }

    if (!data || data.length === 0) {
      return { data: [] };
    }

    return { data };
  } catch (err: unknown) {
    return { data: [], error: parseAppError(err) };
  }
}

export async function createCategory(
  input: CategoryInput
): Promise<{ data?: CategoryRow; error?: string }> {
  if (!input.name || input.name.trim().length === 0) {
    return { error: "Category name is required." };
  }

  const slug = input.slug?.trim() || slugify(input.name);

  if (!isSupabaseConfigured()) {
    const fallbackCategory: CategoryRow = {
      id: `local-cat-${Date.now()}`,
      name: input.name.trim(),
      slug,
      description: input.description || null,
      image_path: input.image_path || DEFAULT_FALLBACK_IMAGE,
      is_active: input.is_active ?? true,
      display_order: input.display_order ?? 99,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { data: fallbackCategory };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: input.name.trim(),
        slug,
        description: input.description?.trim() || null,
        image_path: input.image_path || null,
        is_active: input.is_active ?? true,
        display_order: input.display_order ?? 0,
      })
      .select()
      .single();

    if (error) {
      return { error: parseAppError(error) };
    }

    return { data };
  } catch (err: unknown) {
    return { error: parseAppError(err) };
  }
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>
): Promise<{ data?: CategoryRow; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      data: {
        id,
        name: input.name || "Updated Category",
        slug: input.slug || slugify(input.name || "category"),
        description: input.description || null,
        image_path: input.image_path || DEFAULT_FALLBACK_IMAGE,
        is_active: input.is_active ?? true,
        display_order: input.display_order ?? 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
  }

  try {
    const supabase = createClient();
    const updates: Database["public"]["Tables"]["categories"]["Update"] = {};

    if (input.name !== undefined) updates.name = input.name.trim();
    if (input.slug !== undefined) updates.slug = input.slug.trim();
    if (input.description !== undefined) updates.description = input.description.trim() || null;
    if (input.image_path !== undefined) updates.image_path = input.image_path || null;
    if (input.is_active !== undefined) updates.is_active = input.is_active;
    if (input.display_order !== undefined) updates.display_order = input.display_order;

    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { error: parseAppError(error) };
    }

    return { data };
  } catch (err: unknown) {
    return { error: parseAppError(err) };
  }
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = createClient();

    // Check if posters belong to this category
    const { count, error: countError } = await supabase
      .from("posters")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (countError) {
      return { success: false, error: parseAppError(countError) };
    }

    if (count && count > 0) {
      return {
        success: false,
        error: `Cannot delete this category because ${count} poster${
          count > 1 ? "s are" : " is"
        } assigned to it. Please reassign or delete those posters first.`,
      };
    }

    const { error: deleteError } = await supabase.from("categories").delete().eq("id", id);

    if (deleteError) {
      return { success: false, error: parseAppError(deleteError) };
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: parseAppError(err) };
  }
}
