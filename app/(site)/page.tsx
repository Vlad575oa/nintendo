import { getCategories, getNewProducts } from "@/lib/queries";
import { Hero } from "@/features/catalog/components/Hero";
import { CategoryCard } from "@/features/catalog/components/CategoryCard";
import { ProductCard } from "@/features/product/components/ProductCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const categories = await getCategories();
  const newProducts = await getNewProducts(8);

  return (
    <main className="container pb-20">
      <Hero />

      {/* Categories Grid */}
      <section className="mt-20">
        <div className="flex items-end justify-between mb-10 px-4">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 leading-tight">Популярные категории</h2>
            <p className="text-neutral-500 mt-2">Все, что нужно для комфортного гейминга</p>
          </div>
          <Link href="/catalog" className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
            Все категории <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <CategoryCard key={cat.id} name={cat.name} slug={cat.slug} />
            ))
          ) : (
            // Placeholder categories if DB is empty
            ["PlayStation", "Xbox", "Nintendo", "Геймпады", "Аксессуары", "Игры"].map((name) => (
              <CategoryCard key={name} name={name} slug={name.toLowerCase()} />
            ))
          )}
        </div>
      </section>

      {/* New Arrivals Scroll */}
      <section className="mt-28">
        <div className="flex items-end justify-between mb-10 px-4">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 leading-tight">Новые поступления</h2>
            <p className="text-neutral-500 mt-2">Последние новинки из мира консолей и игр</p>
          </div>
          <Link href="/catalog?sort=newest" className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
            Смотреть все <ChevronRight size={16} />
          </Link>
        </div>

        <div className="relative group/scroll px-4">
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
            {newProducts.length > 0 ? (
              newProducts.map((product) => (
                <div key={product.id} className="min-w-[280px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="py-20 text-center w-full bg-neutral-50 rounded-3xl text-neutral-400">
                Товары скоро появятся в продаже
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
