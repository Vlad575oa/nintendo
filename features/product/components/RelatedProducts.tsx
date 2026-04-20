import prisma from "@/lib/prisma";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  categorySlug: string;
  excludeId: number;
}

export async function RelatedProducts({ categorySlug, excludeId }: RelatedProductsProps) {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { isVisible: true, category: { slug: categorySlug }, NOT: { id: excludeId } },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
  } catch {
    return null;
  }

  if (!products.length) return null;

  return (
    <section className="mb-16">
      <div className="mb-8">
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Из той же категории</p>
        <h2 className="text-2xl font-black text-secondary uppercase tracking-tight">Похожие товары</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
