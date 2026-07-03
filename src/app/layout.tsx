import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Barberia - Premium Barber Shop & Grooming Lounge",
    template: "%s | Barberia",
  },
  description:
    "Book your appointment at Barberia. Premium haircuts, beard trims, hot towel shaves, and expert grooming services in NYC. Award-winning barbers since 2010.",
  keywords: [
    "barber shop",
    "haircut",
    "beard trim",
    "hot towel shave",
    "grooming",
    "NYC barber",
    "premium barber",
  ],
  authors: [{ name: "Barberia" }],
  creator: "Barberia",
  publisher: "Barberia",
  metadataBase: new URL("https://barber-saas-rose.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Barberia",
    title: "Barberia - Premium Barber Shop & Grooming Lounge",
    description:
      "Premium haircuts, beard trims, and hot towel shaves. Award-winning barbers in NYC since 2010.",
    url: "/",
    images: [
      {
        url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Barberia Premium Barber Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barberia - Premium Barber Shop",
    description:
      "Premium haircuts, beard trims, and hot towel shaves. Book your appointment today.",
    images: [
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200&h=630&fit=crop",
    ],
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
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Barberia",
  image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200&h=630&fit=crop",
  "@id": "https://barber-saas-rose.vercel.app",
  url: "https://barber-saas-rose.vercel.app",
  telephone: "+1 (555) 123-4567",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Main Street",
    addressLocality: "New York",
    addressRegion: "NY",
    postalCode: "10001",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.7128,
    longitude: -74.006,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "10:00", closes: "16:00" },
  ],
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-cream dark:bg-charcoal text-charcoal dark:text-white min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold focus:text-charcoal focus:rounded-lg focus:font-semibold focus:shadow-lg">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
