import { getCategoryBySlug, getProducts, getProductsCount } from "@/lib/queries";
import { ProductCard } from "@/features/product/components/ProductCard";
import { FilterSidebar } from "@/features/catalog/components/FilterSidebar";
import { SortingSelect } from "@/features/catalog/components/SortingSelect";

import { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  const title = category ? `${category.name} | Nintendo Shop` : "Каталог | Nintendo Shop";
  return {
    title,
    description: `Большой выбор товаров в категории ${category?.name || "Каталог"}. Лучшие цены и гарантия.`,
  };
}

interface CatalogPageProps {
  params: { category: string };
  searchParams: {
    priceMin?: string;
    priceMax?: string;
    color?: string;
    sort?: string;
    page?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: CatalogPageProps) {
  const { category } = params;
  const { priceMin, priceMax, color, sort, page = "1" } = searchParams;

  const pageSize = 12;
  const skip = (parseInt(page) - 1) * pageSize;

  // Build filter object
  const where: any = {};
  
  if (category !== "all") {
    where.category = { slug: category };
  }

  if (priceMin || priceMax) {
    where.price = {
      gte: priceMin ? parseInt(priceMin) : undefined,
      lte: priceMax ? parseInt(priceMax) : undefined,
    };
  }

  if (color) {
    where.color = color;
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "newest") orderBy = { createdAt: "desc" };

  const products = await getProducts(where, orderBy, skip, pageSize);
  const totalCount = await getProductsCount(where);
  const categoryData = category !== "all" 
    ? await getCategoryBySlug(category)
    : { name: "Весь каталог" };

  return (
    <main className="container py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <FilterSidebar currentCategory={category} />
        </aside>

        {/* Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-black text-secondary leading-tight">
                {categoryData?.name || "Каталог"}
              </h1>
              <p className="text-neutral-500 mt-1">Найдено {totalCount} товаров</p>
            </div>
            <SortingSelect />
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-[32px] py-32 text-center">
              <p className="text-xl text-neutral-400 font-bold">Ничего не найдено</p>
              <p className="text-neutral-500 mt-2">Попробуйте изменить параметры фильтрации</p>
            </div>
          )}
          
          {/* Pagination would go here */}
        </div>
      </div>
    </main>
  );
}
