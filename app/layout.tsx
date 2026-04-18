import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { QuickFilters } from "@/components/QuickFilters";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { CookieBanner } from "@/components/CookieBanner";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nintendo-shop.ru";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Nintendo Shop | Магазин игровых консолей и аксессуаров",
    template: "%s | Nintendo Shop"
  },
  description: "Лучший выбор PlayStation, Xbox и Nintendo в России. Оригинальная продукция, официальная гарантия, быстрая доставка и лучшие цены на игровые приставки.",
  keywords: ["Nintendo Switch", "PlayStation 5", "Xbox Series X", "купить консоль", "игровой магазин", "Nintendo Shop"],
  authors: [{ name: "Nintendo Shop Team" }],
  creator: "Nintendo Shop",
  publisher: "Nintendo Shop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nintendo Shop | Магазин игровых консолей",
    description: "Лучший выбор PlayStation, Xbox и Nintendo с доставкой по всей России.",
    url: baseUrl,
    siteName: "Nintendo Shop",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nintendo Shop | Магазин игровых консолей",
    description: "Лучший выбор PlayStation, Xbox и Nintendo с доставкой по всей России.",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
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
      "name": "Nintendo Shop",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/favicon.png`,
        "width": 512,
        "height": 512,
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+7-495-225-99-22",
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
        "https://t.me/nintendoshop",
        "https://vk.com/nintendoshop",
        "https://wa.me/84952259922",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "url": baseUrl,
      "name": "Nintendo Shop",
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
      "name": "Nintendo Shop",
      "url": baseUrl,
      "telephone": "+7-495-225-99-22",
      "priceRange": "₽₽₽",
      "image": `${baseUrl}/favicon.png`,
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
      <body className={`${inter.className} text-secondary antialiased flex flex-col min-h-screen relative`}>
        <TopBar />
        <Header />
        <Suspense fallback={null}>
          <QuickFilters />
        </Suspense>
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FloatingContact />
        <CookieBanner />
      </body>
    </html>
  );
}

