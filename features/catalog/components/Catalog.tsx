import { getProducts, getProductsCount, getCategoryBySlug, getCategoryTree } from "@/lib/queries";
import { ProductCard } from "@/features/product/components/ProductCard";
import { FilterSidebar } from "@/features/catalog/components/FilterSidebar";
import { SortingSelect } from "@/features/catalog/components/SortingSelect";
import { ActiveFiltersBar } from "@/features/catalog/components/ActiveFiltersBar";
import { CATEGORY_FILTERS } from "@/features/catalog/config/categoryFilters";
import { Pagination } from "./Pagination";
import { Prisma } from "@prisma/client";

interface CatalogProps {
  category: string;
  searchParams: Record<string, string | undefined>;
  pageSize?: number;
}

export async function Catalog({ category, searchParams, pageSize = 12 }: CatalogProps) {
  const { priceMin, priceMax, color, status, sort, page = "1" } = searchParams;
  const skip = (parseInt(page) - 1) * pageSize;

  // ── Build Prisma filters ───────────────────────────────────────────────────
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

  // ── Data Fetching ─────────────────────────────────────────────────────────
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let totalCount = 0;
  let categoryData: { name: string } | null = { name: "Весь каталог" };
  let categoryTree: Awaited<ReturnType<typeof getCategoryTree>> = [];
  let dbError = false;

  let errorMsg = "";
  try {
    [products, totalCount, categoryData, categoryTree] = await Promise.all([
      getProducts(where, orderBy, skip, pageSize),
      getProductsCount(where),
      category !== "all"
        ? getCategoryBySlug(category)
        : Promise.resolve({ name: "Весь каталог" }),
      getCategoryTree(),
    ]);
  } catch (err: any) {
    dbError = true;
    errorMsg = err.message || "Unknown error";
    console.error("CATALOG FETCH ERROR:", err);
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  const hasFilters = Object.keys(searchParams).some(
    (k) => k !== "sort" && k !== "page" && searchParams[k]
  );

  if (dbError) {
    return (
      <div className="py-32 text-center">
        <p className="text-4xl mb-4">⚙️</p>
        <p className="text-xl font-black text-secondary mb-2">Каталог временно недоступен</p>
        <p className="text-sm text-neutral-400 font-medium">Мы уже работаем над устранением проблемы. Попробуйте позже.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Sidebar */}
      <aside className="w-full lg:w-[280px] flex-shrink-0">
        <FilterSidebar 
          currentCategory={category} 
          totalCount={totalCount} 
          categoryTree={categoryTree}
        />
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination totalPages={totalPages} />
          </>
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
  );
}
