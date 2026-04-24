import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gameshop24.ru";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Gameshop24 | Магазин игровых консолей и аксессуаров",
    template: "%s | Gameshop24"
  },
  description: "Лучший выбор PlayStation, Xbox и Nintendo в России. Оригинальная продукция, официальная гарантия, быстрая доставка и лучшие цены на игровые приставки.",
  keywords: ["Nintendo Switch", "PlayStation 5", "Xbox Series X", "купить консоль", "игровой магазин", "Gameshop24"],
  authors: [{ name: "Gameshop24 Team" }],
  creator: "Gameshop24",
  publisher: "Gameshop24",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Gameshop24 | Магазин игровых консолей",
    description: "Лучший выбор PlayStation, Xbox и Nintendo с доставкой по всей России.",
    url: baseUrl,
    siteName: "Gameshop24",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gameshop24 | Магазин игровых консолей",
    description: "Лучший выбор PlayStation, Xbox и Nintendo с доставкой по всей России.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "Gameshop24",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/favicon.svg`,
        "width": 512,
        "height": 512,
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "7(926)676-34-88",
        "contactType": "customer service",
        "hoursAvailable": "Mo-Su 10:00-21:00",
        "areaServed": "RU",
        "availableLanguage": "Russian",
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "ул. Митинская, д. 10, корп. 1",
        "addressLocality": "Москва",
        "postalCode": "125430",
        "addressCountry": "RU",
      },
      "sameAs": [
        "https://t.me/+79266763488",
        "https://wa.me/79266763488",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "url": baseUrl,
      "name": "Gameshop24",
      "publisher": { "@id": `${baseUrl}/#organization` },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}/#localbusiness`,
      "name": "Gameshop24",
      "url": baseUrl,
      "telephone": "7(926)676-34-88",
      "priceRange": "₽₽₽",
      "image": `${baseUrl}/favicon.svg`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "ул. Митинская, д. 10, корп. 1",
        "addressLocality": "Москва",
        "addressCountry": "RU",
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "10:00",
        "closes": "21:00",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 55.8428,
        "longitude": 37.3541,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.className} bg-[var(--bg-base)] text-[var(--text-primary)] antialiased min-h-screen`}>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
