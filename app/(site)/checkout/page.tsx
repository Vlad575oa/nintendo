"use client";

import { useForm } from "react-hook-form";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Tag, ShoppingBag } from "lucide-react";

interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore();
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const router = useRouter();

  const discount = promoApplied ? Math.floor(totalPrice() * 0.05) : 0;
  const finalTotal = totalPrice() - discount;

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "NINTENDO5") {
      setPromoApplied(true);
    } else {
      setPromoApplied(false);
      setSubmitError("Промокод не найден");
      setTimeout(() => setSubmitError(null), 3000);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setLoading(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          items,
          totalAmount: finalTotal,
          promoCode: promoApplied ? promoCode : undefined,
        }),
      });

      const result = await response.json();
      if (result.confirmationUrl) {
        window.location.href = result.confirmationUrl;
      } else {
        setSubmitError("Ошибка при создании заказа. Попробуйте ещё раз.");
      }
    } catch {
      setSubmitError("Нет соединения с сервером. Проверьте интернет и попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  // Empty cart guard
  if (items.length === 0) {
    return (
      <main className="container py-32 text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={36} className="text-neutral-300" />
        </div>
        <h1 className="text-2xl font-black text-secondary mb-2">Корзина пуста</h1>
        <p className="text-neutral-400 font-medium mb-8">Добавьте товары перед оформлением заказа</p>
        <Link href="/catalog/all" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
          Перейти в каталог
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-12 lg:py-20 max-w-4xl">
      <h1 className="text-4xl font-black text-secondary mb-12">Оформление заказа</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-secondary">Ваши данные</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-neutral-400 mb-2">Имя Фамилия</label>
              <input
                {...register("name", { required: "Введите имя" })}
                className={`w-full px-6 py-4 bg-neutral-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold ${errors.name ? "ring-2 ring-red-500/20" : ""}`}
                placeholder="Иван Иванов"
              />
              {errors.name && <p className="text-xs font-bold text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-400 mb-2">Телефон</label>
              <input
                {...register("phone", {
                  required: "Введите номер телефона",
                  pattern: { value: /^[\+7-9][\d\s\-\(\)]{9,14}$/, message: "Неверный формат телефона" },
                })}
                className={`w-full px-6 py-4 bg-neutral-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold ${errors.phone ? "ring-2 ring-red-500/20" : ""}`}
                placeholder="+7 (999) 000-00-00"
              />
              {errors.phone && <p className="text-xs font-bold text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-400 mb-2">Адрес доставки</label>
              <textarea
                {...register("address", { required: "Введите адрес доставки" })}
                rows={4}
                className={`w-full px-6 py-4 bg-neutral-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold ${errors.address ? "ring-2 ring-red-500/20" : ""}`}
                placeholder="Город, улица, дом, квартира"
              />
              {errors.address && <p className="text-xs font-bold text-red-500 mt-1">{errors.address.message}</p>}
            </div>

            {/* Promo code */}
            <div>
              <label className="block text-sm font-bold text-neutral-400 mb-2 flex items-center gap-1.5">
                <Tag size={13} /> Промокод
              </label>
              <div className="flex gap-2">
                <input
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoApplied(false); }}
                  placeholder="NINTENDO5"
                  className="flex-1 px-6 py-4 bg-neutral-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm uppercase"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  disabled={!promoCode.trim()}
                  className="px-5 py-4 bg-neutral-100 text-secondary rounded-2xl font-black text-sm hover:bg-neutral-200 transition-all disabled:opacity-40"
                >
                  Применить
                </button>
              </div>
              {promoApplied && (
                <p className="text-xs font-bold text-green-600 mt-1">✓ Скидка 5% применена</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-secondary p-8 rounded-[40px] text-white">
            <h2 className="text-2xl font-black mb-8">Заказ</h2>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-neutral-400 font-medium truncate max-w-[150px]">{item.name} × {item.quantity}</span>
                  <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {promoApplied && (
              <div className="flex justify-between text-sm mb-3 text-green-400">
                <span className="font-bold">Скидка (промокод)</span>
                <span className="font-black">−{formatPrice(discount)}</span>
              </div>
            )}

            <div className="pt-6 border-t border-white/10 mb-8 flex justify-between">
              <span className="text-lg font-bold">Итого</span>
              <span className="text-2xl font-black text-primary">{formatPrice(finalTotal)}</span>
            </div>

            {submitError && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-white text-secondary hover:bg-neutral-100 disabled:bg-neutral-800 disabled:text-neutral-600"
            >
              {loading ? "Обработка..." : "Перейти к оплате"}
            </Button>

            <p className="text-[10px] text-neutral-500 font-bold text-center mt-6 uppercase tracking-wider">
              Оплата производится через защищенный шлюз ЮKassa
            </p>
          </div>
        </div>
      </form>
    </main>
  );
}
