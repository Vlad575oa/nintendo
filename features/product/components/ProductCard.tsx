"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
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
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-neutral-100">
      {product.isNew && (
        <span className="absolute top-4 left-4 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          New
        </span>
      )}
      {product.isSale && (
        <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          Sale
        </span>
      )}
      
      <Link href={`/catalog/any/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-neutral-50">
        <Image
          src={product.images[0] || "/placeholder.jpg"}
          alt={product.name}
          width={400}
          height={500}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-4">
        <Link href={`/catalog/any/${product.slug}`}>
          <h3 className="text-sm font-semibold text-neutral-800 line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {product.priceOld && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.priceOld)}
            </span>
          )}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-4 gap-2 hover:bg-primary hover:text-white"
          onClick={(e) => {
            e.preventDefault();
            // Add to cart logic will go here
          }}
        >
          <ShoppingCart size={16} />
          <span>В корзину</span>
        </Button>
      </div>
    </div>
  );
};
