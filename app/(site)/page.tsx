export const dynamic = "force-dynamic";

import { Catalog } from "@/features/catalog/components/Catalog";
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
  title: "Nintendo Shop | Магазин видеоигр и консолей",
  description: "Огромный выбор игр, консолей и аксессуаров Nintendo. Доставка по всей России, гарантия качества.",
  alternates: {
    canonical: "/",
  },
};

interface HomePageProps {
  searchParams: Record<string, string | undefined>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  return (
    <main className="container py-12 pb-20">
      <Catalog category="all" searchParams={searchParams} pageSize={100} />
      <RecentlyViewed />
    </main>
  );
}

