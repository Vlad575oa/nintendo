import { Catalog } from "@/features/catalog/components/Catalog";
import { Hero } from "@/features/home/components/Hero";
import { TrustBar } from "@/features/home/components/TrustBar";
import { CategoryGrid } from "@/features/home/components/CategoryGrid";
import { WhyUs } from "@/features/home/components/WhyUs";
import { ExpertInsights } from "@/features/home/components/ExpertInsights";
import { FinalCta } from "@/features/home/components/FinalCta";
import loadDynamic from "next/dynamic";
import { Metadata } from "next";

const RecentlyViewed = loadDynamic(
  () =>
    import("@/features/product/components/RecentlyViewed").then((m) => ({
      default: m.RecentlyViewed,
    })),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Nintendo Shop | Премиальный магазин консолей и игр",
  description: "Официальные консоли, редкие аксессуары и экспертные обзоры. Nintendo Shop — твой проводник в мир премиального гейминга 2026.",
  alternates: {
    canonical: "/",
  },
};

interface HomePageProps {
  searchParams: Record<string, string | undefined>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  return (
    <main className="container pt-6 pb-20">
      {/* 1. Marketing Upper Layer */}
      <Hero />
      <TrustBar />
      
      {/* 2. Navigation Layer */}
      <CategoryGrid />
      
      {/* 3. Competitive Advantage */}
      <WhyUs />

      {/* 4. Product Catalog (Main Action) */}
      <div id="catalog" className="mb-20 scroll-mt-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Live Inventory</h2>
            <h3 className="text-3xl md:text-5xl font-black text-secondary dark:text-white uppercase tracking-tighter leading-none">
              Актуальный каталог
            </h3>
          </div>
        </div>
        <Catalog category="all" searchParams={searchParams} pageSize={12} />
      </div>

      {/* 5. Expert Content */}
      <ExpertInsights />

      {/* 6. Utility & Finale */}
      <RecentlyViewed />
      <FinalCta />
    </main>
  );
}

