# Happy Wall — Performance & Core Web Vitals Audit

## 1. Performance Goals & Budget

| Metric | Target | Optimization Strategy |
| :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | $\le 2.0\text{s}$ | Hero artwork preloaded with `priority={true}`, served in modern WebP format, fonts preloaded using `next/font` |
| **INP (Interaction to Next Paint)** | $\le 150\text{ms}$ | React 18 concurrent transitions, zero heavy main-thread blocking JavaScript, hardware-accelerated CSS transforms |
| **CLS (Cumulative Layout Shift)** | $0.00$ | Explicit aspect ratio wrappers (`aspect-[16/9]`, `aspect-[4/3]`) on all images and carousels |
| **TTFB (Time to First Byte)** | $\le 200\text{ms}$ | Fully static generation at edge (Next.js SSG / ISR) |
| **Total JavaScript Bundle** | $\le 120\text{kB}$ | Server Components for all static sections; Leaf Client Components only |

---

## 2. Image Optimization Strategy

- **Next.js `<Image />` Component:** Used across all poster artworks, mockups, and room inspiration imagery.
- **Modern Formats:** WebP delivery with AVIF support fallback.
- **Responsive Sizing:** Explicit `sizes` attributes prevent mobile devices from downloading desktop-scale images.
- **Lazy Loading:** `loading="lazy"` automatically applied to all images below the fold (Sections 03–09).
- **Hero Priority:** Hero images utilize `priority={true}` to prime the browser cache and accelerate LCP.

---

## 3. Font Optimization Strategy

- Managed via `next/font/google`:
  - `Manrope`: Latin subset, weights 500, 600, 700, 800, `display: 'swap'`.
  - `Inter`: Latin subset, weights 400, 500, 600, `display: 'swap'`.
- Self-hosted zero-roundtrip font files injected directly into page HTML. No external Google Font network latency or privacy leakage.

---

## 4. Animation Optimization (GSAP)

- Uses `gsap.context()` for clean React component lifecycle mounting and complete unmount teardown.
- Animates only composite properties (`transform: translate3d`, `opacity`, `scale`) that execute directly on GPU compositor threads without triggering layout reflows or repaints.
- Strict `prefers-reduced-motion` compliance immediately switches to static opacity `1` without animation if requested by OS settings.

