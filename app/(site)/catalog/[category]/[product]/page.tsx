import { getProductBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
import { ProductGallery } from "@/features/product/components/ProductGallery";
import { PurchaseBlock } from "@/features/product/components/PurchaseBlock";
import { ProductMeta } from "@/features/product/components/ProductMeta";
import { TrackView } from "@/features/product/components/TrackView";
import { ProductTabs } from "@/features/product/components/ProductTabs";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nintendo-shop.ru";

export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: { product: string; category: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.product);
  if (!product) return { title: "Товар не найден" };

  const title = `${product.name} — Купить в Nintendo Shop`;
  const description =
    product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
    `Закажите ${product.name} по выгодной цене с доставкой по всей России. Официальная гарантия и сервис.`;

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/catalog/${params.category}/${params.product}` },
    openGraph: {
      title,
      description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      type: "article",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { product: string };
}) {
  const product = await getProductBySlug(params.product);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description?.replace(/<[^>]*>/g, "") || product.name,
    brand: { "@type": "Brand", name: product.brand || "Nintendo" },
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: "RUB",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
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
          <Link href="/" className="hover:text-primary transition-colors">
            Главная
          </Link>
          <ChevronRight size={10} className="text-neutral-200" />
          <Link href="/catalog/all" className="hover:text-primary transition-colors">
            Каталог
          </Link>
          <ChevronRight size={10} className="text-neutral-200" />
          <Link
            href={`/catalog/${product.category.slug}`}
            className="hover:text-primary transition-colors"
          >
            {product.category.name}
          </Link>
          <ChevronRight size={10} className="text-neutral-200" />
          <span className="text-neutral-400 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Track recently viewed */}
        <TrackView productId={product.id} />

        {/* Product name */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-secondary leading-tight mb-4 max-w-4xl">
            {product.name}
          </h1>
          <ProductMeta productId={product.id} />
        </div>

        {/* Main grid: Gallery + Tabs | Purchase */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          {/* Left */}
          <div className="flex-1 min-w-0">
            <ProductGallery images={product.images} name={product.name} />

            {/* Description & Specs tabs */}
            <ProductTabs
              description={product.description ?? null}
              attributes={product.attributes as Record<string, string> | null}
              productName={product.name}
            />
          </div>

          {/* Right — Sticky purchase block */}
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
