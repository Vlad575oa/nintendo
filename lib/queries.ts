import { cache } from "react";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const VISIBLE: Prisma.ProductWhereInput = { isVisible: { not: false } };

const safeQuery = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.error("DATABASE QUERY ERROR:", error);
    return fallback;
  }
};

export const getCategories = cache(async () => {
  return safeQuery(
    () => prisma.category.findMany({ orderBy: { name: "asc" } }),
    []
  );
});

export const getCategoryTree = cache(async () => {
  return safeQuery(
    () => prisma.category.findMany({
      include: { children: { include: { children: true } } },
      where: { parentId: null },
      orderBy: { name: "asc" },
    }),
    []
  );
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return safeQuery(
    () => prisma.category.findUnique({ where: { slug } }),
    null
  );
});

export const getProducts = cache(async (
  where: Prisma.ProductWhereInput,
  orderBy: Prisma.ProductOrderByWithRelationInput,
  skip: number,
  take: number
) => {
  return safeQuery(
    () => prisma.product.findMany({
      where: { AND: [VISIBLE, where] },
      orderBy,
      skip,
      take,
      include: { category: true },
    }),
    []
  );
});

// Returns products with Nintendo/Switch categories first, then rest by newest
export const getProductsNintendoFirst = cache(async (
  where: Prisma.ProductWhereInput,
  skip: number,
  take: number
) => {
  return safeQuery(async () => {
    const results = await prisma.$queryRaw<any[]>`
      SELECT p.*,
        c.id as "cat_id", c.name as "cat_name", c.slug as "cat_slug",
        CASE WHEN c.slug ILIKE '%nintendo%' OR c.slug ILIKE '%switch%' THEN 0 ELSE 1 END as priority
      FROM "Product" p
      JOIN "Category" c ON p."categoryId" = c.id
      WHERE p."isVisible" IS DISTINCT FROM false
      ORDER BY priority ASC, p."createdAt" DESC
      LIMIT ${take} OFFSET ${skip}
    `;
    return results.map((r: any) => ({
      ...r,
      category: { id: r.cat_id, name: r.cat_name, slug: r.cat_slug },
    }));
  }, []);
});

export const getProductBySlug = cache(async (slug: string) => {
  return safeQuery(
    () => prisma.product.findUnique({ where: { slug }, include: { category: true } }),
    null
  );
});

export const getNewProducts = cache(async (take: number = 8) => {
  return safeQuery(
    () => prisma.product.findMany({
      where: { ...VISIBLE, isNew: true },
      take,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    []
  );
});

export const getAllProducts = cache(async (take: number = 48) => {
  return safeQuery(
    () => prisma.product.findMany({
      where: VISIBLE,
      take,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    []
  );
});

export const getProductsCount = cache(async (where: Prisma.ProductWhereInput) => {
  return safeQuery(
    () => prisma.product.count({ where: { AND: [VISIBLE, where] } }),
    0
  );
});

export const getOrdersCount = cache(async () => {
  return safeQuery(() => prisma.order.count(), 0);
});

export const getRecentOrders = cache(async (take: number = 5) => {
  return safeQuery(
    () => prisma.order.findMany({ take, orderBy: { createdAt: "desc" } }),
    []
  );
});

export interface ProductVariantOption {
  id: number;
  name: string;
  slug: string;
  price: number;
  priceOld: number | null;
  inStock: boolean;
  images: string[];
  memory: string | null;
  color: string | null;
}

const ATTRIBUTE_MEMORY_KEYS = ["Накопитель", "Объём", "Объем"] as const;
const ATTRIBUTE_COLOR_KEYS = ["Цвет"] as const;

const BUNDLE_MARKERS = [
  "+",
  "bundle",
  "бандл",
  "комплект",
  "game pass",
  "геймпад",
  "подписк",
  "игра",
  "edition",
  "limited",
  "fifa",
  "fortnite",
  "hogwarts",
  "zelda",
  "mario",
  "spider",
] as const;

const readAttribute = (
  attributes: Prisma.JsonValue | null,
  keys: readonly string[]
): string | null => {
  if (!attributes || typeof attributes !== "object" || Array.isArray(attributes)) {
    return null;
  }

  for (const key of keys) {
    const value = (attributes as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
};

const isBaseVariantCandidate = (name: string, slug: string) => {
  const source = `${name} ${slug}`.toLowerCase();
  return !BUNDLE_MARKERS.some((marker) => source.includes(marker));
};

const hasVariants = (items: ProductVariantOption[]) => {
  const memoryCount = new Set(items.map((item) => item.memory).filter(Boolean)).size;
  const colorCount = new Set(items.map((item) => item.color).filter(Boolean)).size;
  return memoryCount > 1 || colorCount > 1;
};

export const getProductVariants = cache(async (productId: number) => {
  return safeQuery(async () => {
    const current = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        categoryId: true,
        attributes: true,
      },
    });

    if (!current) return [];

    const platform = readAttribute(current.attributes, ["Платформа"]);
    if (!platform) return [];

    const familyPool = await prisma.product.findMany({
      where: {
        AND: [
          VISIBLE,
          { categoryId: current.categoryId },
          { attributes: { path: ["Платформа"], equals: platform } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        priceOld: true,
        inStock: true,
        images: true,
        color: true,
        attributes: true,
      },
      orderBy: { price: "asc" },
    });

    const filtered = familyPool.filter((item) =>
      isBaseVariantCandidate(item.name, item.slug)
    );

    if (!filtered.some((item) => item.id === current.id)) return [];

    const variants: ProductVariantOption[] = filtered.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      priceOld: item.priceOld ?? null,
      inStock: item.inStock,
      images: item.images,
      memory: readAttribute(item.attributes, ATTRIBUTE_MEMORY_KEYS),
      color: readAttribute(item.attributes, ATTRIBUTE_COLOR_KEYS) ?? item.color ?? null,
    }));

    return hasVariants(variants) ? variants : [];
  }, [] as ProductVariantOption[]);
});
