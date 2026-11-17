# Happy Wall — Engineering Changelog

## [2.0.0] - 2026-11-11
### Major UI/UX Design Refinement & Frontend Enhancement

#### 1. Floating Glassmorphism Navigation (Vanguard Reference)
- Transformed fixed edge-to-edge navbar into an elevated floating pill container (`top-4 sm:top-6`, `rounded-full`).
- Implemented translucent charcoal glass with `backdrop-blur-xl`, subtle border, and ambient shadow.
- Integrated Shopping Bag / Cart icon with dynamic live badge counter tracking selected posters.
- Integrated `PosterSelectionDrawer`: Slide-over drawer with selected poster cards, size specifications, quantity steppers, subtotal calculation, and multi-item WhatsApp checkout.

#### 2. Centered Editorial Hero Experience
- Completely replaced legacy split hero layout with a high-impact centered composition.
- Introductory label: `POSTERS · ART · PERSONALITY` with ambient pulsing beacon.
- Bold memorable centered headline: `YOUR WALLS. YOUR PERSONALITY. YOUR STORY.` with custom golden-yellow brush accent.
- Primary CTA: `Explore Collections` and Secondary CTA: `Create Your Own`.
- Split Poster Artwork: Implemented `SplitPosterDisplay` showcasing a three-panel rectangular continuous split poster composition (triptych) with realistic frame bevels, drop shadows, interactive pins, and theme switcher.
- GSAP entrance choreography orchestrated for staggered centered reveal.

#### 3. Room Inspiration Customer Experience Section
- Upgraded room inspiration section into an interactive explorer solving real customer arrangement problems.
- 5 Realistic Room Environments:
  1. Bedroom Inspiration (Gallery Trio - 3x A3 Vertical Alignment)
  2. Gaming Room Inspiration (Battlestation 4-Piece Comic Gallery)
  3. Workspace / Desk Setup (Triptych Panoramic 3-Panel Continuous Setup)
  4. Living Room Inspiration (Over-Sofa Statement Large Scale Trio)
  5. Minimal Aesthetic Room (Casual Leaning Setup)
- Added interactive room-type selector tabs.
- Added interactive poster hotspot pins with dimension tooltips and direct WhatsApp inquiry triggers.

#### 4. Best Selling Typography Refinement (PosterCulture Reference)
- Refined section and card typography to bold, compact modern sans-serif with tight letter spacing (`font-manrope font-extrabold tracking-tight`).
- Added price discount presentation: Base ₹ 499 with original strike-through ₹ 799 ("Save ₹300").
- Added quick "Add to Selection" button (`+` icon) on product cards that directly increments the cart and opens the drawer.

#### 5. Dedicated Before & After Wall Transformation
- Repositioned as a dedicated prominent section **immediately following Best Selling**, matching uploaded reference image 4.
- Integrated realistic desk/workstation setup with monitor, mic arm, and PC case.
- Interactive draggable comparison slider with visible center golden handle (`‹›`), Before/After badges, pointer events, and keyboard navigation.

#### 6. Dedicated Custom Poster Booking Section
- Created dedicated custom prints section pairing brand quality guarantees (300 GSM Archival Matte, Rigid Tube Packaging, Chennai 24-48h Dispatch) with the validated custom booking form.

---

## [1.0.0] - 2026-11-11
### Initial Production Release
- Initial Next.js 14 App Router project setup with TypeScript 5.
- Core brand tokens (`#1C1C1C`, `#121212`, `#F5B700`, `#FFF8E6`, `#FFFFFF`).
- Initial collections, product modal, and WhatsApp click-to-chat integration.
