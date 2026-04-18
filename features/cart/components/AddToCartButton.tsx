"use client";

import { useCartStore } from "@/features/cart/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
  className?: string;
}

export const AddToCartButton = ({ product, className }: AddToCartButtonProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button 
      size="lg" 
      className={cn(
        "relative overflow-hidden rounded-[20px] h-16 transition-all duration-500 gap-3 font-black text-md uppercase tracking-widest active:scale-95 group",
        isAdded 
          ? "bg-green-600 hover:bg-green-700 shadow-[0_12px_32px_rgba(22,163,74,0.3)]" 
          : "bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] hover:shadow-[0_12px_42px_rgba(255,107,0,0.4)] border-none text-white",
        className
      )}
      onClick={handleAdd}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Shimmer Effect */}
      <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-1000" />

      {isAdded ? <Check size={22} className="relative z-10" /> : <ShoppingCart size={22} className="relative z-10" />}
      <span className="relative z-10">{isAdded ? "В корзине" : "В корзину"}</span>
    </Button>
  );
};
