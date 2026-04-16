export const dynamic = "force-dynamic";

import { getCategories, getNewProducts, getAllProducts } from "@/lib/queries";
import { Hero } from "@/features/catalog/components/Hero";
import { CategoryCard } from "@/features/catalog/components/CategoryCard";
import { ProductCard } from "@/features/product/components/ProductCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import loadDynamic from "next/dynamic";

const RecentlyViewed = loadDynamic(
  () =>
    import("@/features/product/components/RecentlyViewed").then((m) => ({
      default: m.RecentlyViewed,
    })),
  { ssr: false }
);

export default async function HomePage() {
  const categories = await getCategories();
  const allProducts = await getAllProducts(48);

  return (
    <main className="container pb-20">
      <Hero />

      {/* Categories */}
      <section className="mt-20">
        <div className="flex items-end justify-between mb-10 px-4">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 leading-tight">
              Популярные категории
            </h2>
            <p className="text-neutral-500 mt-2">Все, что нужно для комфортного гейминга</p>
          </div>
          <Link
            href="/catalog/all"
            className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
          >
            Все категории <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <CategoryCard key={cat.id} name={cat.name} slug={cat.slug} />
            ))
          ) : (
            ["PlayStation", "Xbox", "Nintendo", "Геймпады", "Аксессуары", "Игры"].map(
              (name) => (
                <CategoryCard key={name} name={name} slug={name.toLowerCase()} />
              )
            )
          )}
        </div>
      </section>

      {/* All Products Grid */}
      <section className="mt-28">
        <div className="flex items-end justify-between mb-10 px-4">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 leading-tight">
              Все товары
            </h2>
            <p className="text-neutral-500 mt-2">
              {allProducts.length} товаров в наличии
            </p>
          </div>
          <Link
            href="/catalog/all"
            className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
          >
            Смотреть все <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />
    </main>
  );
}
