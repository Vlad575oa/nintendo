import { cache } from "react";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const VISIBLE: Prisma.ProductWhereInput = { isVisible: { not: false } };

const safeQuery = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn();
  } catch {
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
