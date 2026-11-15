# Happy Walls — Codebase Structure

## 1. Directory Tree

```text
d:\TM_project\happywall\
├── .next/                     # Next.js build output & cache
├── docs/                      # Architectural & QA documentation
│   ├── PROJECT-OVERVIEW.md    # Business context, goals, and tech stack
│   ├── REQUIREMENTS.md        # Functional and non-functional PRD
│   ├── DESIGN-SYSTEM.md       # Color tokens, typography, spacing & motion
│   ├── ARCHITECTURE.md        # Technical design, data flow, component hierarchy
│   ├── CODEBASE-STRUCTURE.md  # File organization and responsibilities
│   ├── COMPONENT-REGISTRY.md  # Registry of all UI & section components
│   ├── DATA-FLOW.md           # Visual state transitions & WhatsApp integration
│   ├── SEO-AUDIT.md           # Metadata, OpenGraph, JSON-LD, sitemap verification
│   ├── PERFORMANCE-AUDIT.md   # Core Web Vitals, asset optimization, budgets
│   ├── ISSUE-REGISTER.md      # Edge case tracking and bug prevention log
│   ├── TEST-REPORT.md         # Automated and manual QA test verification
│   ├── DEPLOYMENT-GUIDE.md    # Production deployment and environment setups
│   └── CHANGELOG.md           # Engineering record of releases & milestones
├── public/                    # Static public assets
│   ├── favicon.ico
│   ├── icon.svg               # Vector brand emblem icon
│   └── images/
│       ├── brand/             # SVG logo and brand assets
│       ├── hero/              # Hero poster artworks & architectural elements
│       │   ├── sick-mofo-poster.webp
│       │   ├── dream-bigger.webp
│       │   ├── drip-smiley.webp
│       │   ├── good-vibes.webp
│       │   └── hero-gallery-cluster.webp
│       ├── collections/       # High-res category artwork
│       │   ├── anime.webp
│       │   ├── cars.webp
│       │   ├── marvel.webp
│       │   ├── dc.webp
│       │   ├── games.webp
│       │   └── football.webp
│       ├── rooms/             # Interior visual room setups
│       │   ├── room-inspiration-living.webp
│       │   └── faq-room-decor.webp
│       ├── products/          # Best selling product mockup artworks
│       │   ├── custom-wall-poster.webp
│       │   ├── think-less-more.webp
│       │   ├── keep-going.webp
│       │   ├── anime-poster.webp
│       │   └── marvel-poster.webp
│       └── transformations/   # Before/after comparison imagery
│           ├── before-after-full.webp
│           ├── wall-before.webp
│           └── wall-after.webp
├── src/
│   ├── animations/
│   │   └── hero-animations.ts # GSAP entrance timeline & reduced-motion handling
│   ├── app/
│   │   ├── globals.css        # Tailwind setup, scrollbars, focus rings, variables
│   │   ├── layout.tsx         # Root layout with fonts, JSON-LD schemas
│   │   ├── manifest.ts        # PWA web manifest
│   │   ├── page.tsx           # Single-page layout orchestrator
│   │   ├── robots.ts          # Search engine crawler policies
│   │   └── sitemap.ts         # Automated XML sitemap generator
│   ├── components/
│   │   ├── common/
│   │   │   ├── Accordion.tsx  # Accessible FAQ accordion with ARIA attributes
│   │   │   └── BeforeAfterSlider.tsx # Interactive pointer/keyboard comparison slider
│   │   ├── forms/
│   │   │   └── CustomPosterForm.tsx # Custom order booking form with validation
│   │   ├── layout/
│   │   │   ├── Footer.tsx     # Brand footer with links, copyright & socials
│   │   │   ├── Header.tsx     # Sticky navigation with section observer & CTA
│   │   │   └── MobileNavigation.tsx # Accessible drawer navigation
│   │   ├── products/
│   │   │   ├── ProductCard.tsx # Best-seller poster card with favorites & hover
│   │   │   ├── ProductCarousel.tsx # Touch/button carousel with bounded bounds
│   │   │   └── ProductDetailsModal.tsx # Full-featured ordering dialog with sizes
│   │   ├── sections/
│   │   │   ├── BeforeAfterCustomSection.tsx # Split comparison & booking section
│   │   │   ├── BestSellingSection.tsx # Most loved posters showcase
│   │   │   ├── CollectionsSection.tsx # Category gallery cards
│   │   │   ├── FAQSection.tsx # FAQ accordion + Space decorator CTA
│   │   │   ├── HeroSection.tsx # 3D living poster gallery hero
│   │   │   └── RoomInspirationSection.tsx # Scaled room gallery inspiration
│   │   └── ui/
│   │       ├── Button.tsx     # Reusable button with variants & external link support
│   │       ├── Container.tsx  # Responsive container constraint wrapper
│   │       ├── SectionHeading.tsx # Standardized section badge, title & highlight
│   │       └── WhatsAppButton.tsx # Centralized WhatsApp click-to-chat button
│   ├── data/
│   │   ├── collections.ts     # Category metadata and badge configs
│   │   ├── faqs.ts            # Verified FAQ items with business responses
│   │   ├── navigation.ts      # Main navigation item definitions
│   │   ├── products.ts        # Poster catalogue with prices and sizes
│   │   ├── rooms.ts           # Room inspiration presets
│   │   └── site-config.ts     # Business profile, contact, addresses & sizes
│   ├── lib/
│   │   ├── seo.ts             # Metadata generator & JSON-LD structured schemas
│   │   ├── utils.ts           # Tailwind merge & currency formatters
│   │   ├── validation.ts      # Custom poster form validator
│   │   └── whatsapp.ts        # Centralized WhatsApp URL & message builder
│   └── types/
│       ├── collection.ts      # Category collection TypeScript interface
│       ├── enquiry.ts         # Custom poster & product order interfaces
│       └── product.ts         # Product & PosterSize interfaces
├── next.config.js             # Next.js optimization configuration
├── package.json               # Dependencies and build scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.ts         # Custom design tokens, colors & shadows
└── tsconfig.json              # Strict TypeScript configuration
```

