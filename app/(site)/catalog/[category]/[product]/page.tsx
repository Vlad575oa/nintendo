import { getProductBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProductGallery } from "@/features/product/components/ProductGallery";
import { PurchaseBlock } from "@/features/product/components/PurchaseBlock";
import { ProductMeta } from "@/features/product/components/ProductMeta";
import { TrackView } from "@/features/product/components/TrackView";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
      "name": product.brand || "Microsoft"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "RUB",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <main className="container py-8 lg:py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link href="/" className="hover:text-primary transition-colors">Главная страница</Link>
          <ChevronRight size={10} className="text-neutral-200" />
          <Link href="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
          <ChevronRight size={10} className="text-neutral-200" />
          <Link href={`/catalog/${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
          <ChevronRight size={10} className="text-neutral-200" />
          <span className="text-neutral-400">{product.name}</span>
        </nav>

        {/* Track this product as recently viewed */}
        <TrackView productId={product.id} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-secondary leading-tight mb-4 max-w-4xl">
            {product.name}
          </h1>
          <ProductMeta productId={product.id} />
        </div>

        {/* Product Content Grid */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          <div className="flex-1 min-w-0">
            <ProductGallery images={product.images} name={product.name} />
            
            {/* Description Tab (Mock) */}
            <div className="mt-16">
                 <div className="flex gap-10 border-b border-neutral-100 mb-8">
                    <button className="text-sm font-black text-secondary pb-4 border-b-2 border-primary -mb-[1px]">Описание</button>
                    <button className="text-sm font-bold text-neutral-400 pb-4 hover:text-secondary transition-all">Характеристики</button>
                    <button className="text-sm font-bold text-neutral-400 pb-4 hover:text-secondary transition-all">Отзывы</button>
                 </div>
                 <div className="prose prose-neutral max-w-none">
                    <p className="text-neutral-600 leading-relaxed text-sm">
                        {product.description || "Описание товара временно недоступно."}
                    </p>
                 </div>
            </div>
          </div>

          <aside className="w-full lg:w-[380px] flex-shrink-0">
            <div className="lg:sticky lg:top-24">
                <PurchaseBlock product={product as any} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

