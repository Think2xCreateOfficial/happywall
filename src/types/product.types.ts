export type PosterSize =
  | 'A6'
  | 'A5'
  | 'A4'
  | 'A3'
  | 'A3+'
  | 'Split Set'
  | 'Photo Set'
  | 'Frame Combo'
  | string;

export interface SizeOption {
  id: string;
  name: string;
  dimensions: string;
  price: number;
  inclusions?: string;
}

export type ProductCategory =
  | 'Individual Posters'
  | 'Poster Sets'
  | 'Customized Products'
  | 'Anime'
  | 'Games'
  | 'Split Poster'
  | 'Custom';

export interface ProductCatalogItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  currency: 'INR';
  category: ProductCategory;
  image: string;
  inclusions?: string;
  productType: 'individual' | 'set' | 'customized';
  customizationRequired: boolean;
  available: boolean;
  displayOrder: number;
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
  inclusions?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  aspectRatio?: string;
  tag?: string;
  customizationRequired?: boolean;
}
