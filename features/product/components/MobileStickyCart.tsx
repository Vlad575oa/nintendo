"use client";

import { useCartStore } from "@/features/cart/store/useCartStore";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface MobileStickyCartProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
}

export function MobileStickyCart({ product }: MobileStickyCartProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images?.[0] || "/placeholder.jpg",
      quantity: 1,
    });
    toast.success("Добавлено в корзину", { description: product.name, duration: 2000 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-neutral-100 px-4 py-3 flex items-center gap-4 shadow-xl">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider truncate">{product.name}</p>
        <p className="text-lg font-black text-secondary leading-tight">{formatPrice(product.price)}</p>
      </div>
      <button
        onClick={handleAdd}
        className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95 shrink-0 ${
          added
            ? "bg-green-500 text-white"
            : "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-red-700"
        }`}
      >
        {added ? <Check size={18} /> : <ShoppingCart size={18} />}
        {added ? "В корзине" : "В корзину"}
      </button>
    </div>
  );
}
