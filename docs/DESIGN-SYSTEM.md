# Happy Wall — Design System Specification

## 1. Brand Identity & Color Tokens

The visual foundation is an immersive dark showroom where poster artwork pops with vivid clarity, framed by deep charcoal tones and warm golden-yellow accents.

### Strict Color Palette
| Token Name | Hex Code | Purpose | Usage Constraints |
| :--- | :--- | :--- | :--- |
| **Charcoal Surface** | `#1C1C1C` | Primary section & card background | Never replace with generic slate/blue |
| **Charcoal Darker** | `#121212` | Viewport & page root background | Deep contrast anchor |
| **Golden Yellow** | `#F5B700` | Brand identity, primary CTAs, active highlights | Use with purpose; never flood large backgrounds |
| **Golden Amber Glow** | `rgba(245, 183, 0, 0.15)` | Subtle ambient backdrops & active halos | Soft, ambient lighting only |
| **Cream White** | `#FFF8E6` | Secondary text, subtle borders, soft badges | Warm text readability |
| **Pure White** | `#FFFFFF` | Headlines, primary text, artwork contrast | High readability |
| **Charcoal Border** | `#2A2A2A` | Structural borders, card outlines | Understated separation |
| **Muted Grey** | `#8E8E93` | Metadata, microcopy, placeholder text | WCAG AA compliant contrast |

> [!IMPORTANT]
> **Strict Restrictions:**
> No purple, blue, burgundy, red accent, neon colors, or rainbow gradients are permitted. The palette must adhere strictly to Charcoal, Golden Yellow, Cream White, and Pure White.

---

## 2. Typography Scale

Fonts:
- **Headlines & Display:** `Manrope`, sans-serif (Weights: 600, 700, 800)
- **Body & Product Metadata:** `Inter`, sans-serif (Weights: 400, 500, 600)
- **Accent Script / Brush:** Custom brush style / italicized golden yellow for "YOUR STORY."

```css
/* Typography Scale */
--font-display: 'Manrope', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;

/* Font Sizes & Line Heights */
--text-hero: clamp(2.5rem, 5.5vw, 4.5rem); /* Line height: 1.05 */
--text-h1: clamp(2rem, 3.8vw, 3rem);       /* Line height: 1.15 */
--text-h2: clamp(1.5rem, 2.5vw, 2.25rem);   /* Line height: 1.25 */
--text-h3: clamp(1.25rem, 1.8vw, 1.5rem);   /* Line height: 1.35 */
--text-body: 1rem;                          /* Line height: 1.6 */
--text-small: 0.875rem;                     /* Line height: 1.5 */
--text-caption: 0.75rem;                    /* Line height: 1.4 */
```

---

## 3. Spacing & Container System

- **Max Container Width:** `1280px` (`max-w-7xl`)
- **Horizontal Viewport Padding:**
  - Mobile: `1.25rem` (`px-5`)
  - Tablet: `2rem` (`px-8`)
  - Desktop: `3rem` (`px-12`)
- **Vertical Section Rhythm:**
  - Standard Section: `py-20` to `py-28` (Desktop) / `py-14` to `py-18` (Mobile)
  - Inter-component Gap: `gap-6` to `gap-8`

---

## 4. UI Components & Border Radii

- **Cards & Gallery Tiles:** `rounded-2xl` (`16px`)
- **Buttons (Pills):** `rounded-full` (`9999px`)
- **Form Inputs:** `rounded-xl` (`12px`)
- **Image Mockups:** `rounded-xl` or `rounded-lg` with subtle `ring-1 ring-white/10` and realistic drop shadow `shadow-2xl`

---

## 5. Animation & Motion Tokens

- **Easing:** GSAP `power3.out` for entrances, `power2.inOut` for smooth interactive transitions.
- **Duration:**
  - Button hovers: `200ms`
  - Modal transitions: `300ms`
  - Hero staggered entrance: `1.2s` total sequence
  - Slider drag responsiveness: Instant ($0\text{ms}$ lag)
- **Accessibility:** Immediate fallback to static opacity `1` when `window.matchMedia('(prefers-reduced-motion: reduce)')` matches.

