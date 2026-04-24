import { Catalog } from "@/features/catalog/components/Catalog";
import { Hero } from "@/features/home/components/Hero";
import { QualityBadges } from "@/features/home/components/QualityBadges";
import { CategoryGrid } from "@/features/home/components/CategoryGrid";
import { AboutSection } from "@/features/home/components/AboutSection";
import { ExpertInsights } from "@/features/home/components/ExpertInsights";
import { FinalCta } from "@/features/home/components/FinalCta";
import loadDynamic from "next/dynamic";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const RecentlyViewed = loadDynamic(
  () => import("@/features/product/components/RecentlyViewed").then((m) => m.RecentlyViewed),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Gameshop24 | Премиальный магазин консолей и игр",
  description: "Официальные консоли, редкие аксессуары и экспертные обзоры. Gameshop24 — твой проводник в мир премиального гейминга 2026.",
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


      <div id="catalog" className="mb-20 scroll-mt-24">
        <Catalog category="all" searchParams={searchParams} pageSize={12} />
      </div>

      <ExpertInsights />
      <RecentlyViewed />
    </main>
  );
}
