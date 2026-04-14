import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const otterco = localFont({
  src: [
    {
      path: "./fonts/OttercoDisplay-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/OttercoDisplay-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-otterco",
});

export const metadata = {
  metadataBase: new URL("https://pureglim.com.au"),
  title: {
    default: "PureGlim | House Cleaning — Sydney Eastern & Northern Suburbs",
    template: "%s | PureGlim Sydney",
  },
  description:
    "Professional home and office cleaning in Sydney's Eastern and Northern Suburbs. Regular cleaning from $150, end of lease from $340. Serving Bondi, Double Bay, Vaucluse, Mosman, Neutral Bay, North Sydney and more.",
  keywords: [
    "cleaning service Sydney",
    "house cleaner Eastern Suburbs",
    "end of lease cleaning Bondi",
    "house cleaner Mosman",
    "bond cleaning Sydney",
    "residential cleaning Sydney",
    "cleaning service Northern Suburbs Sydney",
    "end of lease cleaner Double Bay",
    "house cleaning Paddington",
    "cleaner Neutral Bay",
  ],
  authors: [{ name: "PureGlim" }],
  creator: "PureGlim",
  publisher: "PureGlim",
  formatDetection: { telephone: true, email: true },
  openGraph: {
    type: "website",
    url: "https://pureglim.com.au",
    siteName: "PureGlim",
    title: "PureGlim | House Cleaning — Sydney Eastern & Northern Suburbs",
    description:
      "Professional home and office cleaning in Sydney's Eastern and Northern Suburbs. Regular cleaning from $150, end of lease from $340.",
    locale: "en_AU",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PureGlim — Professional Cleaning Services, Sydney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PureGlim | House Cleaning — Sydney",
    description:
      "Professional home and office cleaning in Sydney's Eastern and Northern Suburbs. From $150.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://pureglim.com.au/#business",
  name: "PureGlim",
  description:
    "Professional residential and commercial cleaning services in Sydney's Eastern and Northern Suburbs.",
  url: "https://pureglim.com.au",
  telephone: "+61449963099",
  email: "pureglimsydney@gmail.com",
  image: "https://pureglim.com.au/og-image.jpg",
  priceRange: "$$",
  currenciesAccepted: "AUD",
  paymentAccepted: "Cash, Credit Card, Bank Transfer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sydney",
    addressRegion: "NSW",
    addressCountry: "AU",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  areaServed: [
    { "@type": "City", "name": "Sydney" },
    { "@type": "Suburb", "name": "Bondi" },
    { "@type": "Suburb", "name": "Bondi Junction" },
    { "@type": "Suburb", "name": "Bronte" },
    { "@type": "Suburb", "name": "Coogee" },
    { "@type": "Suburb", "name": "Tamarama" },
    { "@type": "Suburb", "name": "Double Bay" },
    { "@type": "Suburb", "name": "Rose Bay" },
    { "@type": "Suburb", "name": "Vaucluse" },
    { "@type": "Suburb", "name": "Bellevue Hill" },
    { "@type": "Suburb", "name": "Woollahra" },
    { "@type": "Suburb", "name": "Paddington" },
    { "@type": "Suburb", "name": "Randwick" },
    { "@type": "Suburb", "name": "Clovelly" },
    { "@type": "Suburb", "name": "Mosman" },
    { "@type": "Suburb", "name": "Neutral Bay" },
    { "@type": "Suburb", "name": "Cremorne" },
    { "@type": "Suburb", "name": "Kirribilli" },
    { "@type": "Suburb", "name": "North Sydney" },
    { "@type": "Suburb", "name": "Crows Nest" },
    { "@type": "Suburb", "name": "Chatswood" },
    { "@type": "Suburb", "name": "Lane Cove" },
    { "@type": "Suburb", "name": "Willoughby" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cleaning Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "One Time / Regular Cleaning",
          description:
            "One-off or recurring residential cleaning — weekly, fortnightly, or monthly. Includes kitchen, bathrooms, vacuuming, mopping, and general tidying.",
        },
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "150",
          priceCurrency: "AUD",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "End of Lease Cleaning",
          description:
            "Thorough bond-back clean for tenancy handovers and property inspections. Includes cupboards, skirting boards, appliances, and mould treatment.",
        },
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "340",
          priceCurrency: "AUD",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Commercial Cleaning",
          description:
            "Office and workplace cleaning scheduled around your business hours. Custom plans for offices, retail, and shared spaces.",
        },
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <body className={otterco.variable}>
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </body>
    </html>
  );
}
