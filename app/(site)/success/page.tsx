"use client";

import { useEffect } from "react";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="container py-32 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
        <CheckCircle2 size={48} className="text-green-600" />
      </div>
      <h1 className="text-4xl font-black text-secondary mb-4">Спасибо за заказ!</h1>
      <p className="text-neutral-500 mb-10 max-w-md mx-auto">
        Ваш заказ успешно оплачен. Мы свяжемся с вами в ближайшее время для уточнения деталей доставки.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/">
          <Button size="lg" className="rounded-2xl">На главную</Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="lg" className="rounded-2xl">В каталог</Button>
        </Link>
      </div>
    </main>
  );
}
