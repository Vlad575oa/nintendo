import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { QuickFilters } from "@/components/QuickFilters";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Suspense } from "react";
import { CookieBanner } from "@/components/CookieBanner";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <Header />
      <Suspense fallback={null}>
        <QuickFilters />
      </Suspense>
      <main className="flex-grow">
        {children}
      </main>
      <div className="h-14 lg:hidden" />
      <Footer />
      <FloatingContact />
      <MobileBottomNav />
      <CookieBanner />
    </>
  );
}
