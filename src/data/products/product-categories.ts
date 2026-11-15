export interface ProductCategoryDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  badge?: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryDefinition[] = [
  {
    id: "all",
    name: "All Products",
    slug: "all",
    description: "Browse the complete Happy Walls catalog of individual posters, triptych sets, and custom framed prints.",
  },
  {
    id: "anime",
    name: "Anime",
    slug: "anime",
    description: "Vibrant high-contrast fine art prints of Demon Slayer, Naruto, and shonen icons.",
    badge: "Trending",
  },
  {
    id: "games",
    name: "Games",
    slug: "games",
    description: "Battlestation and RGB-ready gaming aesthetic posters for modern setups.",
    badge: "Popular",
  },
  {
    id: "split-poster",
    name: "Split Poster",
    slug: "split-poster",
    description: "Signature 3-piece continuous triptychs with 3 × A4 size posters.",
    badge: "Signature",
  },
  {
    id: "custom",
    name: "Custom & Sets",
    slug: "custom",
    description: "Personalized Spotify photo sets and custom poster with frame combos.",
    badge: "Custom",
  },
];
