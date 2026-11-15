import type { Metadata, Viewport } from "next";
import "./globals.css";
import { constructMetadata, generateStructuredData } from "@/lib/seo";
import { CartProvider } from "@/context/CartContext";
import { InitialPageLoader } from "@/components/ui/InitialPageLoader";

export const metadata: Metadata = constructMetadata();

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { storeSchema, websiteSchema, faqSchema, collectionSchema } = generateStructuredData();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
      </head>
      <body className="bg-charcoal-dark text-white font-inter min-h-screen selection:bg-brand-yellow selection:text-charcoal-dark antialiased">
        <InitialPageLoader />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
