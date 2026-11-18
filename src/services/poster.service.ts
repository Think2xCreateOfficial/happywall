import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  PosterRow,
  PosterWithCategory,
  CategoryRow,
  PosterVariantRow,
  Database,
} from "@/types/database.types";
import { slugify } from "./category.service";
import { deleteStorageImage, DEFAULT_FALLBACK_IMAGE } from "./storage.service";
import { parseAppError } from "@/lib/errorHandler";

export interface PosterVariantInput {
  id?: string;
  variant_name: string;
  size_code: string;
  dimensions: string;
  price: number;
  inclusions?: string | null;
  is_active?: boolean;
  display_order?: number;
  frame_available?: boolean;
  frame_price?: number;
}

export interface PosterInput {
  title: string;
  slug?: string;
  category_id: string;
  price: number;
  image_path: string;
  description?: string;
  is_active?: boolean;
  is_best_selling?: boolean;
  display_order?: number;
  variants?: PosterVariantInput[];
}

export const DEFAULT_VARIANT_PRESETS: PosterVariantInput[] = [
  {
    variant_name: "A6 Pocket Size",
    size_code: "A6",
    dimensions: "10.5 × 14.8 cm",
    price: 9,
    inclusions: "1 × A6 Poster Print",
    is_active: true,
    display_order: 1,
    frame_available: false,
    frame_price: 0,
  },
  {
    variant_name: "A5 Compact Size",
    size_code: "A5",
    dimensions: "14.8 × 21.0 cm",
    price: 19,
    inclusions: "1 × A5 Poster Print",
    is_active: true,
    display_order: 2,
    frame_available: false,
    frame_price: 0,
  },
  {
    variant_name: "A4 Standard Size",
    size_code: "A4",
    dimensions: "21.0 × 29.7 cm",
    price: 39,
    inclusions: "1 × A4 Poster Print",
    is_active: true,
    display_order: 3,
    frame_available: true,
    frame_price: 210,
  },
];

export const SPLIT_SET_VARIANT_PRESETS: PosterVariantInput[] = [
  {
    variant_name: "Split Set (3 Panels)",
    size_code: "Split Set",
    dimensions: "3 × (21.0 × 29.7 cm)",
    price: 109,
    inclusions: "3 × A4 size posters",
    is_active: true,
    display_order: 1,
    frame_available: false,
    frame_price: 0,
  },
];

/**
 * Strips internal encoding metadata tags from inclusions text for clean customer display.
 */
export function cleanInclusions(inclusions: string | null | undefined): string {
  if (!inclusions) return "";
  return inclusions
    .replace(/\[NO_FRAME\]/g, "")
    .replace(/\[FRAME_OPT:[^\]]+\]/g, "")
    .trim();
}

/**
 * Parses frame availability, add-on price, and clean inclusions from a variant object.
 * Resilient to both native Supabase column values and fallback metadata-encoded values.
 */
export function parseVariantFrameData(v: {
  size_code?: string;
  variant_name?: string;
  frame_available?: boolean;
  frame_price?: number;
  inclusions?: string | null;
}): { frame_available: boolean; frame_price: number; clean_inclusions: string } {
  const isA4 =
    v.size_code === "A4" ||
    (Boolean(v.variant_name) && v.variant_name!.toLowerCase().includes("a4"));

  const rawInclusions = v.inclusions || "";
  const clean = cleanInclusions(rawInclusions);

  if (!isA4) {
    return { frame_available: false, frame_price: 0, clean_inclusions: clean };
  }

  // Check 1: Explicit boolean column from database (if migrated)
  if (typeof v.frame_available === "boolean") {
    return {
      frame_available: v.frame_available,
      frame_price: v.frame_available ? (Number(v.frame_price) || 210) : 0,
      clean_inclusions: clean,
    };
  }

  // Check 2: Fallback encoded metadata inside inclusions
  if (rawInclusions.includes("[NO_FRAME]")) {
    return { frame_available: false, frame_price: 0, clean_inclusions: clean };
  }

  if (rawInclusions.includes("[FRAME_OPT:")) {
    const match = rawInclusions.match(/\[FRAME_OPT:(\d+(\.\d+)?)\]/);
    const price = match ? Number(match[1]) : 210;
    return { frame_available: true, frame_price: price, clean_inclusions: clean };
  }

  // Check 3: Default for newly created or legacy A4 where frame was enabled
  return { frame_available: true, frame_price: 210, clean_inclusions: clean };
}

