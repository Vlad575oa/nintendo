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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-white text-secondary antialiased flex flex-col min-h-screen`}>
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

