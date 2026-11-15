export type CollectionCategorySlug = "all" | "anime" | "games" | "split-poster";

export interface PosterCollectionItem {
  id: string;
  slug: string;
  title: string;
  category: "Anime" | "Games" | "Split Poster";
  categorySlug: "anime" | "games" | "split-poster";
  image: string;
  badge?: string;
  sizeText: string;
  price: number;
  inclusions?: string;
  whatsappMessage: string;
}

export interface CategoryCollection {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  iconName: string;
  badge?: string;
  featuredCount?: string;
  whatsappMessage: string;
}
