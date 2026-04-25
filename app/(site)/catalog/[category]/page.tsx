import { getCategoryBySlug } from "@/lib/queries";
import { Catalog } from "@/features/catalog/components/Catalog";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gameshop24.ru";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  const title = category
    ? `${category.name} — Купить недорого в Gameshop24`
    : "Каталог игровых консолей | Gameshop24";
  
  const description = `Большой выбор товаров в категории ${category?.name ?? "Каталог"}. Лучшие цены, официальная гарантия и быстрая доставка по всей России.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/catalog/${params.category}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

interface CatalogPageProps {
  params: { category: string };
  searchParams: Record<string, string | undefined>;
}

export default async function CategoryPage({ params, searchParams }: CatalogPageProps) {
  const { category } = params;
  if (category !== "all") {
    const categoryData = await getCategoryBySlug(category);
    if (!categoryData) notFound();
  }

  return (
    <main className="container py-12">
      <Catalog category={category} searchParams={searchParams} />
    </main>
  );
}
