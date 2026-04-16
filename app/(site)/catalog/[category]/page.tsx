import { getCategoryBySlug, getProducts, getProductsCount } from "@/lib/queries";
import { ProductCard } from "@/features/product/components/ProductCard";
import { FilterSidebar } from "@/features/catalog/components/FilterSidebar";
import { SortingSelect } from "@/features/catalog/components/SortingSelect";
import { ActiveFiltersBar } from "@/features/catalog/components/ActiveFiltersBar";
import { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  const title = category
    ? `${category.name} | Nintendo Shop`
    : "Каталог | Nintendo Shop";
  return {
    title,
    description: `Большой выбор товаров в категории ${category?.name ?? "Каталог"}. Лучшие цены и гарантия.`,
  };
}

interface CatalogPageProps {
  params: { category: string };
  searchParams: {
    priceMin?: string;
    priceMax?: string;
    color?: string;
    status?: string;
    sort?: string;
    page?: string;
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CatalogPageProps) {
  const { category } = params;
  const { priceMin, priceMax, color, status, sort, page = "1" } = searchParams;

  const pageSize = 12;
  const skip = (parseInt(page) - 1) * pageSize;

  // ── Build Prisma where filter ──────────────────────────────────────────────
  const where: any = {};

  if (category !== "all") {
    where.category = { slug: category };
  }

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
    // Apply only when one option is selected (both = no restriction)
    if (wantsInStock && !wantsOnOrder) where.inStock = true;
    if (wantsOnOrder && !wantsInStock) where.inStock = false;
  }

  // ── Sorting ────────────────────────────────────────────────────────────────
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "newest") orderBy = { createdAt: "desc" };

  // ── Data ───────────────────────────────────────────────────────────────────
  const [products, totalCount, categoryData] = await Promise.all([
    getProducts(where, orderBy, skip, pageSize),
    getProductsCount(where),
    category !== "all"
      ? getCategoryBySlug(category)
      : Promise.resolve({ name: "Весь каталог" }),
  ]);

  const hasFilters = !!(priceMin || priceMax || color || status);

  return (
    <main className="container py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-[280px] flex-shrink-0">
          <FilterSidebar currentCategory={category} totalCount={totalCount} />
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-black text-secondary leading-tight">
                {categoryData?.name ?? "Каталог"}
              </h1>
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-1">
                {totalCount} товаров найдено
              </p>
            </div>
            <SortingSelect />
          </div>

          {/* Active filter chips */}
          <ActiveFiltersBar />

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-[32px] py-32 text-center">
              <p className="text-xl text-neutral-400 font-bold">Ничего не найдено</p>
              <p className="text-neutral-500 mt-2 text-sm">
                {hasFilters
                  ? "Попробуйте изменить параметры фильтрации"
                  : "В этой категории пока нет товаров"}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
