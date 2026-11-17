import { ProductCatalogItem, SizeOption } from "@/types/product.types";

/**
 * CLIENT-APPROVED SOURCE OF TRUTH PRICING (INR)
 * Strict rules:
 * 1. Exact client-approved prices.
 * 2. Integer INR values.
 * 3. Zero fake discounts, zero crossed-out inflated prices.
 */
export const CLIENT_PRICING = {
  A6_POSTER: 9,
  A5_POSTER: 19,
  A4_POSTER: 39,
  A4_FRAME_ADDON: 210,
  A4_WITH_FRAME: 249,
  SPLIT_POSTER_SET: 109,
  POLARIZED_PHOTO_SET: 99,
  CUSTOM_FRAME_COMBO: 249,
} as const;

/**
 * Standard size options for individual poster prints
 */
export const INDIVIDUAL_POSTER_SIZES: SizeOption[] = [
  {
    id: "A6",
    name: "A6 Pocket Size",
    dimensions: "10.5 × 14.8 cm",
    price: CLIENT_PRICING.A6_POSTER,
    inclusions: "1 × A6 Poster Print",
    frameAvailable: false,
  },
  {
    id: "A5",
    name: "A5 Compact Size",
    dimensions: "14.8 × 21 cm",
    price: CLIENT_PRICING.A5_POSTER,
    inclusions: "1 × A5 Poster Print",
    frameAvailable: false,
  },
  {
    id: "A4",
    name: "A4 Standard Size",
    dimensions: "21 × 29.7 cm",
    price: CLIENT_PRICING.A4_POSTER,
    inclusions: "1 × A4 Poster Print",
    frameAvailable: true,
    framePrice: CLIENT_PRICING.A4_FRAME_ADDON,
  },
];

/**
 * Size options for 3-panel split posters
 */
export const SPLIT_POSTER_SIZES: SizeOption[] = [
  {
    id: "Split Set",
    name: "Split Poster Set (3 × A4)",
    dimensions: "3 Panels · 21 × 29.7 cm each",
    price: CLIENT_PRICING.SPLIT_POSTER_SET,
    inclusions: "3 × A4 size posters",
  },
];

/**
 * Official Client-Approved Product Catalog (6 Core Products)
 */
export const OFFICIAL_PRODUCT_CATALOG: ProductCatalogItem[] = [
  // --- 1. Individual Posters ---
  {
    id: "hw-prod-a4",
    slug: "a4-size-poster",
    name: "A4 Size Poster",
    shortDescription: "Standard A4 wall poster printed on premium 270 GSM glossy photo sheet.",
    fullDescription: "Premium A4 wall poster printed on 270 GSM glossy photo sheets to deliver rich colours, sharp details, and a beautiful glossy finish for your walls. Available with optional frame.",
    price: CLIENT_PRICING.A4_POSTER,
    currency: "INR",
    category: "Individual Posters",
    image: "/images/products/anime-poster.webp",
    inclusions: "1 × A4 size poster (21 × 29.7 cm)",
    productType: "individual",
    customizationRequired: false,
    available: true,
    displayOrder: 1,
  },
  {
    id: "hw-prod-a5",
    slug: "a5-size-poster",
    name: "A5 Size Poster",
    shortDescription: "Compact A5 wall poster ideal for desk spaces and intimate wall galleries.",
    fullDescription: "Handcrafted A5 compact wall art print on premium 270 GSM glossy photo sheet. Delivers rich colours and sharp details in a versatile compact footprint.",
    price: CLIENT_PRICING.A5_POSTER,
    currency: "INR",
    category: "Individual Posters",
    image: "/images/products/marvel-poster.webp",
    inclusions: "1 × A5 size poster (14.8 × 21 cm)",
    productType: "individual",
    customizationRequired: false,
    available: true,
    displayOrder: 2,
  },
  {
    id: "hw-prod-a6",
    slug: "a6-size-poster",
    name: "A6 Size Poster",
    shortDescription: "Mini pocket poster for pinboards, lockers, notebooks, and small nooks.",
    fullDescription: "Pocket-sized A6 mini poster printed on premium 270 GSM glossy photo sheet. Great for creative grid collages and compact desk stands.",
    price: CLIENT_PRICING.A6_POSTER,
    currency: "INR",
    category: "Individual Posters",
    image: "/images/products/think-less-more.webp",
    inclusions: "1 × A6 size poster (10.5 × 14.8 cm)",
    productType: "individual",
    customizationRequired: false,
    available: true,
    displayOrder: 3,
  },

  // --- 2. Poster Sets ---
  {
    id: "hw-prod-split-set",
    slug: "split-poster-set",
    name: "Split Poster Set",
    shortDescription: "3-panel continuous panoramic poster set hung side-by-side.",
    fullDescription: "Signature 3-piece continuous panoramic triptych. One cohesive visual divided seamlessly across three A4 panels, creating an expansive cinematic horizon above beds or sofas.",
    price: CLIENT_PRICING.SPLIT_POSTER_SET,
    currency: "INR",
    category: "Poster Sets",
    image: "/images/hero/batman-split-full.webp",
    inclusions: "3 × A4 size posters",
    productType: "set",
    customizationRequired: false,
    available: true,
    displayOrder: 4,
  },
  {
    id: "hw-prod-polarized-spotify",
    slug: "polarized-customized-photo-set-spotify",
    name: "Polarized Customized Photo Set with Spotify",
    shortDescription: "Customized set of 15 polarized photo prints featuring scannable Spotify music codes.",
    fullDescription: "A personalized memory set consisting of 15 customized polarized-style photo prints with scannable Spotify audio codes. Share your song choices and favorite photos via WhatsApp to create your custom music gallery.",
    price: CLIENT_PRICING.POLARIZED_PHOTO_SET,
    currency: "INR",
    category: "Poster Sets",
    image: "/images/products/keep-going.webp",
    inclusions: "15 photos",
    productType: "set",
    customizationRequired: true,
    available: true,
    displayOrder: 5,
  },

  // --- 3. Customized Products ---
  {
    id: "hw-prod-custom-frame-combo",
    slug: "custom-poster-frame-combo",
    name: "Custom Poster + Frame Combo",
    shortDescription: "Your custom artwork or photo printed on premium 270 GSM glossy photo sheet and mounted in a matching frame.",
    fullDescription: "Complete ready-to-hang gallery combo. Submit your custom photo, artwork, or design and receive it expertly printed on premium 270 GSM glossy photo sheet and encased in a premium protective gallery frame.",
    price: CLIENT_PRICING.CUSTOM_FRAME_COMBO,
    currency: "INR",
    category: "Customized Products",
    image: "/images/products/custom-wall-poster.webp",
    inclusions: "Custom Poster + Matching Frame",
    productType: "customized",
    customizationRequired: true,
    available: true,
    displayOrder: 6,
  },
];
