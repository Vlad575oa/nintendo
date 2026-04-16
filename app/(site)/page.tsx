export const dynamic = "force-dynamic";

import { getProducts, getProductsCount } from "@/lib/queries";
import { ProductCard } from "@/features/product/components/ProductCard";
import { FilterSidebar } from "@/features/catalog/components/FilterSidebar";
import { SortingSelect } from "@/features/catalog/components/SortingSelect";
import { ActiveFiltersBar } from "@/features/catalog/components/ActiveFiltersBar";
import loadDynamic from "next/dynamic";
import { Prisma } from "@prisma/client";

const RecentlyViewed = loadDynamic(
  () =>
    import("@/features/product/components/RecentlyViewed").then((m) => ({
      default: m.RecentlyViewed,
    })),
  { ssr: false }
);

interface HomePageProps {
  searchParams: {
    priceMin?: string;
    priceMax?: string;
    color?: string;
    status?: string;
    sort?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { priceMin, priceMax, color, status, sort } = searchParams;

  // ── Build Prisma where filter ──────────────────────────────────────────────
  const where: Prisma.ProductWhereInput = {};

  if (priceMin || priceMax) {
    where.price = {
      ...(priceMin ? { gte: parseInt(priceMin) * 100 } : {}),
      ...(priceMax ? { lte: parseInt(priceMax) * 100 } : {}),
    };
  }

  if (color) {
    const colorValues = color.split(",").filter(Boolean);
    where.color = colorValues.length === 1 ? colorValues[0] : { in: colorValues };
  }

  if (status) {
    const statusValues = status.split(",").filter(Boolean);
    const wantsInStock = statusValues.includes("inStock");
    const wantsOnOrder = statusValues.includes("onOrder");
    if (wantsInStock && !wantsOnOrder) where.inStock = true;
    if (wantsOnOrder && !wantsInStock) where.inStock = false;
  }

  // ── Sorting ────────────────────────────────────────────────────────────────
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "newest") orderBy = { createdAt: "desc" };

  // ── Data ───────────────────────────────────────────────────────────────────
  const [products, totalCount] = await Promise.all([
    getProducts(where, orderBy, 0, 500),
    getProductsCount(where),
  ]);

  return (
    <main className="container py-12 pb-20">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-[280px] flex-shrink-0">
          <FilterSidebar currentCategory="all" totalCount={totalCount} />
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-black text-neutral-900 leading-tight">
                Все товары
              </h1>
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1">
                {totalCount} товаров найдено
              </p>
            </div>
            <SortingSelect />
          </div>

          <ActiveFiltersBar />

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-[32px] py-32 text-center">
              <p className="text-xl text-neutral-400 font-bold">Ничего не найдено</p>
              <p className="text-neutral-500 mt-2 text-sm">
                Попробуйте изменить параметры фильтрации
              </p>
            </div>
          )}
        </div>
      </div>

      <RecentlyViewed />
    </main>
  );
}
