import { getProductBySlug } from "@/lib/queries";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { Metadata } from "next";
import { formatPrice } from "@/lib/utils";

export const revalidate = 1800;

export async function generateMetadata({ params }: { params: { product: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.product);
  if (!product) return { title: "Товар не найден" };
  return {
    title: `${product.name} | Nintendo Shop`,
    description: product.description || `Купить ${product.name} по выгодной цене в Nintendo Shop.`,
  };
}

export default async function ProductPage({ params }: { params: { product: string } }) {
  const product = await getProductBySlug(params.product);

  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description || product.name,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Gaming"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "RUB",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <main className="container py-12 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="aspect-square bg-neutral-50 rounded-[40px] overflow-hidden border border-neutral-100 relative shadow-sm">
            <Image
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-contain p-12"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.slice(1, 5).map((img, i) => (
              <div key={i} className="aspect-square bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100 cursor-pointer hover:border-primary/30 transition-colors">
                <Image src={img} alt={product.name} width={200} height={200} className="object-contain p-4" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <Link href={`/catalog/${product.category.slug}`} className="text-sm font-bold text-primary uppercase tracking-widest mb-4 inline-block hover:underline">
              {product.category.name}
            </Link>
            <h1 className="text-5xl font-black text-secondary leading-tight mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-yellow-400">★</span>
                ))}
              </div>
              <span className="text-sm font-medium text-neutral-400">4.9 (120 отзывов)</span>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-4xl font-black text-secondary">
                {formatPrice(product.price)}
              </span>
              {product.priceOld && (
                <span className="text-xl text-neutral-300 line-through">
                  {formatPrice(product.priceOld)}
                </span>
              )}
            </div>
            <p className="text-green-600 text-sm font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              В наличии в 14 магазинах
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <AddToCartButton product={product} />
            <Button variant="secondary" size="lg" className="rounded-2xl h-16">
              Купить в 1 клик
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-neutral-100 mb-10">
            <div className="flex items-center gap-3">
              <Truck size={24} className="text-primary" />
              <div>
                <p className="text-xs font-bold text-secondary">Доставка</p>
                <p className="text-[10px] text-neutral-500 font-medium">Завтра, от 290₽</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} className="text-primary" />
              <div>
                <p className="text-xs font-bold text-secondary">Гарантия</p>
                <p className="text-[10px] text-neutral-500 font-medium">1 год от производителя</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw size={24} className="text-primary" />
              <div>
                <p className="text-xs font-bold text-secondary">Возврат</p>
                <p className="text-[10px] text-neutral-500 font-medium">14 дней без проблем</p>
              </div>
            </div>
          </div>

          {/* Characteristics */}
          <div>
            <h3 className="text-lg font-black text-secondary mb-6">Характеристики</h3>
            <div className="space-y-4">
              {product.attributes && Object.entries(product.attributes as any).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm py-2 border-b border-neutral-50 last:border-0">
                  <span className="text-neutral-400 font-medium">{key}</span>
                  <span className="text-secondary font-bold">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
