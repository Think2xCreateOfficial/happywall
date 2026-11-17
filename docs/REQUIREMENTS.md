# Happy Wall — Product Requirements Document (PRD)

## 1. Functional Requirements

### 1.1 Header & Navigation
- **Logo:** High-definition stylized yellow emblem with "HAPPY WALLS" wordmark.
- **Navigation Links:**
  - `Home` (`#hero`)
  - `Collections` (`#collections`)
  - `Room Inspiration` (`#room-inspiration`)
  - `Best Sellers` (`#best-sellers`)
  - `Custom Posters` (`#custom-posters`)
  - `Contact` (`#faq` or `#contact`)
- **Action CTA:** Pill button with WhatsApp icon: "Chat on WhatsApp".
- **Responsive Behavior:** Compact mobile header with hamburger menu toggle and persistent WhatsApp action button.
- **Active Spy:** Intersection Observer tracking active section with subtle yellow highlight.

### 1.2 Hero Section — "Living Poster Gallery"
- **Headline:** "YOUR WALLS. YOUR STORY." with "STORY." styled in vibrant Golden Yellow brush/script style.
- **Sub-headline:** "Find the posters that match your personality. Give every wall a little more character with Happy Wall."
- **CTAs:**
  - Primary: "Explore Collections →" (Smooth scroll to `#collections`).
  - Secondary: "Create Your Own" (Smooth scroll to `#custom-posters`).
- **Social Proof Badge:** "10K+ Happy Customers" with metrics graphic.
- **Exhibition Art Gallery:**
  - Multi-layered composition featuring:
    - Dominant center framed art ("Sick. Mofo" urban contemporary portrait)
    - "DREAM BIGGER" typographic poster
    - Yellow drip smiley face pop-art poster
    - "GOOD VIBES ONLY" modern minimal typography poster
    - Warm yellow architectural background accent panel
    - Natural drop shadows, tilt angles, and realistic depth
- **GSAP Animation:** Kinetic entry sequence respecting `prefers-reduced-motion`.

### 1.3 Collections Showcase
- Horizontal category card deck:
  1. **Anime** (Naruto / Shonen artwork)
  2. **Cars** (Supercar rear view with neon glow)
  3. **Marvel** (Doctor Doom / MCU iconic art)
  4. **DC** (The Batman noir silhouette)
  5. **Games** (GTA V / Cyberpunk game art)
  6. **Football** (Messi #10 tribute)
- Hover interactions: subtle scale, yellow border glow, smooth lighting transition.
- Touch friendly: smooth touch-scroll snapping on mobile.

### 1.4 Room Inspiration
- Split/Editorial layout with high-resolution interior room setting.
- Left content: Section badge, "Imagine It On Your Wall" heading (accent on "Your Wall"), descriptive copy, "Explore Ideas →" CTA.
- Interior mockups showing scaled wall arrangements with natural ambient light and realistic furniture.

### 1.5 Best-Selling Posters Carousel
- Product items with:
  - High-res artwork mockup on natural ledge
  - Title & Category
  - Transparent pricing: ₹ 499 base
  - Interactive favorite heart toggle
  - Click-through to detailed Product Modal
- Carousel Controls:
  - Previous (`<`) and Next (`>`) circular navigation buttons
  - Touch swipe support
  - Keyboard arrow key navigation
  - Infinite or bounded smooth transitions without cumulative layout shifts (CLS)

### 1.6 Before & After Transformation
- Interactive split comparison slider:
  - Left side: Bare empty room wall ("Before" badge)
  - Right side: Styled room with "DREAM BIGGER" poster installation ("After" badge)
  - Central draggable slider handle in golden yellow with `< >` arrows
  - Full mouse drag, touch drag, and accessible keyboard arrow key support

### 1.7 Custom Poster Booking Form
- Form fields:
  - Full Name (Required, minimum 2 characters)
  - Phone / WhatsApp Number (Required, 10-digit Indian mobile validation)
  - Email Address (Optional, standard email format validation if entered)
  - Size Selection dropdown (`A6 (10.5 x 14.8 cm)`, `A5 (14.8 x 21 cm)`, `A4 (21 x 29.7 cm)`)
  - Project Message / Vision (Required)
- Client-side validation with real-time feedback
- Submission Handler: Encodes user inputs into a structured WhatsApp message and opens WhatsApp Web / Mobile directly.

### 1.8 Product Details Modal
- Accessible modal dialog (`role="dialog"`, `aria-modal="true"`)
- Large high-resolution artwork view
- Size picker (A6, A5, A4) with finish selection and dynamic pricing updates
- Quantity selector with increment/decrement (+ / -)
- Instant order summary calculation
- "Order via WhatsApp" button generating structured pre-filled order text
- Close on `Escape` key, click outside, or close icon; background scroll locking

### 1.9 FAQ Accordion
- Accordion items covering key customer questions:
  - Available poster sizes & dimensions
  - Custom poster creation process
  - Chennai delivery timelines & Tamil Nadu / Pan-India shipping
  - Frame options and packaging protection
  - Safe payment methods (UPI, GPay, PhonePe, Bank Transfer)
- Smooth height transitions, full keyboard expand/collapse, proper ARIA attributes (`aria-expanded`, `aria-controls`).

### 1.10 Final Call To Action & Footer
- "Let's Decorate Your Space!" banner with instant WhatsApp chat trigger.
- Comprehensive footer with brand identity, social channels (Instagram, WhatsApp, YouTube), address in Palavakkam, Chennai – 600041, quick links, and legal copyright.

---

## 2. Non-Functional Requirements
- **Performance:** TTFB < 200ms, LCP < 2.5s, CLS = 0, INP < 200ms.
- **Accessibility:** WCAG 2.1 Level AA compliance, color contrast $\ge 4.5:1$ for normal text, keyboard navigable, screen-reader friendly labels.
- **SEO & AEO:** Semantic HTML5, JSON-LD Schema (`LocalBusiness`, `Product`, `WebSite`), Open Graph, Twitter Cards, `robots.txt`, `sitemap.xml`.
- **Security:** Strict input sanitization, safe URL encoding for WhatsApp query parameters, no persistent PII storage without backend encryption.

