# Happy Wall — Project Overview

## 1. Executive Summary
**Happy Wall** is an online wall poster and aesthetic wall art business based in Palavakkam, Chennai – 600041. Operating as a direct-to-consumer digital brand without a physical storefront, Happy Wall bridges the gap between digital art discovery and physical wall transformations.

The primary operational challenge faced by the business is handling high volumes of repetitive inquiries across Instagram and WhatsApp, where manually sending individual poster mockups, catalog sheets, and pricing messages causes friction and slows sales conversion.

This project delivers a **high-conversion, single-page digital showroom and WhatsApp-first ordering website** that empowers customers to:
- Discover the Happy Wall brand narrative and curated collections.
- Visually explore trending categories (Anime, Supercars, Marvel, DC, Gaming, Football).
- Visualize posters in authentic, beautifully lit room spaces.
- Interact with a real-time Before & After wall transformation slider.
- Inspect best-selling posters with realistic frame mockups and transparent pricing (₹ 499 base).
- Configure poster sizes (A6, A5, A4) and quantities in an interactive product modal.
- Submit custom design inquiries or one-click purchase requests formatted directly into WhatsApp messages to **+91 73395 64538**.

---

## 2. Business Identity & Verification Details
- **Brand Name:** Happy Wall
- **Tagline:** Posters. Personality. Perfectly Yours. / Your Walls. Your Story.
- **Physical Operation Base:** Palavakkam, Chennai – 600041, Tamil Nadu, India
- **Primary Sales & Support Channel:** WhatsApp (`+91 73395 64538`)
- **Official Instagram:** `https://www.instagram.com/happy_walls_poster/`
- **Core Value Proposition:** Premium matte & framed art prints, custom digital creations, rapid Chennai dispatch, and frictionless WhatsApp checkout.

---

## 3. Core Customer Journey
$$\text{DISCOVER} \longrightarrow \text{EXPLORE} \longrightarrow \text{VISUALIZE} \longrightarrow \text{SELECT} \longrightarrow \text{ENQUIRE / ORDER}$$

1. **Discover:** The customer lands on the dramatic charcoal showroom with kinetic GSAP typography ("YOUR WALLS. YOUR STORY.") and stacked gallery depth.
2. **Explore:** Instant horizontal category filter showcasing Anime, Supercars, Marvel, DC, Gaming, and Football.
3. **Visualize:** Authentic interior photography demonstrating scale, natural lighting, and lifestyle framing.
4. **Select:** Interactive carousel with live pricing, size selector, and favorites.
5. **Enquire / Order:** Zero-friction WhatsApp click-to-chat flow with automated message templates containing product name, size, quantity, and user details.

---

## 4. Engineering Standards & Tech Stack
- **Framework:** Next.js 14+ (App Router, Server Components by default, Client Components at leaf nodes)
- **Language:** TypeScript 5+ (Strict Type Checking)
- **Styling:** Tailwind CSS (Custom Design System tokens)
- **Animation:** GSAP 3.12+ with `@gsap/react` & ScrollTrigger
- **Icons:** Lucide React
- **Hosting Target:** Vercel / Cloudflare Pages / Static Node Server
- **Performance Budget:** Core Web Vitals (LCP $\le$ 2.5s, INP $\le$ 200ms, CLS $\le$ 0.1, Lighthouse 90+)

