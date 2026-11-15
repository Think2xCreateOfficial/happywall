# Happy Walls — Issue & Risk Register

## 1. Risk & Defect Prevention Log

| ID | Issue / Risk Description | Severity | Impact Area | Resolution / Mitigation Applied | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RISK-01** | Mobile horizontal overflow on large 6-card collection grid | Medium | Mobile Viewport | Configured grid layout with responsive column counts (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`) and smooth touch scrolling. | RESOLVED |
| **RISK-02** | WhatsApp Click-to-Chat URL encoding errors with special characters | High | Checkout Conversion | Centralized all URL building inside `src/lib/whatsapp.ts` with strict `encodeURIComponent` formatting and numeric phone stripping. | RESOLVED |
| **RISK-03** | Layout shift during before/after slider image loading | Medium | Cumulative Layout Shift (CLS) | Enforced explicit aspect ratios (`aspect-[16/10] sm:aspect-[16/9]`) and container constraints prior to image load. | RESOLVED |
| **RISK-04** | GSAP animation memory leak during route navigation or hot reloads | High | Memory & Performance | Encapsulated all animations inside `gsap.context()` with an explicit `ctx.revert()` returned in the React `useEffect` cleanup hook. | RESOLVED |
| **RISK-05** | Form submission without valid WhatsApp / phone number | High | Sales Follow-up | Built comprehensive client-side regex validator for standard 10-digit Indian mobile numbers (`/^[6-9]\d{9}$/`) with inline error messages. | RESOLVED |
| **RISK-06** | Accidental introduction of restricted colors (blue, red, purple) | Medium | Visual Source of Truth | Strictly enforced Tailwind color palette mapping only to `#1C1C1C`, `#121212`, `#F5B700`, `#FFF8E6`, and `#FFFFFF`. | RESOLVED |
| **RISK-07** | Background scrolling when Product Details Modal is active | Low | Mobile UX | Dynamically toggled `document.body.style.overflow = "hidden"` on modal mount and restored `"unset"` on unmount. | RESOLVED |

