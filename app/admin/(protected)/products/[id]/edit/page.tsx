import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "../../ProductForm";
import type { VariantRow } from "../../ProductForm";

export const dynamic = "force-dynamic";

const BUNDLE_MARKERS = [
  "+", "bundle", "бандл", "комплект", "game pass", "геймпад",
  "подписк", "игра", "edition", "limited", "fifa", "fortnite",
  "hogwarts", "zelda", "mario", "spider",
];
const MEMORY_KEYS = ["Накопитель", "Объём", "Объем"];

const isBase = (name: string, slug: string) => {
  const src = `${name} ${slug}`.toLowerCase();
  return !BUNDLE_MARKERS.some((m) => src.includes(m));
};

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const rawAttrs = (product.attributes as Record<string, string>) ?? {};
  const platform = rawAttrs["Платформа"] ?? null;

  // Load siblings for variant table
  let siblings: typeof product[] = [product];
  if (platform) {
    const pool = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        attributes: { path: ["Платформа"], equals: platform },
        isVisible: { not: false },
      },
      orderBy: { price: "asc" },
    });
    const productIsBase = isBase(product.name, product.slug);
    const filtered = productIsBase
      ? pool.filter((p) => isBase(p.name, p.slug))
      : pool;
    if (filtered.length > 1) siblings = filtered;
  }

  const initialVariants: Omit<VariantRow, "_deleted">[] = siblings.map((s) => {
    const a = (s.attributes as Record<string, string>) ?? {};
    const memory = MEMORY_KEYS.map((k) => a[k]).find(Boolean) ?? "";
    const color = a["Цвет"] ?? s.color ?? "";
    const priceRub = s.price / 100;
    const priceOldRub = s.priceOld ? s.priceOld / 100 : Math.round(priceRub * 1.13);
    return {
      id: s.id,
      slug: s.slug,
      color,
      memory,
      price: String(priceRub),
      priceOld: String(priceOldRub),
      stock: String(s.stock),
      inStock: s.inStock,
      images: s.images,
      newImages: [],
      newPreviews: [],
    };
  });

  // Shared attrs: strip Цвет / Накопитель keys (they live in variants table)
  const STRIP_KEYS = new Set(["Цвет", "Накопитель", "Объём", "Объем"]);
  const sharedAttrs = Object.entries(rawAttrs)
    .filter(([k]) => !STRIP_KEYS.has(k))
    .map(([key, value]) => ({ key, value: String(value) }));

  return (
    <ProductForm
      categories={categories}
      initialAttrs={sharedAttrs}
      initial={{
        id: product.id,
        name: product.name,
        description: product.description ?? "",
        categoryId: String(product.categoryId),
        brand: product.brand ?? "",
        isNew: product.isNew,
        isSale: product.isSale,
        metaTitle: product.metaTitle ?? "",
        metaDesc: product.metaDesc ?? "",
      }}
      initialVariants={initialVariants}
    />
  );
}
