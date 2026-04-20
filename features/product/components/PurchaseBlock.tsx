"use client";

import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { Info, ShieldCheck, Heart, GitCompare, Share2 } from "lucide-react";
import Image from "next/image";

interface PurchaseBlockProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    priceOld?: number | null;
    inStock: boolean;
    brand?: string | null;
    images: string[];
  };
}

export function PurchaseBlock({ product }: PurchaseBlockProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Main card */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm">
        {/* Bonus */}
        <div className="flex items-center gap-2 mb-6 text-sm text-neutral-400 font-medium">
          <span>Бонусов</span>
          <span className="flex items-center gap-1 text-primary font-bold">
            <span className="text-xs">✦</span>
            {Math.floor(product.price / 10000)} {/* Mock bonus calculation */}
          </span>
        </div>

        {/* Pricing */}
        <div className="space-y-4 mb-8">
          <div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1">При оплате наличными</p>
            <p className="text-4xl font-black text-secondary leading-none">
              {formatPrice(product.price)}
            </p>
          </div>
          
          {product.priceOld && (
            <div>
              <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1">Другие способы оплаты</p>
              <p className="text-lg font-bold text-neutral-300">
                {formatPrice(product.priceOld)}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4 mb-6">
          <AddToCartButton
            product={product}
            className="w-full h-14 rounded-2xl text-lg font-black bg-[#FF6B00] hover:bg-[#e65a00] border-none shadow-lg shadow-orange-500/20"
          />
          <div className="flex items-center gap-2 px-1 text-sm font-bold text-neutral-400">
             <span className={product.inStock ? "text-green-500" : "text-yellow-500"}>
                {product.inStock ? "● В наличии" : "○ Под заказ"}
             </span>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between py-4 border-t border-neutral-50 mb-4">
           <span className="text-xs font-bold text-neutral-400">Артикул: L0{product.id + 4000}</span>
           {product.brand && (
             <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                <span className="text-[10px] font-black uppercase text-secondary">{product.brand}</span>
             </div>
           )}
        </div>

        {/* Info Box */}
        <div className="bg-neutral-50 rounded-2xl p-4 flex gap-3 text-[11px] leading-relaxed text-neutral-500 font-medium">
            <Info size={16} className="text-neutral-300 flex-shrink-0 mt-0.5" />
            <p>
                <b>О заказе:</b> Цена, условия, комплектация и внешний вид являются предварительными и могут быть изменены в момент поступления товара на склад.
            </p>
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-3">
         <div className="bg-[#f0f9ff] hover:bg-[#e0f2fe] transition-colors rounded-2xl p-4 flex items-center justify-between cursor-pointer group">
            <div className="flex flex-col">
                <span className="text-[10px] text-blue-500 font-bold uppercase mb-0.5">Объем памяти</span>
                <span className="text-sm font-black text-secondary">512 Гб</span>
            </div>
            <ChevronDown size={18} className="text-blue-300 group-hover:text-blue-500 transition-colors" />
         </div>

         <div className="bg-white border border-neutral-100 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-neutral-300" />
                <span className="text-sm font-bold text-secondary">Гарантия 1 год</span>
            </div>
            <Info size={18} className="text-neutral-200" />
         </div>
      </div>

      {/* Seller info */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-black text-neutral-400 text-xs">IS</div>
          <div>
              <p className="text-sm font-black text-secondary leading-tight">Nintendo Shop</p>
              <p className="text-[10px] text-neutral-400 font-bold">Официальный продавец</p>
          </div>
      </div>
    </div>
  );
}

function ChevronDown({ size, className }: { size: number, className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
    )
}
