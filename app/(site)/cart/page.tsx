"use client";

import { useCartStore } from "@/features/cart/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <main className="container py-32 text-center">
        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Trash2 size={32} className="text-neutral-400" />
        </div>
        <h1 className="text-3xl font-black text-secondary mb-4">Ваша корзина пуста</h1>
        <p className="text-neutral-500 mb-10">Но это никогда не поздно исправить!</p>
        <Link href="/">
          <Button size="lg" className="rounded-2xl">Перейти в каталог</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-12 lg:py-20">
      <h1 className="text-4xl font-black text-secondary mb-12">Корзина</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 pb-8 border-b border-neutral-100 last:border-0 relative">
              <div className="w-32 h-32 bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-100 flex-shrink-0 relative">
                <Image src={item.image} alt={item.name} fill className="object-contain p-4" />
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <Link href={`/catalog/any/${item.slug}`} className="text-lg font-bold text-secondary hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-sm font-bold text-primary mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-neutral-100 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-white rounded-lg transition-colors text-neutral-500"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-black text-secondary">{item.quantity || 1}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-white rounded-lg transition-colors text-neutral-500"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm font-bold text-neutral-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={16} />
                    Удалить
                  </button>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <p className="text-lg font-black text-secondary">
                  {formatPrice((item.price) * (item.quantity || 1))}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-neutral-50 p-8 rounded-[40px] border border-neutral-100">
            <h2 className="text-2xl font-black text-secondary mb-8">Итого</h2>
            
            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-neutral-500 font-bold">
                <span>Товары ({totalItems()})</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-neutral-500 font-bold">
                <span>Доставка</span>
                <span className="text-primary uppercase text-xs tracking-widest">Бесплатно</span>
              </div>
              <div className="pt-4 border-t border-neutral-200 flex justify-between">
                <span className="text-lg font-black text-secondary">К оплате</span>
                <span className="text-2xl font-black text-primary">
                  {formatPrice(totalPrice())}
                </span>
              </div>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full h-16 rounded-2xl gap-2">
                Оформить заказ
                <ArrowRight size={20} />
              </Button>
            </Link>

            <p className="text-[10px] text-neutral-400 text-center mt-6 uppercase font-bold tracking-widest leading-relaxed px-4">
              Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
            </p>
          </div>

          <div className="bg-green-50/50 border border-green-100 p-6 rounded-3xl flex gap-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-black">!</span>
            </div>
            <p className="text-xs font-bold text-green-800 leading-normal">
              Поздравляем! Ваш заказ попадает под акцию <span className="underline">Бесплатная доставка</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
