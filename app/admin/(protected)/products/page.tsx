import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Search, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ProductDeleteButton } from "./ProductDeleteButton";
import { ProductDuplicateButton } from "./ProductDuplicateButton";
import { ProductHideButton } from "./ProductHideButton";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: { q?: string; category?: string };
}

export default async function ProductsPage({ searchParams }: Props) {
  const q = searchParams.q ?? "";
  const categorySlug = searchParams.category ?? "";
  const session = await verifyAdminSession(cookies().get(ADMIN_COOKIE)?.value);
  const canDeleteProducts = session?.r !== "MANAGER";
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  let selectedCategoryIds: number[] = [];
  if (categorySlug) {
    const root = categories.find((c) => c.slug === categorySlug);
    if (root) {
      const byParent = new Map<number, number[]>();
      for (const c of categories) {
        if (c.parentId == null) continue;
        const bucket = byParent.get(c.parentId) ?? [];
        bucket.push(c.id);
        byParent.set(c.parentId, bucket);
      }
      const stack = [root.id];
      while (stack.length) {
        const current = stack.pop()!;
        selectedCategoryIds.push(current);
        const children = byParent.get(current) ?? [];
        for (const childId of children) stack.push(childId);
      }

    }
  }

  const products = await prisma.product.findMany({
    where: {
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
      ...(categorySlug
        ? selectedCategoryIds.length
          ? { categoryId: { in: selectedCategoryIds } }
          : { category: { slug: categorySlug } }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <header className="bg-white border-b border-neutral-100 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#111827]">Товары</h1>
          <p className="text-xs text-neutral-400 font-bold mt-0.5">{products.length} позиций</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-primary text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={14} /> Добавить
        </Link>
      </header>

      <div className="p-8 space-y-5">

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pb-1 overflow-x-auto no-scrollbar">
          <Link
            href="/admin/products"
            className={cn(
              "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
              !categorySlug
                ? "bg-[#111827] text-white shadow-lg shadow-black/10"
                : "bg-white border border-neutral-200 text-neutral-400 hover:text-[#111827] hover:border-neutral-300"
            )}
          >
            Все
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/admin/products?category=${cat.slug}${q ? `&q=${q}` : ""}`}
              className={cn(
                "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                categorySlug === cat.slug
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white border border-neutral-200 text-neutral-400 hover:text-primary hover:border-primary/30"
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Filters */}
        <form method="get" className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Поиск по названию..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-bold text-[#111827] placeholder:text-neutral-300 outline-none focus:border-primary/30"
            />
          </div>
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          <button type="submit" className="px-5 py-2.5 bg-[#111827] text-white text-xs font-black rounded-xl hover:bg-neutral-800 transition-all">
            Найти
          </button>
        </form>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100">
                {["Фото", "Название", "Категория", "Цена", "Наличие", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[9px] font-black uppercase tracking-widest text-neutral-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-20 text-center">
                    <Package size={40} className="mx-auto mb-3 text-neutral-200" />
                    <p className="text-neutral-400 font-bold text-sm">Товаров не найдено</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className={`border-b border-neutral-50 last:border-0 transition-colors ${p.isVisible === false ? "opacity-50 bg-neutral-50/80" : "hover:bg-neutral-50/50"}`}>
                    <td className="px-5 py-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100 flex-shrink-0">
                        {p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <Package size={20} className="m-auto text-neutral-300 mt-3" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-black text-[#111827] line-clamp-1 max-w-[260px]">{p.name}</p>
                      <p className="text-[10px] text-neutral-400 font-bold mt-0.5">{p.slug}</p>
                    </td>
                    <td className="px-5 py-3 text-xs font-bold text-neutral-500">{p.category.name}</td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-black text-[#111827]">{formatPrice(p.price)}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {p.inStock ? "В наличии" : "Нет"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <ProductDuplicateButton productId={p.id} />
                        <ProductHideButton productId={p.id} isVisible={p.isVisible !== false} />
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all"
                        >
                          <Pencil size={13} />
                        </Link>
                        {canDeleteProducts && (
                          <ProductDeleteButton productId={p.id} productName={p.name} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
