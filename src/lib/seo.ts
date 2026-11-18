import { Metadata } from "next";
import { SITE_CONFIG } from "@/data/site-config";
import { FAQS } from "@/data/faqs";

export function constructMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: `${SITE_CONFIG.name} | Wall Posters, Anime Art & Custom Prints in Chennai`,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    keywords: [
      "Happy Walls",
      "Happy Wall",
      "happywalls.co.in",
      "Wall Posters Chennai",
      "Custom Poster Prints Chennai",
      "Palavakkam Wall Posters",
      "East Coast Road Wall Art",
      "Anime Posters Chennai",
      "Gaming Posters India",
      "Split Posters Triptych",
      "3-Panel Wall Art",
      "Framed Wall Art Chennai",
      "Aesthetic Room Decor Chennai",
      "Poster Store Palavakkam",
      "Fast Poster Delivery Chennai",
      "Demon Slayer Posters India",
      "Batman Split Poster",
    ],
    authors: [{ name: "Happy Walls", url: SITE_CONFIG.url }],
    creator: "Think2xCreate",
    publisher: "Happy Walls",
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    alternates: {
      canonical: SITE_CONFIG.url,
      languages: {
        "en-IN": SITE_CONFIG.url,
        "x-default": SITE_CONFIG.url,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon.ico",
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
    openGraph: {
      title: `${SITE_CONFIG.name} — Handcrafted Wall Posters, Anime Art & Split Triptychs | Chennai`,
      description:
        "Discover aesthetic wall posters, continuous 3-panel split triptychs, anime prints, and custom framing from Happy Walls, Palavakkam, Chennai. Fast 24-48 hr delivery across Chennai.",
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: `${SITE_CONFIG.url}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Happy Walls — Handcrafted Wall Posters & Triptychs in Palavakkam, Chennai",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_CONFIG.name} | Wall Posters & Split Triptychs in Chennai`,
      description:
        "Aesthetic wall posters, anime & gaming prints, and 3-piece continuous triptychs delivered across Chennai in 24-48 hrs.",
      images: [`${SITE_CONFIG.url}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateStructuredData() {
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": ["OnlineStore", "HomeGoodsStore", "LocalBusiness"],
    "@id": `${SITE_CONFIG.url}/#store`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/icon-512.png`,
    image: `${SITE_CONFIG.url}/og-image.jpg`,
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.locality,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.9620,
      longitude: 80.2520,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Chennai",
      },
      {
        "@type": "AdministrativeArea",
        name: "Tamil Nadu",
      },
      {
        "@type": "Country",
        name: "India",
      },
    ],
    sameAs: [SITE_CONFIG.contact.instagram],
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "UPI, Google Pay, PhonePe, Paytm, Net Banking, Cash on Delivery",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    publisher: {
      "@id": `${SITE_CONFIG.url}/#store`,
    },
    inLanguage: "en-IN",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Happy Walls Signature Poster Collections",
    description: "Curated wall posters across Anime, Gaming, and Continuous Split Triptychs.",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Anime Posters",
        url: `${SITE_CONFIG.url}/#collections`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gaming Battlestation Posters",
        url: `${SITE_CONFIG.url}/#collections`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "3-Panel Continuous Split Posters (Triptychs)",
        url: `${SITE_CONFIG.url}/#collections`,
      },
    ],
  };

  return {
    storeSchema,
    websiteSchema,
    faqSchema,
    collectionSchema,
  };
}
