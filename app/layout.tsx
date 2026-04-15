import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

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
      <body className={`${inter.className} bg-white text-secondary antialiased`}>
        <Header />
        {children}
        {/* Footer could go here */}
      </body>
    </html>
  );
}
