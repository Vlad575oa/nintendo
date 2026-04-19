import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "../../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const rawAttrs = (product.attributes as any) ?? {};
  const attributes = Array.isArray(rawAttrs)
    ? rawAttrs
    : Object.entries(rawAttrs).map(([key, value]) => ({ key, value: String(value) }));

  return (
    <ProductForm
      categories={categories}
      initial={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description ?? "",
        price: String(product.price / 100),
        priceOld: product.priceOld ? String(product.priceOld / 100) : "",
        categoryId: String(product.categoryId),
        brand: product.brand ?? "",
        color: product.color ?? "",
        inStock: product.inStock,
        isNew: product.isNew,
        isSale: product.isSale,
        stock: String(product.stock),
        images: product.images,
        attributes,
        metaTitle: product.metaTitle ?? "",
        metaDesc: product.metaDesc ?? "",
      }}
    />
  );
}
