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

export const metadata: Metadata = {
  title: "Nintendo Shop | Магазин игровых консолей",
  description: "Лучший выбор PlayStation, Xbox и Nintendo с доставкой по всей России.",
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

