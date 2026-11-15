import { PosterSize } from './product';

export type CustomPosterType =
  | 'Anime'
  | 'Games'
  | 'Split Poster'
  | 'Motivational Posters'
  | 'Custom Design'
  | 'Other';

export type CustomPosterSizeChoice =
  | 'A5'
  | 'A4'
  | 'A3'
  | 'A2'
  | 'Custom Size'
  | 'Need Recommendation';

export interface CustomPosterEnquiry {
  customerName: string;
  phone: string;
  city: string;
  posterType: CustomPosterType;
  posterSize: CustomPosterSizeChoice;
  quantity: number | string;
  budgetRange?: string;
  additionalRequirements?: string;
}

export interface ProductOrderEnquiry {
  productName: string;
  productId: string;
  size: PosterSize;
  dimensions: string;
  quantity: number;
  totalPrice: number;
  customerNote?: string;
}
