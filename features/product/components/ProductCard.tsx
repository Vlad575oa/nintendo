"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Scale, Info, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/features/product/store/useWishlistStore";
import { useCompareStore } from "@/features/product/store/useCompareStore";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
    inStock?: boolean;
    category?: { slug: string; name?: string };
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const router = useRouter();
  const productUrl = `/catalog/${product.category?.slug || "any"}/${product.slug}`;

  const inWishlist = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inCompare = useCompareStore((s) => s.has(product.id));
  const compareFull = useCompareStore((s) => s.isFull());
  const toggleCompare = useCompareStore((s) => s.toggle);
  const addToCart = useCartStore((s) => s.addItem);

  const imagesCount = product.images.length;

  const goToProduct = useCallback(() => router.push(productUrl), [productUrl, router]);

  const stop = (e: React.MouseEvent | React.TouchEvent) => e.stopPropagation();

  // Mobile: tap left/right half of image to cycle photos
  const handleImageTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imagesCount <= 1) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
      setActiveImageIndex((p) => (p - 1 + imagesCount) % imagesCount);
    } else {
      setActiveImageIndex((p) => (p + 1) % imagesCount);
    }
  };

  return (
    <div
      onClick={goToProduct}
      className="group cursor-pointer bg-white rounded-[32px] p-3 transition-all duration-300 hover:shadow-xl border border-transparent hover:border-neutral-100 flex flex-col relative overflow-hidden h-full select-none"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-1 font-black text-[8px] uppercase tracking-tighter pointer-events-none">
        {product.isNew && <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full shadow-sm">New</span>}
        {product.isSale && <span className="bg-red-600 text-white px-2 py-0.5 rounded-full shadow-sm">Sale</span>}
      </div>

      {/* Image area */}
      <div className="relative aspect-[4/3] mb-3 px-2">
        {/* Photo */}
        <div className="relative w-full h-full">
          <Image
            src={product.images[activeImageIndex] || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-contain p-1 transition-transform duration-500 group-hover:scale-105 pointer-events-none"
          />
        </div>

        {/* Desktop: invisible hover zones to change image */}
        {imagesCount > 1 && (
          <div className="absolute inset-0 hidden md:flex z-20">
            {product.images.map((_, idx) => (
              <div
                key={idx}
                className="h-full flex-1"
                onMouseEnter={() => setActiveImageIndex(idx)}
                onMouseLeave={() => setActiveImageIndex(0)}
              />
            ))}
          </div>
        )}

        {/* Mobile: tap left/right half to cycle */}
        {imagesCount > 1 && (
          <div
            className="absolute inset-0 z-20 md:hidden"
            onClick={handleImageTap}
          />
        )}

        {/* Dot indicators
            — Desktop: hidden by default, shown on hover
            — Mobile: always visible */}
        {imagesCount > 1 && (
          <div className="absolute bottom-1.5 inset-x-0 flex items-center justify-center gap-1.5 z-30 pointer-events-none md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            {product.images.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-full transition-all duration-200",
                  idx === activeImageIndex
                    ? "w-2 h-2 bg-primary shadow-sm shadow-primary/40"
                    : "w-1.5 h-1.5 bg-neutral-300"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        {/* Price */}
        <div className="mb-2">
          <p className="text-[8px] text-neutral-400 font-bold uppercase leading-tight tracking-wide">При оплате наличными</p>
          <p className="text-lg font-black text-secondary leading-none my-1">
            {formatPrice(product.price)}
          </p>
          {product.priceOld && (
            <div className="flex items-center gap-1 mt-0.5">
              <p className="text-xs font-bold text-neutral-400 line-through decoration-primary/30">
                {formatPrice(product.priceOld)}
              </p>
              <Info size={8} className="text-neutral-300" />
            </div>
          )}
        </div>

        {/* Cashback */}
        <div className="flex items-center gap-1 text-[8px] font-black text-blue-500 mb-2 uppercase">
          <TrendingUp size={10} />
          <span>{Math.floor(product.price / 10000)} кэшбэк</span>
        </div>

        {/* Title */}
        <p className="text-[10px] font-bold text-secondary leading-[1.3] line-clamp-2 mb-4 flex-1">
          {product.name}
        </p>

        {/* Actions — stopPropagation so card click doesn't fire */}
        <div className="flex items-center gap-2 pt-3 mt-auto" onClick={stop}>
          {/* Compare */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleCompare(product.id); }}
            title={inCompare ? "Убрать из сравнения" : compareFull ? "Список сравнения заполнен (макс. 4)" : "Добавить к сравнению"}
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center border transition-all active:scale-90",
              inCompare
                ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20"
                : compareFull
                ? "bg-neutral-100 text-neutral-300 border-transparent cursor-not-allowed"
                : "bg-neutral-50 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-100 border-transparent"
            )}
          >
            <Scale size={16} />
          </button>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
            title={inWishlist ? "Убрать из избранного" : "Добавить в избранное"}
            className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center border transition-all active:scale-90",
              inWishlist
                ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20"
                : "bg-neutral-50 text-neutral-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 border-transparent"
            )}
          >
            <Heart size={16} />
          </button>

          {/* Cart */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images[0] || "/placeholder.jpg",
                quantity: 1,
              });
              toast.success("Добавлено в корзину", { description: product.name, duration: 2000 });
            }}
            className="flex-1 h-10 bg-orange-50 border border-orange-100 text-orange-600 rounded-2xl flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all active:scale-95"
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
