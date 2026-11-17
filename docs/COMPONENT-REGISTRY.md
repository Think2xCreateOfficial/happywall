# Happy Wall — Component Registry

## 1. Overview
The Happy Wall user interface is built as an enterprise-grade set of atomic, single-responsibility, accessible React components. The table below registers every component, its location, interface contract, and responsibility.

---

## 2. Component Directory

| Component | Path | Responsibility | Server / Client | Key Props / Interfaces |
| :--- | :--- | :--- | :--- | :--- |
| **Header** | `src/components/layout/Header.tsx` | Floating glassmorphism top navigation (Vanguard reference) with top spacing, active section spy, logo, cart button, and WhatsApp CTA | Client | None |
| **PosterSelectionDrawer** | `src/components/layout/PosterSelectionDrawer.tsx` | Slide-over cart drawer displaying selected posters, quantity stepper, size tags, subtotal, and multi-item WhatsApp checkout | Client | None |
| **MobileNavigation** | `src/components/layout/MobileNavigation.tsx` | Accessible full-screen mobile menu drawer with focus trap, ESC listener, and section links | Client | `isOpen: boolean`, `onClose: () => void`, `activeSection: string` |
| **Footer** | `src/components/layout/Footer.tsx` | Brand footer with Palavakkam Chennai address, copyright, social icons, and WhatsApp link | Server | None |
| **HeroSection** | `src/components/sections/HeroSection.tsx` | Centered editorial hero experience with kinetic headline, dual CTAs, and 3-panel split poster triptych display | Client | None |
| **SplitPosterDisplay** | `src/components/ui/SplitPosterDisplay.tsx` | Rectangular 3-panel continuous split poster composition (triptych) with interactive hotspots and theme switcher | Client | None |
| **CollectionsSection** | `src/components/sections/CollectionsSection.tsx` | 6 category artwork cards (Anime, Cars, Marvel, DC, Games, Football) with WhatsApp catalog inquiry | Client | `onSelectCategory?: (slug: string) => void` |
| **RoomInspirationSection** | `src/components/sections/RoomInspirationSection.tsx` | Interactive room explorer featuring 5 environments (Bedroom, Gaming, Workspace, Living Room, Minimal Studio) with arrangement guides & poster pins | Client | None |
| **BestSellingSection** | `src/components/sections/BestSellingSection.tsx` | Curated best-seller carousel orchestrator with refined PosterCulture typography and modal state management | Client | None |
| **ProductCarousel** | `src/components/products/ProductCarousel.tsx` | Smooth horizontal scroll product slider with touch swiping and previous/next chevron buttons | Client | `products: Product[]`, `onOpenDetails: (product) => void` |
| **ProductCard** | `src/components/products/ProductCard.tsx` | Refined poster frame mockup card with pricing (₹ 499 vs ₹ 799), category, wishlist heart, and quick Add to Selection | Client | `product: Product`, `onOpenDetails: (product) => void` |
| **ProductDetailsModal** | `src/components/products/ProductDetailsModal.tsx` | Accessible dialog with A5–A3+ size selector, quantity counter, dynamic price calculation, and WhatsApp checkout | Client | `product: Product \| null`, `onClose: () => void` |
| **BeforeAfterSection** | `src/components/sections/BeforeAfterSection.tsx` | Dedicated prominent transformation section positioned immediately after Best Selling, matching the uploaded desk setup | Client | None |
| **BeforeAfterSlider** | `src/components/common/BeforeAfterSlider.tsx` | Interactive split-screen wall comparison slider with draggable golden handle (mouse, touch & keyboard) | Client | `imageSrc?: string`, `className?: string` |
| **CustomPosterSection** | `src/components/sections/CustomPosterSection.tsx` | Dedicated custom poster section with value guarantees (300 GSM matte, rigid packaging, 24-48h dispatch) | Client | None |
| **CustomPosterForm** | `src/components/forms/CustomPosterForm.tsx` | Client-side validated form generating prefilled custom design WhatsApp booking message | Client | None |
| **FAQSection** | `src/components/sections/FAQSection.tsx` | 3-column FAQ layout with accordion questions and "Let's Decorate Your Space" card | Client | None |
| **Accordion** | `src/components/common/Accordion.tsx` | Accessible expandable accordion with smooth height transition, keyboard navigation, and ARIA attributes | Client | `items: FAQItem[]`, `defaultOpenIndex?: number` |
| **Button** | `src/components/ui/Button.tsx` | Multi-variant pill button (primary golden yellow, secondary, outline, ghost) with icon slots | Server / Client | `variant?: string`, `size?: string`, `href?: string`, `icon?: ReactNode` |
| **WhatsAppButton** | `src/components/ui/WhatsAppButton.tsx` | Official brand WhatsApp action button with automated URI encoding and message presets | Server / Client | `message?: string`, `size?: string`, `variant?: string`, `label?: string` |
| **SectionHeading** | `src/components/ui/SectionHeading.tsx` | Standardized section header with golden yellow dash, badge, title, highlight, and action link | Server | `badge?: string`, `title: string`, `highlight?: string`, `actionHref?: string` |
| **Container** | `src/components/ui/Container.tsx` | Responsive max-width container wrapper (`max-w-7xl` / `1440px`) | Server | `size?: "default" \| "narrow" \| "wide"` |
