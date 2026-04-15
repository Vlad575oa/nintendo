"use client";

import { useForm } from "react-hook-form";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore();
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: CheckoutFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          items,
          totalAmount: totalPrice(),
        }),
      });

      const result = await response.json();
      if (result.confirmationUrl) {
        window.location.href = result.confirmationUrl;
      } else {
        alert("Ошибка при создании заказа");
      }
    } catch (error) {
      console.error(error);
      alert("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

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
                {...register("name", { required: true })}
                className={`w-full px-6 py-4 bg-neutral-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold ${errors.name ? "ring-2 ring-red-500/20" : ""}`}
                placeholder="Иван Иванов"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-400 mb-2">Телефон</label>
              <input
                {...register("phone", { required: true })}
                className="w-full px-6 py-4 bg-neutral-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                placeholder="+7 (999) 000-00-00"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-400 mb-2">Адрес доставки</label>
              <textarea
                {...register("address", { required: true })}
                rows={4}
                className="w-full px-6 py-4 bg-neutral-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                placeholder="Город, улица, дом, квартира"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-secondary p-8 rounded-[40px] text-white">
            <h2 className="text-2xl font-black mb-8">Заказ</h2>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-neutral-400 font-medium truncate max-w-[150px]">{item.name} x {item.quantity}</span>
                  <span className="font-bold">{(item.price * item.quantity).toLocaleString()} ₽</span>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-white/10 mb-8 flex justify-between">
              <span className="text-lg font-bold">Итого</span>
              <span className="text-2xl font-black text-primary">{totalPrice().toLocaleString()} ₽</span>
            </div>

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
