import type { Metadata, Viewport } from "next";
import "./globals.css";
import { constructMetadata, generateStructuredData } from "@/lib/seo";
import { CartProvider } from "@/context/CartContext";

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
  const { localBusinessSchema, websiteSchema, faqSchema } = generateStructuredData();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="bg-charcoal-dark text-white font-inter min-h-screen selection:bg-brand-yellow selection:text-charcoal-dark antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
