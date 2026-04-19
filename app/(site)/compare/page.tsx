"use client";

import { useCompareStore } from "@/features/product/store/useCompareStore";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Scale, ShoppingCart, Heart, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useWishlistStore } from "@/features/product/store/useWishlistStore";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  priceOld?: number | null;
  images: string[];
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  brand?: string | null;
  description?: string | null;
  attributes?: Record<string, string> | null;
  category?: { slug: string; name: string };
}

export default function ComparePage() {
  const ids = useCompareStore((s) => s.ids);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const addToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) { setLoading(false); return; }
    fetch(`/api/products/recent?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        // preserve order
        const map = new Map(data.map((p) => [p.id, p]));
        setProducts(ids.map((id) => map.get(id)).filter(Boolean) as Product[]);
      })
      .finally(() => setLoading(false));
  }, [ids.join(",")]);

  // Dynamically collect all attribute keys from all products being compared
  const dynamicAttrKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.attributes || {})))
  );

  const compareAttrs = [
    { key: "price", label: "Цена" },
    { key: "brand", label: "Бренд" },
    { key: "inStock", label: "Наличие" },
    { key: "description", label: "Описание" },
    ...dynamicAttrKeys.map((key) => ({ key: `attr_${key}`, label: key })),
  ];

  const getValue = (product: Product, key: string): string => {
    if (key === "price") return formatPrice(product.price);
    if (key === "brand") return product.brand ?? "—";
    if (key === "inStock") return product.inStock ? "В наличии" : "Под заказ";
    if (key === "description") return product.description ?? "—";
    if (key.startsWith("attr_")) {
      const attrKey = key.replace("attr_", "");
      return (product.attributes as any)?.[attrKey] ?? "—";
    }
    return "—";
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      {/* Page Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 rounded-xl hover:bg-neutral-100 transition-colors">
                <ArrowLeft size={18} className="text-neutral-500" />
              </Link>
              <div>
                <h1 className="text-2xl font-black text-secondary flex items-center gap-2">
                  <Scale size={22} className="text-blue-500" />
                  Сравнение товаров
                </h1>
                <p className="text-xs text-neutral-400 font-bold mt-0.5">
                  {products.length} {products.length === 1 ? "товар" : products.length < 5 ? "товара" : "товаров"} · максимум 4
                </p>
              </div>
            </div>
            {products.length > 0 && (
              <button
                onClick={clear}
                className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <X size={14} /> Очистить всё
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container px-4 py-10">
        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
              <Scale size={40} className="text-blue-300" />
            </div>
            <h2 className="text-2xl font-black text-secondary mb-2">Список сравнения пуст</h2>
            <p className="text-neutral-400 font-medium mb-8 max-w-sm">
              Добавляйте товары нажав <Scale size={14} className="inline" /> на карточке товара — до 4 позиций
            </p>
            <Link
              href="/catalog/all"
              className="px-8 py-3 bg-primary text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-primary/20"
            >
              Перейти в каталог
            </Link>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-28">
            <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          </div>
        )}

        {/* Compare Table */}
        {!loading && products.length > 0 && (
          <div className="overflow-x-auto rounded-3xl pb-4">
            <table className="w-full border-collapse min-w-[640px]">
              {/* Product Cards Row */}
              <thead>
                <tr>
                  <th className="w-[180px] text-left pr-4 align-top py-4">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Характеристика</span>
                  </th>
                  {products.map((p) => (
                    <th key={p.id} className="align-top px-3 py-4 min-w-[220px]">
                      <div className="bg-white rounded-3xl border border-neutral-100 p-4 relative shadow-sm hover:shadow-md transition-shadow">
                        {/* Remove */}
                        <button
                          onClick={() => remove(p.id)}
                          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-neutral-100 hover:bg-red-500 hover:text-white flex items-center justify-center text-neutral-500 transition-all shadow-sm"
                          title="Убрать из сравнения"
                        >
                          <X size={14} />
                        </button>

                        {/* Image */}
                        <Link href={`/catalog/${p.category?.slug}/${p.slug}`}>
                          <div className="relative h-36 mb-3">
                            <Image
                              src={p.images[0] || "/placeholder.jpg"}
                              alt={p.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </Link>

                        {/* Name */}
                        <Link href={`/catalog/${p.category?.slug}/${p.slug}`}>
                          <h3 className="text-[11px] font-black text-secondary leading-[1.3] line-clamp-2 hover:text-primary transition-colors mb-3 text-left">
                            {p.name}
                          </h3>
                        </Link>

                        {/* Price */}
                        <p className="text-xl font-black text-secondary mb-3 text-left">{formatPrice(p.price)}</p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(p as any)}
                            className="flex-1 h-9 bg-orange-500 text-white rounded-xl text-[10px] font-black hover:bg-orange-600 transition-all flex items-center justify-center gap-1.5"
                          >
                            <ShoppingCart size={14} />
                            В корзину
                          </button>
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                              inWishlist(p.id)
                                ? "bg-red-500 text-white"
                                : "bg-neutral-100 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                            }`}
                          >
                            <Heart size={14} />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Attribute Rows */}
              <tbody>
                {compareAttrs.map((attr, idx) => (
                  <tr
                    key={attr.key}
                    className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50/60"}
                  >
                    <td className="py-4 pr-4 pl-4 rounded-l-2xl align-top">
                      <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">
                        {attr.label}
                      </span>
                    </td>
                    {products.map((p) => {
                      const val = getValue(p, attr.key);
                      const isInStock = attr.key === "inStock";
                      return (
                        <td key={p.id} className="px-5 py-4 rounded-2xl align-top">
                          {isInStock ? (
                            <span className={`flex items-center gap-1.5 text-xs font-black ${p.inStock ? "text-green-600" : "text-orange-500"}`}>
                              {p.inStock
                                ? <CheckCircle2 size={14} />
                                : <XCircle size={14} />
                              }
                              {val}
                            </span>
                          ) : attr.key === "description" ? (
                             <div 
                                className="text-xs font-medium text-neutral-600 leading-relaxed line-clamp-6 prose prose-sm max-w-none prose-p:my-1" 
                                dangerouslySetInnerHTML={{ __html: val }} 
                             />
                          ) : (
                            <span className="text-xs font-bold text-secondary line-clamp-3">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
