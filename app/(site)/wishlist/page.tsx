"use client";

import { useWishlistStore } from "@/features/product/store/useWishlistStore";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Heart, ShoppingCart, ArrowLeft, Scale } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useCompareStore } from "@/features/product/store/useCompareStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  category?: { slug: string; name: string };
}

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const remove = useWishlistStore((s) => s.remove);
  const clear = useWishlistStore((s) => s.clear);
  const addToCart = useCartStore((s) => s.addItem);
  const toggleCompare = useCompareStore((s) => s.toggle);
  const inCompare = useCompareStore((s) => s.has);
  const compareFull = useCompareStore((s) => s.isFull());

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) { setLoading(false); return; }
    fetch(`/api/products/recent?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        const map = new Map(data.map((p) => [p.id, p]));
        setProducts(ids.map((id) => map.get(id)).filter(Boolean) as Product[]);
      })
      .finally(() => setLoading(false));
  }, [ids.join(",")]);

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
                  <Heart size={22} className="text-red-500" />
                  Избранное
                </h1>
                <p className="text-xs text-neutral-400 font-bold mt-0.5">
                  {products.length} {products.length === 1 ? "товар" : products.length < 5 ? "товара" : "товаров"}
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
        {/* Empty */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
              <Heart size={40} className="text-red-200" />
            </div>
            <h2 className="text-2xl font-black text-secondary mb-2">Избранное пусто</h2>
            <p className="text-neutral-400 font-medium mb-8 max-w-sm">
              Нажмите <Heart size={14} className="inline text-red-400" /> на карточке товара, чтобы сохранить его сюда
            </p>
            <Link
              href="/"
              className="px-8 py-3 bg-primary text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-primary/20"
            >
              Перейти в каталог
            </Link>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-28">
            <div className="w-10 h-10 rounded-full border-4 border-red-400 border-t-transparent animate-spin" />
          </div>
        )}

        {/* Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                {/* Badges */}
                <div className="relative p-4 pb-0">
                  <div className="absolute top-4 left-4 z-10 flex gap-1 text-[8px] font-black uppercase">
                    {p.isNew && <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full">New</span>}
                    {p.isSale && <span className="bg-red-600 text-white px-2 py-0.5 rounded-full">Sale</span>}
                  </div>

                  {/* Remove from wishlist */}
                  <button
                    onClick={() => remove(p.id)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-neutral-100 hover:bg-red-500 hover:text-white flex items-center justify-center text-neutral-400 transition-all"
                  >
                    <X size={13} />
                  </button>

                  {/* Image */}
                  <Link href={`/catalog/${p.category?.slug}/${p.slug}`}>
                    <div className="relative h-44 mb-3">
                      <Image
                        src={p.images[0] || "/placeholder.jpg"}
                        alt={p.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                </div>

                {/* Info */}
                <div className="p-4 pt-2 flex flex-col flex-1">
                  {p.category && (
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">
                      {p.category.name}
                    </span>
                  )}

                  <Link href={`/catalog/${p.category?.slug}/${p.slug}`} className="flex-1">
                    <h3 className="text-[12px] font-bold text-secondary leading-snug line-clamp-2 hover:text-primary transition-colors mb-2">
                      {p.name}
                    </h3>
                  </Link>

                  <div className="mb-1">
                    <p className="text-lg font-black text-secondary">{formatPrice(p.price)}</p>
                    {p.priceOld && (
                      <p className="text-xs text-neutral-400 line-through">{formatPrice(p.priceOld)}</p>
                    )}
                  </div>

                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-wider mb-3",
                    p.inStock ? "text-green-600" : "text-orange-500"
                  )}>
                    {p.inStock ? "● В наличии" : "○ Под заказ"}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => { addToCart({ id: p.id, name: p.name, slug: p.slug, price: p.price, image: p.images[0] || "/placeholder.jpg", quantity: 1 }); toast.success("Добавлено в корзину", { description: p.name, duration: 2000 }); }}
                      className="flex-1 h-10 bg-orange-500 text-white rounded-xl text-[11px] font-black hover:bg-orange-600 transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart size={14} />
                      В корзину
                    </button>
                    <button
                      onClick={() => toggleCompare(p.id)}
                      title={inCompare(p.id) ? "Убрать из сравнения" : compareFull ? "Сравнение заполнено" : "Добавить к сравнению"}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        inCompare(p.id)
                          ? "bg-blue-500 text-white"
                          : compareFull
                          ? "bg-neutral-100 text-neutral-300 cursor-not-allowed"
                          : "bg-neutral-100 text-neutral-400 hover:bg-blue-50 hover:text-blue-500"
                      )}
                    >
                      <Scale size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