/**
 * Encodes frame availability into inclusions as a resilient fallback in case
 * the database table does not yet have frame_available / frame_price columns.
 */
export function encodeVariantInclusions(
  inclusions: string | null | undefined,
  isA4: boolean,
  hasFrame: boolean,
  framePrice: number
): string {
  const clean = cleanInclusions(inclusions);

  if (!isA4) return clean;

  if (hasFrame) {
    return clean ? `${clean} [FRAME_OPT:${framePrice}]` : `1 × A4 Poster Print [FRAME_OPT:${framePrice}]`;
  } else {
    return clean ? `${clean} [NO_FRAME]` : `1 × A4 Poster Print [NO_FRAME]`;
  }
}

// Fallback initial posters matching reference screenshot
const DEFAULT_FALLBACK_POSTERS: PosterWithCategory[] = [
  {
    id: "p-gojo-blue",
    title: "Gojo Blue",
    slug: "gojo-blue",
    category_id: "cat-anime",
    price: 99,
    image_path: "posters/anime/gojo-blue.webp",
    description: "Anime character poster",
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "cat-anime",
      name: "Anime",
      slug: "anime",
      description: "Vibrant high-contrast fine art prints",
      image_path: "categories/anime/anime.webp",
      is_active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    variants: [
      {
        id: "v-gojo-a6",
        poster_id: "p-gojo-blue",
        variant_name: "A6 Pocket Size",
        size_code: "A6",
        dimensions: "10.5 × 14.8 cm",
        price: 9,
        inclusions: "1 × A6 Poster Print",
        is_active: true,
        display_order: 1,
        frame_available: false,
        frame_price: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "v-gojo-a5",
        poster_id: "p-gojo-blue",
        variant_name: "A5 Compact Size",
        size_code: "A5",
        dimensions: "14.8 × 21.0 cm",
        price: 19,
        inclusions: "1 × A5 Poster Print",
        is_active: true,
        display_order: 2,
        frame_available: false,
        frame_price: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "v-gojo-a4",
        poster_id: "p-gojo-blue",
        variant_name: "A4 Standard Size",
        size_code: "A4",
        dimensions: "21.0 × 29.7 cm",
        price: 39,
        inclusions: "1 × A4 Poster Print",
        is_active: true,
        display_order: 3,
        frame_available: true,
        frame_price: 210,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "p-pixel-world",
    title: "Pixel World",
    slug: "pixel-world",
    category_id: "cat-games",
    price: 149,
    image_path: "posters/games/pixel-world.webp",
    description: "Battlestation and RGB-ready pixel art poster",
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "cat-games",
      name: "Games",
      slug: "games",
      description: "Battlestation & RGB gaming prints",
      image_path: "categories/games/games.webp",
      is_active: true,
      display_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    variants: [
      {
        id: "v-pixel-a6",
        poster_id: "p-pixel-world",
        variant_name: "A6 Pocket Size",
        size_code: "A6",
        dimensions: "10.5 × 14.8 cm",
        price: 9,
        inclusions: "1 × A6 Poster Print",
        is_active: true,
        display_order: 1,
        frame_available: false,
        frame_price: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "v-pixel-a5",
        poster_id: "p-pixel-world",
        variant_name: "A5 Compact Size",
        size_code: "A5",
        dimensions: "14.8 × 21.0 cm",
        price: 19,
        inclusions: "1 × A5 Poster Print",
        is_active: true,
        display_order: 2,
        frame_available: false,
        frame_price: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "v-pixel-a4",
        poster_id: "p-pixel-world",
        variant_name: "A4 Standard Size",
        size_code: "A4",
        dimensions: "21.0 × 29.7 cm",
        price: 39,
        inclusions: "1 × A4 Poster Print",
        is_active: true,
        display_order: 3,
        frame_available: true,
        frame_price: 210,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "p-midnight-split",
    title: "Midnight Split",
    slug: "midnight-split",
    category_id: "cat-split-poster",
    price: 109,
    image_path: "posters/split-poster/midnight-split.webp",
    description: "Signature 3-panel continuous panoramic poster set",
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "cat-split-poster",
      name: "Split Poster",
      slug: "split-poster",
      description: "3-panel continuous panoramic poster set",
      image_path: "categories/split-poster/split-poster.webp",
      is_active: true,
      display_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    variants: [
      {
        id: "v-midnight-split",
        poster_id: "p-midnight-split",
        variant_name: "Split Set (3 Panels)",
        size_code: "Split Set",
        dimensions: "3 × (21.0 × 29.7 cm)",
        price: 109,
        inclusions: "3 × A4 size posters",
        is_active: true,
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "p-stay-curious",
    title: "Stay Curious",
    slug: "stay-curious",
    category_id: "cat-anime",
    price: 79,
    image_path: "posters/anime/stay-curious.webp",
    description: "Minimalist graphic typography art poster",
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "cat-anime",
      name: "Anime",
      slug: "anime",
      description: "Vibrant high-contrast fine art prints",
      image_path: "categories/anime/anime.webp",
      is_active: true,
      display_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

export async function getPosters(options?: {
  categoryId?: string;
  includeInactive?: boolean;
  searchQuery?: string;
  isBestSelling?: boolean;
}): Promise<{ data: PosterWithCategory[]; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { data: [] };
  }

  try {
    const supabase = createClient();
    let query = supabase
      .from("posters")
      .select("*, category:categories(*), variants:poster_variants(*)")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (options?.categoryId && options.categoryId !== "all") {
      query = query.eq("category_id", options.categoryId);
    }

    if (!options?.includeInactive) {
      query = query.eq("is_active", true);
    }

    if (options?.searchQuery && options.searchQuery.trim()) {
      query = query.ilike("title", `%${options.searchQuery.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("Supabase posters query warning:", error.message);
      // Try querying without variants in case poster_variants table migration is not applied yet
      const { data: simpleData, error: simpleError } = await supabase
        .from("posters")
        .select("*, category:categories(*)")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (simpleError) {
        return { data: [], error: parseAppError(simpleError) };
      }

      let formatted: PosterWithCategory[] = ((simpleData || []) as unknown[]).map((raw) => {
        const item = raw as PosterRow & { category: CategoryRow | CategoryRow[] };
        return {
          ...item,
          category: Array.isArray(item.category) ? item.category[0] : item.category,
          variants: [],
        };
      });

      if (options?.isBestSelling) {
        formatted = formatted.filter((p) => p.is_best_selling || p.display_order <= 6);
      }

      return { data: formatted };
    }

    if (!data || data.length === 0) {
      return { data: [] };
    }

    // Cast the returned structure safely
    let formatted: PosterWithCategory[] = (data as unknown[]).map((raw) => {
      const item = raw as PosterRow & {
        category: CategoryRow | CategoryRow[];
        variants: PosterVariantRow[];
      };
      const rawVariants = item.variants || [];
      const normalizedVariants = rawVariants.map((v) => {
        const parsed = parseVariantFrameData(v);
        return {
          ...v,
          inclusions: parsed.clean_inclusions,
          frame_available: parsed.frame_available,
          frame_price: parsed.frame_price,
        };
      });

      return {
        ...item,
        category: Array.isArray(item.category) ? item.category[0] : item.category,
        variants: normalizedVariants,
      };
    });

    if (options?.isBestSelling) {
      formatted = formatted.filter((p) => p.is_best_selling || p.display_order <= 6);
    }

    return { data: formatted };
  } catch (err: unknown) {
    return { data: [], error: parseAppError(err) };
  }
}

export async function createPoster(
  input: PosterInput
): Promise<{ data?: PosterRow; error?: string }> {
  if (!input.title || input.title.trim().length === 0) {
    return { error: "Poster title is required." };
  }

  if (!input.category_id) {
    return { error: "A category must be selected." };
  }

  if (typeof input.price !== "number" || isNaN(input.price) || input.price < 0) {
    return { error: "Price must be a valid non-negative number." };
  }

  if (!input.image_path) {
    return { error: "An image must be uploaded for the poster." };
  }

  const slug = input.slug?.trim() || slugify(input.title) + "-" + Date.now().toString(36);

  if (!isSupabaseConfigured()) {
    const fallback: PosterRow = {
      id: `local-poster-${Date.now()}`,
      title: input.title.trim(),
      slug,
      category_id: input.category_id,
      description: input.description?.trim() || null,
      price: input.price,
      image_path: input.image_path,
      is_active: input.is_active ?? true,
      display_order: input.display_order ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { data: fallback };
  }

  try {
    const supabase = createClient();
    const insertPayload: Record<string, unknown> = {
      title: input.title.trim(),
      slug,
      category_id: input.category_id,
      description: input.description?.trim() || null,
      price: input.price,
      image_path: input.image_path,
      is_active: input.is_active ?? true,
      display_order: input.display_order ?? 0,
    };
    if (input.is_best_selling !== undefined) {
      insertPayload.is_best_selling = input.is_best_selling;
    }

    let { data: posterData, error: posterError } = await supabase
      .from("posters")
      .insert(insertPayload as any)
      .select()
      .single();

    if (posterError && (posterError.code === "42703" || posterError.message?.includes("is_best_selling"))) {
      delete insertPayload.is_best_selling;
      const retry = await supabase
        .from("posters")
        .insert(insertPayload as any)
        .select()
        .single();
      posterData = retry.data;
      posterError = retry.error;
    }

    if (posterError) {
      return { error: parseAppError(posterError) };
    }

    // Save variants if provided
    if (input.variants && input.variants.length > 0 && posterData?.id) {
      const variantsToInsert = input.variants.map((v, idx) => {
        const isA4 = v.size_code === "A4" || v.variant_name.toLowerCase().includes("a4");
        const hasFrame = isA4 && Boolean(v.frame_available);
        const framePrice = hasFrame ? Number(v.frame_price || 210) : 0;
        const encodedInclusions = encodeVariantInclusions(v.inclusions, isA4, hasFrame, framePrice);

        return {
          poster_id: posterData.id,
          variant_name: v.variant_name,
          size_code: v.size_code,
          dimensions: v.dimensions,
          price: v.price,
          inclusions: encodedInclusions || null,
          is_active: v.is_active ?? true,
          display_order: v.display_order ?? idx + 1,
          frame_available: hasFrame,
          frame_price: framePrice,
        };
      });

      const { error: variantError } = await supabase
        .from("poster_variants")
        .insert(variantsToInsert);

      if (variantError) {
        if (variantError.code === "42703" || variantError.message?.includes("frame_")) {
          // If frame columns not yet migrated in database, retry with core fields
          const fallback = variantsToInsert.map((item) => ({
            poster_id: item.poster_id,
            variant_name: item.variant_name,
            size_code: item.size_code,
            dimensions: item.dimensions,
            price: item.price,
            inclusions: item.inclusions,
            is_active: item.is_active,
            display_order: item.display_order,
          }));
          await supabase.from("poster_variants").insert(fallback);
        } else {
          console.warn("Could not insert variants (migration might be pending):", variantError.message);
        }
      }
    }

    return { data: posterData || undefined };
  } catch (err: unknown) {
    return { error: parseAppError(err) };
  }
}

export async function updatePoster(
  id: string,
  input: Partial<PosterInput>
): Promise<{ data?: PosterRow; error?: string }> {
  if (input.price !== undefined && (isNaN(input.price) || input.price < 0)) {
    return { error: "Price must be a valid non-negative number." };
  }

  if (!isSupabaseConfigured()) {
    return {
      data: {
        id,
        title: input.title || "Updated Poster",
        slug: input.slug || slugify(input.title || "poster"),
        category_id: input.category_id || "cat-anime",
        description: input.description || null,
        price: input.price ?? 99,
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
    const updates: Database["public"]["Tables"]["posters"]["Update"] = {};

    if (input.title !== undefined) updates.title = input.title.trim();
    if (input.slug !== undefined) updates.slug = input.slug.trim();
    if (input.category_id !== undefined) updates.category_id = input.category_id;
    if (input.description !== undefined) updates.description = input.description.trim() || null;
    if (input.price !== undefined) updates.price = input.price;
    if (input.image_path !== undefined) updates.image_path = input.image_path;
    if (input.is_active !== undefined) updates.is_active = input.is_active;
    if (input.is_best_selling !== undefined) updates.is_best_selling = input.is_best_selling;
    if (input.display_order !== undefined) updates.display_order = input.display_order;

    let { data: posterData, error: posterError } = await supabase
      .from("posters")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (posterError && (posterError.code === "42703" || posterError.message?.includes("is_best_selling"))) {
      delete updates.is_best_selling;
      const retry = await supabase
        .from("posters")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      posterData = retry.data;
      posterError = retry.error;
    }

    if (posterError) {
      return { error: parseAppError(posterError) };
    }

    // Update variants if provided
    if (input.variants !== undefined) {
      // Delete existing variants for this poster and re-insert updated set
      const { error: delError } = await supabase
        .from("poster_variants")
        .delete()
        .eq("poster_id", id);

      if (!delError && input.variants.length > 0) {
        const variantsToInsert = input.variants.map((v, idx) => {
          const isA4 = v.size_code === "A4" || v.variant_name.toLowerCase().includes("a4");
          const hasFrame = isA4 && Boolean(v.frame_available);
          const framePrice = hasFrame ? Number(v.frame_price || 210) : 0;
          const encodedInclusions = encodeVariantInclusions(v.inclusions, isA4, hasFrame, framePrice);

          return {
            poster_id: id,
            variant_name: v.variant_name,
            size_code: v.size_code,
            dimensions: v.dimensions,
            price: v.price,
            inclusions: encodedInclusions || null,
            is_active: v.is_active ?? true,
            display_order: v.display_order ?? idx + 1,
            frame_available: hasFrame,
            frame_price: framePrice,
          };
        });

        const { error: insError } = await supabase.from("poster_variants").insert(variantsToInsert);
        if (insError && (insError.code === "42703" || insError.message?.includes("frame_"))) {
          const fallback = variantsToInsert.map((item) => ({
            poster_id: item.poster_id,
            variant_name: item.variant_name,
            size_code: item.size_code,
            dimensions: item.dimensions,
            price: item.price,
            inclusions: item.inclusions,
            is_active: item.is_active,
            display_order: item.display_order,
          }));
          await supabase.from("poster_variants").insert(fallback);
        }
      }
    }

    return { data: posterData || undefined };
  } catch (err: unknown) {
    return { error: parseAppError(err) };
  }
}

export async function deletePoster(
  id: string,
  deleteImage: boolean = false
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = createClient();

    // Fetch poster row first if we need to remove the image file
    let imageToDelete: string | null = null;
    if (deleteImage) {
      const { data: poster } = await supabase
        .from("posters")
        .select("image_path")
        .eq("id", id)
        .single();
      imageToDelete = poster?.image_path || null;
    }

    const { error: deleteError } = await supabase.from("posters").delete().eq("id", id);

    if (deleteError) {
      return { success: false, error: parseAppError(deleteError) };
    }

    // Safely delete image if not referenced by another poster
    if (deleteImage && imageToDelete && imageToDelete.startsWith("posters/")) {
      const { count } = await supabase
        .from("posters")
        .select("id", { count: "exact", head: true })
        .eq("image_path", imageToDelete);

      if (count === 0) {
        await deleteStorageImage(imageToDelete);
      }
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: parseAppError(err) };
  }
}
