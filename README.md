# Happy Walls — Online Wall Poster Store

> **Posters. Personality. Perfectly Yours.**  
> A high-performance, single-page, WhatsApp-first digital showroom and wall art ordering platform for **Happy Walls**, Palavakkam, Chennai – 600041.

---

## 🎨 Visual Source of Truth
Engineered with pixel-level precision following the client-approved full-page dark showroom UI/UX design:
- **Palette:** Charcoal Base (`#1C1C1C`), Charcoal Deep (`#121212`), Golden Yellow (`#F5B700`), Cream White (`#FFF8E6`), Pure White (`#FFFFFF`).
- **Typography:** Manrope (Headings & Display), Inter (Body & Product Details).
- **Hero Exhibition:** 3D layered Living Poster Gallery with realistic drop shadows, frame bevels, kinetic typography, and GSAP choreographed entrances.

---

## 🚀 Key Features

1. **Fixed Dynamic Navigation Header:**
   - Active section tracking with Intersection Observer.
   - Dynamic backdrop blur on scroll.
   - Full keyboard accessibility and mobile menu drawer.
   - Quick WhatsApp CTA.

2. **Living Poster Gallery Hero:**
   - "YOUR WALLS. YOUR STORY." with custom kinetic Golden Yellow brush accent.
   - Stacked physical gallery depth featuring "Sick. Mofo", "DREAM BIGGER", "Drip Smiley", and "GOOD VIBES ONLY".
   - Floating "10K+ Happy Customers" proof badge.
   - GSAP timeline orchestration with automatic `prefers-reduced-motion` detection.

3. **Curated Collections Showcase:**
   - 6 category artwork cards: Anime, Cars, Marvel, DC, Games, and Football.
   - Direct WhatsApp category catalog query routing.

4. **Room Inspiration Gallery:**
   - Scaled interior living room setting demonstrating realistic scale, lighting, and framing.
   - Highlights 300 GSM archival matte paper and minimalist frames.

5. **Most Loved Posters Carousel:**
   - Interactive horizontal carousel with Previous (`<`) and Next (`>`) controls and touch swiping.
   - Interactive wishlist favorites heart toggle.
   - Base price transparency (₹ 499).

6. **Interactive Product Details Modal:**
   - Accessible dialog (`role="dialog"`, `aria-modal="true"`).
   - Size picker (A5, A4, A3, A3+) with dynamic pricing updates.
   - Quantity selector with dynamic total calculation.
   - One-click "Order via WhatsApp" with prefilled message payload.
   - Keyboard `Escape` and backdrop click close with scroll locking.

7. **Before & After Wall Transformation:**
   - Genuine draggable split comparison slider.
   - Mouse, touch, and keyboard arrow key support.
   - Clear "Before" and "After" pill badges.

8. **Custom Poster Booking Form:**
   - Name, WhatsApp number, email, size picker, and custom message fields.
   - Strict client-side validation (10-digit Indian mobile format verification).
   - Instant WhatsApp dispatch with confirmation banner.

9. **FAQ Accordion & Final CTA:**
   - Expandable accordion covering sizes, delivery times, shipping, and damage replacement policies.
   - "Let's Decorate Your Space!" high-impact WhatsApp contact card.

10. **Comprehensive SEO, GEO & AEO:**
    - `LocalBusiness` and `WebSite` JSON-LD schemas.
    - Automated `sitemap.xml`, `robots.txt`, and Open Graph metadata.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 14+ (App Router, Server Components by default)
- **Language:** TypeScript 5 (Strict type checking, zero `any`)
- **Styling:** Tailwind CSS 3
- **Animations:** GSAP 3.12 + `@gsap/react`
- **Icons:** Lucide React
- **Package Manager:** `pnpm`

---

## 💻 Getting Started

### 1. Installation
```bash
# Clone the repository and navigate into directory
cd happywall

# Install dependencies
pnpm install
```

### 2. Development
```bash
pnpm run dev
# Open http://localhost:3000 in your browser
```

### 3. Production Build
```bash
pnpm run build
pnpm run start
```

---

## 📂 Documentation Directory
Comprehensive architectural and QA documentation is maintained in [`docs/`](./docs/):
- [`docs/PROJECT-OVERVIEW.md`](./docs/PROJECT-OVERVIEW.md)
- [`docs/REQUIREMENTS.md`](./docs/REQUIREMENTS.md)
- [`docs/DESIGN-SYSTEM.md`](./docs/DESIGN-SYSTEM.md)
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- [`docs/CODEBASE-STRUCTURE.md`](./docs/CODEBASE-STRUCTURE.md)
- [`docs/COMPONENT-REGISTRY.md`](./docs/COMPONENT-REGISTRY.md)
- [`docs/DATA-FLOW.md`](./docs/DATA-FLOW.md)
- [`docs/SEO-AUDIT.md`](./docs/SEO-AUDIT.md)
- [`docs/PERFORMANCE-AUDIT.md`](./docs/PERFORMANCE-AUDIT.md)
- [`docs/ISSUE-REGISTER.md`](./docs/ISSUE-REGISTER.md)
- [`docs/TEST-REPORT.md`](./docs/TEST-REPORT.md)
- [`docs/DEPLOYMENT-GUIDE.md`](./docs/DEPLOYMENT-GUIDE.md)
- [`docs/CHANGELOG.md`](./docs/CHANGELOG.md)

---

## 📍 Business Information
- **Brand:** Happy Walls
- **Location:** Palavakkam, Chennai – 600041, Tamil Nadu, India
- **WhatsApp:** [+91 73395 64538](https://wa.me/917339564538)
- **Instagram:** [@happy_walls_poster](https://www.instagram.com/happy_walls_poster/)
- **Engineering Partner:** Think2xCreate

