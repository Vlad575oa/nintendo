import { cache } from "react";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const getCategories = cache(async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" }
  });
});

export const getCategoryTree = cache(async () => {
  const allCategories = await prisma.category.findMany({
    include: {
      children: {
        include: {
          children: true
        }
      }
    },
    where: { parentId: null },
    orderBy: { name: "asc" }
  });
  return allCategories;
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return await prisma.category.findUnique({ where: { slug } });
});

const VISIBLE: Prisma.ProductWhereInput = { isVisible: true };

export const getProducts = cache(async (
  where: Prisma.ProductWhereInput,
  orderBy: Prisma.ProductOrderByWithRelationInput,
  skip: number,
  take: number
) => {
  return await prisma.product.findMany({
    where: {
      AND: [VISIBLE, where]
    },
    orderBy,
    skip,
    take,
    include: { category: true },
  });
});

export const getProductBySlug = cache(async (slug: string) => {
  return await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
});

export const getNewProducts = cache(async (take: number = 8) => {
  return await prisma.product.findMany({
    where: { ...VISIBLE, isNew: true },
    take,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
});

export const getAllProducts = cache(async (take: number = 48) => {
  return await prisma.product.findMany({
    where: VISIBLE,
    take,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
});

export const getProductsCount = cache(async (where: Prisma.ProductWhereInput) => {
  return await prisma.product.count({ 
    where: {
      AND: [VISIBLE, where]
    } 
  });
});

export const getOrdersCount = cache(async () => {
  return await prisma.order.count();
});

export const getRecentOrders = cache(async (take: number = 5) => {
  return await prisma.order.findMany({
    take,
    orderBy: { createdAt: "desc" },
  });
});
