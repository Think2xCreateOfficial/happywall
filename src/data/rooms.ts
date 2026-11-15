export interface RoomHotspot {
  id: string;
  name: string;
  category: string;
  size: string;
  priceText: string;
  description: string;
  relatedImage?: string;
  actionText: string;
  whatsappMessage: string;
  xPercent: number; // 0 - 100 percentage relative to image width
  yPercent: number; // 0 - 100 percentage relative to image height
}

export interface RoomEnvironment {
  id: string;
  title: string;
  tag: string;
  headline: string;
  description: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  aspectRatio: string;
  hotspots: RoomHotspot[];
}

export const ROOM_ENVIRONMENTS: RoomEnvironment[] = [
  {
    id: "bedroom",
    title: "Bedroom Triptych",
    tag: "3-Panel Continuous Split",
    headline: "Over-the-Bed 3-Panel Split Poster Triptych",
    description: "Transform your bedroom into a cinematic sanctuary. A continuous 3-piece split poster hung with 2mm gaps above the headboard creates an expansive, modern focal statement.",
    image: "/images/rooms/bed-room-inspiration.jpg",
    imageWidth: 6144,
    imageHeight: 4096,
    aspectRatio: "3 / 2",
    hotspots: [
      {
        id: "bed-split-left",
        name: "Panel 1 · Left Wing",
        category: "Split Poster",
        size: "A3 Vertical (29.7 × 42 cm)",
        priceText: "Set: ₹1,299",
        description: "Left segment of the continuous 3-panel Batman triptych, printed on 300 GSM matte paper with fade-resistant pigment inks.",
        relatedImage: "/images/hero/batman-split-1.webp",
        actionText: "Order 3-Panel Set",
        whatsappMessage: "Hello Happy Walls! I saw the *Bedroom 3-Panel Split Triptych* inspiration. I would like to order the complete 3-panel set.",
        xPercent: 36.8,
        yPercent: 25.0,
      },
      {
        id: "bed-split-center",
        name: "Panel 2 · Center Focal",
        category: "Split Poster",
        size: "A3 Vertical (29.7 × 42 cm)",
        priceText: "Set: ₹1,299",
        description: "Center focal panel bridging the continuous artwork with ultra-thin 2mm frame spacing for an uninterrupted horizon view.",
        relatedImage: "/images/hero/batman-split-2.webp",
        actionText: "Order 3-Panel Set",
        whatsappMessage: "Hello Happy Walls! I would like to enquire about the *Center Split Poster Panel & Triptych Set* from your bedroom inspiration.",
        xPercent: 53.4,
        yPercent: 25.0,
      },
      {
        id: "bed-split-right",
        name: "Panel 3 · Right Wing",
        category: "Split Poster",
        size: "A3 Vertical (29.7 × 42 cm)",
        priceText: "Set: ₹1,299",
        description: "Right segment completing the cinematic bedroom statement, framed in matte black solid wood gallery moulding.",
        relatedImage: "/images/hero/batman-split-3.webp",
        actionText: "Order 3-Panel Set",
        whatsappMessage: "Hello Happy Walls! I am interested in ordering the *3-Piece Split Poster Triptych* shown in the bedroom styling mockup.",
        xPercent: 70.0,
        yPercent: 25.0,
      },
    ],
  },
  {
    id: "living-room",
    title: "Living Room Gallery Wall",
    tag: "Aesthetic & Lounge",
    headline: "Modern Minimalist Living Room Gallery Wall",
    description: "A balanced asymmetric wall arrangement designed to complement modern lounge seating and ambient floor lamps without overwhelming the space.",
    image: "/images/rooms/living-room-inspiration.jpg",
    imageWidth: 6652,
    imageHeight: 4435,
    aspectRatio: "3 / 2",
    hotspots: [
      {
        id: "lr-accent-top-left",
        name: "Retro Gaming Neon Accent",
        category: "Games",
        size: "A4 Landscape (29.7 × 21 cm)",
        priceText: "₹499",
        description: "High-contrast arcade aesthetic print providing complementary balance to the central gallery statement.",
        relatedImage: "/images/products/anime-poster.webp",
        actionText: "Order This Print",
        whatsappMessage: "Hello Happy Walls! I like the *Retro Gaming Accent Poster (A4)* from your living room gallery wall.",
        xPercent: 17.1,
        yPercent: 20.0,
      },
      {
        id: "lr-statement-center",
        name: "Tanjiro Sun Breathing Statement",
        category: "Anime",
        size: "A2 / A3 Gallery Frame (42 × 59.4 cm)",
        priceText: "₹799",
        description: "Centerpiece vertical art print with vivid contrast and warm undertones, perfectly framed as the room's main visual anchor.",
        relatedImage: "/images/collections/tanjiro.webp",
        actionText: "Order Centerpiece",
        whatsappMessage: "Hello Happy Walls! I want to order the *Tanjiro Centerpiece Gallery Poster* from your living room inspiration showcase.",
        xPercent: 44.8,
        yPercent: 27.7,
      },
      {
        id: "lr-accent-top-right",
        name: "Cyberpunk Battlestation Accent",
        category: "Games",
        size: "A4 Landscape (29.7 × 21 cm)",
        priceText: "₹499",
        description: "Futuristic neon city perspective framing the upper right corner of the living room lounge gallery.",
        relatedImage: "/images/collections/games.webp",
        actionText: "Order This Print",
        whatsappMessage: "Hello Happy Walls! I would like to order the *Cyberpunk Gaming Accent Print* seen in the living room setup.",
        xPercent: 68.7,
        yPercent: 18.1,
      },
      {
        id: "lr-accent-bottom-right",
        name: "Zenitsu Thunderclap Accent",
        category: "Anime",
        size: "A4 Landscape (29.7 × 21 cm)",
        priceText: "₹499",
        description: "Dynamic thunder breathing anime art grounding the lower right frame above the wooden side table.",
        relatedImage: "/images/collections/zenitsu.webp",
        actionText: "Order This Print",
        whatsappMessage: "Hello Happy Walls! I want to order the *Zenitsu Accent Poster* from the living room gallery wall.",
        xPercent: 68.6,
        yPercent: 37.0,
      },
    ],
  },
];
