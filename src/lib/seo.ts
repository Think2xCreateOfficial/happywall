import { Metadata } from "next";
import { SITE_CONFIG } from "@/data/site-config";
import { FAQS } from "@/data/faqs";

export function constructMetadata(): Metadata {
  return {
    title: `${SITE_CONFIG.name} | Wall Posters, Anime Art & Custom Prints in Chennai`,
    description: SITE_CONFIG.description,
    keywords: [
      "Happy Walls",
      "Wall Posters Chennai",
      "Custom Poster Prints Chennai",
      "Palavakkam Wall Posters",
      "Anime Posters Chennai",
      "Gaming Posters India",
      "Split Posters Triptych",
      "Framed Wall Art Chennai",
      "Aesthetic Room Decor",
      "Poster Store Palavakkam",
    ],
    authors: [{ name: "Happy Walls" }],
    creator: "Think2xCreate",
    publisher: "Happy Walls",
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${SITE_CONFIG.name} — Your Walls. Your Story.`,
      description: SITE_CONFIG.description,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "/images/hero/hero-gallery-cluster.webp",
          width: 1200,
          height: 630,
          alt: "Happy Walls — Online Wall Poster Store in Chennai",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_CONFIG.name} | Wall Posters & Prints in Chennai`,
      description: SITE_CONFIG.description,
      images: ["/images/hero/hero-gallery-cluster.webp"],
    },
    robots: {
      index: true,
      follow: true,
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
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/#business`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.contact.phone,
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
      latitude: "12.9620",
      longitude: "80.2520",
    },
    sameAs: [
      SITE_CONFIG.contact.instagram,
    ],
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "UPI, GPay, PhonePe, Bank Transfer",
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
      "@id": `${SITE_CONFIG.url}/#business`,
    },
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

  return {
    localBusinessSchema,
    websiteSchema,
    faqSchema,
  };
}
