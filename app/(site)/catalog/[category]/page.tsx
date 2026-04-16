import { getCategoryBySlug, getProducts, getProductsCount } from "@/lib/queries";
import { ProductCard } from "@/features/product/components/ProductCard";
import { FilterSidebar } from "@/features/catalog/components/FilterSidebar";
import { SortingSelect } from "@/features/catalog/components/SortingSelect";
import { ActiveFiltersBar } from "@/features/catalog/components/ActiveFiltersBar";
import { CATEGORY_FILTERS } from "@/features/catalog/config/categoryFilters";
import { Metadata } from "next";
import { Prisma } from "@prisma/client";

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
  searchParams: Record<string, string | undefined>;
}

export default async function CategoryPage({ params, searchParams }: CatalogPageProps) {
  const { category } = params;
  const { priceMin, priceMax, color, status, sort, page = "1" } = searchParams;

  const pageSize = 12;
  const skip = (parseInt(page) - 1) * pageSize;

  // ── Common filters ─────────────────────────────────────────────────────────
  const andConditions: Prisma.ProductWhereInput[] = [];

  if (category !== "all") {
    andConditions.push({ category: { slug: category } });
  }

  if (priceMin || priceMax) {
    andConditions.push({
      price: {
        ...(priceMin ? { gte: parseInt(priceMin) * 100 } : {}),
        ...(priceMax ? { lte: parseInt(priceMax) * 100 } : {}),
      },
    });
  }

  if (color) {
    const colorValues = color.split(",").filter(Boolean);
    andConditions.push({
      color: colorValues.length === 1 ? colorValues[0] : { in: colorValues },
    });
  }

  if (status) {
    const statusValues = status.split(",").filter(Boolean);
    const wantsInStock = statusValues.includes("inStock");
    const wantsOnOrder = statusValues.includes("onOrder");
    if (wantsInStock && !wantsOnOrder) andConditions.push({ inStock: true });
    if (wantsOnOrder && !wantsInStock) andConditions.push({ inStock: false });
  }

  // ── Category-specific attribute filters ───────────────────────────────────
  const categoryFilterSections = CATEGORY_FILTERS[category] ?? [];
  for (const section of categoryFilterSections) {
    const raw = searchParams[section.paramKey];
    if (!raw) continue;
    const values = raw.split(",").filter(Boolean);
    if (!values.length) continue;

    // Use JSON path filtering on the attributes field
    // For multi-value → OR across values
    const attrKey = section.paramKey.replace("attr_", "");
    andConditions.push({
      OR: values.map((v) => ({
        attributes: {
          path: [attrKey],
          string_contains: v,
        },
      })),
    });
  }

  const where: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // ── Sorting ────────────────────────────────────────────────────────────────
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
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

  const hasFilters = Object.keys(searchParams).some(
    (k) => k !== "sort" && k !== "page" && searchParams[k]
  );

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
