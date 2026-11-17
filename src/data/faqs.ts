export interface FAQItem {
  id: string;
  category: "collections" | "custom" | "ordering" | "support";
  categoryLabel: string;
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  // --- 1. Poster Collections ---
  {
    id: "faq-buy-online-chennai",
    category: "collections",
    categoryLabel: "Poster Collections",
    question: "Where can I buy wall posters online in Chennai?",
    answer: "You can buy premium wall posters online in Chennai directly from Happy Wall, based in Palavakkam, Chennai (600041). We craft museum-grade wall art printed on 300 GSM archival matte paper and coordinate orders seamlessly via WhatsApp with swift delivery across Chennai and Tamil Nadu.",
  },
  {
    id: "faq-types-available",
    category: "collections",
    categoryLabel: "Poster Collections",
    question: "What types of wall posters are available at Happy Wall?",
    answer: "Happy Wall offers three signature collections: high-octane Anime posters (shonen icons and dark aesthetic prints), Gaming battlestation posters, and continuous 3-panel Split Posters (triptychs). We also provide fully custom photo and art printing tailored to your room decor.",
  },
  {
    id: "faq-anime-gaming",
    category: "collections",
    categoryLabel: "Poster Collections",
    question: "Do you sell Anime and Gaming posters?",
    answer: "Yes, we specialize in high-resolution Anime and Gaming wall posters. Our collection features popular shonen titles such as Demon Slayer, Naruto, Bleach, and Death Note, alongside aesthetic gaming graphics calibrated specifically for RGB-lit desktop setups and bedroom walls.",
  },
  {
    id: "faq-split-posters",
    category: "collections",
    categoryLabel: "Poster Collections",
    question: "What are split posters, and how do they look on a wall?",
    answer: "Split posters (also known as wall triptychs) are single wide artworks divided across three continuous vertical frames with precise 2mm physical gaps. When mounted side-by-side above a bed, couch, or workstation, they create an expansive panoramic gallery statement with striking visual depth.",
  },

  // --- 2. Custom Posters ---
  {
    id: "faq-custom-order",
    category: "custom",
    categoryLabel: "Custom Posters",
    question: "Can I order custom-designed wall posters?",
    answer: "Yes, you can order custom-designed wall posters through Happy Wall. Simply submit your requirements using our website custom poster enquiry form or message our Palavakkam studio on WhatsApp (+91 73395 64538) to discuss dimensions, framing, and design ideas.",
  },
  {
    id: "faq-print-own-design",
    category: "custom",
    categoryLabel: "Custom Posters",
    question: "Can I print my own poster design?",
    answer: "Yes, you can print your own personal digital illustrations, photography, or high-res graphic designs. Share your artwork with our team on WhatsApp, and we will inspect file resolution, DPI, and color calibration free of charge before printing on 300 GSM archival matte paper.",
  },
  {
    id: "faq-sizes-available",
    category: "custom",
    categoryLabel: "Custom Posters",
    question: "What poster sizes and sets are available at Happy Wall?",
    answer: "Happy Wall offers individual posters in A4 size (₹39), A5 size (₹19), and A6 size (₹9), alongside our 3-panel Split Poster Sets (3 × A4 size posters for ₹109), Polarized Customized Photo Sets with Spotify (15 photos for ₹99), and complete Custom Poster + Frame Combos (₹249).",
  },
  {
    id: "faq-room-poster-advice",
    category: "custom",
    categoryLabel: "Custom Posters",
    question: "Can you help me choose the right poster for my room?",
    answer: "Yes, our team provides free styling guidance. Share a quick photo or dimensions of your wall on WhatsApp (+91 73395 64538), and we will recommend matching color palettes, poster themes, and optimal framing sizes suited to your interior lighting.",
  },

  // --- 3. Ordering and Delivery ---
  {
    id: "faq-how-to-order",
    category: "ordering",
    categoryLabel: "Ordering & Delivery",
    question: "How can I order wall posters from Happy Wall?",
    answer: "Ordering is straightforward and personal: browse our website collections, select your preferred posters, or fill out the custom enquiry form. Your order is formatted and opened directly in WhatsApp, where our team confirms specifications and shares payment and dispatch details.",
  },
  {
    id: "faq-price-enquiry",
    category: "ordering",
    categoryLabel: "Ordering & Delivery",
    question: "How do I enquire about poster prices?",
    answer: "You can enquire about current poster prices, frame options, and size upgrades by tapping any 'Enquire on WhatsApp' button or messaging us directly at +91 73395 64538. We provide transparent, upfront quotes based on your required size, frame choice, and quantity.",
  },
  {
    id: "faq-chennai-delivery",
    category: "ordering",
    categoryLabel: "Ordering & Delivery",
    question: "Do you deliver wall posters across Chennai?",
    answer: "Yes, we deliver across all localities in Chennai, including Palavakkam, ECR, OMR, Adyar, Velachery, Anna Nagar, and central Chennai, typically within 24 to 48 hours from dispatch. We also ship via trusted couriers across Tamil Nadu and Pan-India.",
  },
  {
    id: "faq-contact-whatsapp",
    category: "ordering",
    categoryLabel: "Ordering & Delivery",
    question: "How can I contact Happy Wall on WhatsApp?",
    answer: "You can contact Happy Wall directly on WhatsApp by messaging our official business number: +91 73395 64538. Our studio team is available to assist you with catalog previews, custom sizing, and order coordination.",
  },

  // --- 4. Product and Customer Support ---
  {
    id: "faq-bedroom-choice",
    category: "support",
    categoryLabel: "Product & Support",
    question: "How do I choose the right poster for my bedroom?",
    answer: "For bedrooms, choose calming color palettes and soothing art subjects—such as sunset anime silhouettes, minimal typography, or warm aesthetic prints. A horizontal 3-panel split poster or an A3/A4 symmetrical pair mounted above the headboard creates an inviting, balanced atmosphere.",
  },
  {
    id: "faq-gallery-wall",
    category: "support",
    categoryLabel: "Product & Support",
    question: "How can I create a poster gallery wall?",
    answer: "To create an eye-catching gallery wall, anchor the arrangement with one larger focal poster (e.g. A3 or A3+) at eye level, surrounded by two to three smaller complementary A4 prints. Maintain consistent 2 to 3-inch spacing between frames to ensure a cohesive, professional aesthetic.",
  },
  {
    id: "faq-bulk-orders",
    category: "support",
    categoryLabel: "Product & Support",
    question: "How can I enquire about bulk poster orders?",
    answer: "For bulk poster orders—such as corporate gifting, cafe interiors, hostel rooms, or event merchandise—please message our team on WhatsApp at +91 73395 64538 with your quantity and design themes for exclusive volume pricing and expedited turnaround.",
  },
];
