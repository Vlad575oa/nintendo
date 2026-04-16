"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Scale, Info, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    priceOld?: number | null;
    images: string[];
    isNew?: boolean;
    isSale?: boolean;
    category?: {
        slug: string;
    };
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const productUrl = `/catalog/${product.category?.slug || "any"}/${product.slug}`;

  return (
    <div className="group bg-white rounded-[32px] p-3 transition-all duration-300 hover:shadow-xl border border-transparent hover:border-neutral-100 flex flex-col relative overflow-hidden h-full">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-1 font-black text-[8px] uppercase tracking-tighter">
        {product.isNew && <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full shadow-sm">New</span>}
        {product.isSale && <span className="bg-red-600 text-white px-2 py-0.5 rounded-full shadow-sm">Sale</span>}
      </div>
      
      {/* Image - More compact aspect ratio */}
      <Link href={productUrl} className="block relative aspect-[4/3] mb-3 px-2">
        <Image
          src={product.images[0] || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-contain p-1 group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1">
          {/* Prices - Two payment methods */}
          <div className="mb-2">
                <div className="flex flex-col">
                    <p className="text-[8px] text-neutral-400 font-bold uppercase leading-tight tracking-wide">При оплате наличными</p>
                    <p className="text-lg font-black text-secondary leading-none my-1">
                        {formatPrice(product.price)}
                    </p>
                </div>
                {product.priceOld && (
                    <div className="flex flex-col mt-1">
                        <div className="flex items-center gap-1 opacity-60">
                            <p className="text-[8px] text-neutral-400 font-bold uppercase">Другие способы оплаты</p>
                            <Info size={8} className="text-neutral-300" />
                        </div>
                        <p className="text-xs font-bold text-neutral-400 line-through decoration-primary/30">
                            {formatPrice(product.priceOld)}
                        </p>
                    </div>
                )}
          </div>

          {/* Bonus - Smaller */}
          <div className="flex items-center gap-1 text-[8px] font-black text-blue-500 mb-2 uppercase">
                <TrendingUp size={10} />
                <span>{Math.floor(product.price / 10000)} кэшбэк</span>
          </div>

          {/* Title - Reduced line height and font size */}
          <Link href={productUrl} className="mb-4 flex-1">
            <h3 className="text-[10px] font-bold text-secondary leading-[1.3] line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Bottom Actions - Icons row */}
          <div className="flex items-center gap-2 pt-3 mt-auto">
            <button className="w-10 h-10 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-white hover:shadow-sm border border-transparent hover:border-neutral-100 transition-all active:scale-90">
                <Scale size={16} />
            </button>
            <button className="w-10 h-10 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-neutral-100 transition-all active:scale-90">
                <Heart size={16} />
            </button>
            
            {/* Cart Button on the right */}
            <button className="flex-1 h-10 bg-orange-50 border border-orange-100 text-orange-600 rounded-2xl flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all active:scale-95">
                <ShoppingCart size={18} strokeWidth={2.5} />
            </button>
          </div>

      </div>
    </div>
  );
};
