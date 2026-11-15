export type PosterSize = 'A5' | 'A4' | 'A3' | 'A3+';

export interface SizeOption {
  id: PosterSize;
  name: string;
  dimensions: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  altImage?: string;
  basePrice: number;
  availableSizes: SizeOption[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  aspectRatio?: string;
  tag?: string;
}

