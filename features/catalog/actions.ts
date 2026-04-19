"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { CATEGORY_FILTERS } from "./config/categoryFilters";

interface FilterParams {
  category: string;
  priceMin?: number;
  priceMax?: number;
  colors?: string[];
  statuses?: string[];
  attrValues?: Record<string, string[]>;
}

export async function getFilteredProductsCountAction(params: FilterParams) {
  const { category, priceMin, priceMax, colors, statuses, attrValues } = params;

  const andConditions: Prisma.ProductWhereInput[] = [];

  // 1. Category Filter
  if (category && category !== "all") {
    // If it's a category, we want to include products from this category and its subcategories
    // First, find the category and its children
    const cat = await prisma.category.findUnique({
      where: { slug: category },
      include: { children: true }
    });

    if (cat) {
      const categoryIds = [cat.id, ...cat.children.map(c => c.id)];
      // Note: For deep nesting, we would need a recursive approach, but for now 1 level is standard
      // If we want all levels, we might need a different query or a flatter structure
      andConditions.push({ categoryId: { in: categoryIds } });
    }
  }

  // 2. Price Filter
  if (priceMin !== undefined || priceMax !== undefined) {
    andConditions.push({
      price: {
        ...(priceMin !== undefined ? { gte: priceMin * 100 } : {}),
        ...(priceMax !== undefined ? { lte: priceMax * 100 } : {}),
      },
    });
  }

  // 3. Color Filter
  if (colors && colors.length > 0) {
    andConditions.push({
      color: colors.length === 1 ? colors[0] : { in: colors },
    });
  }

  // 4. Status Filter
  if (statuses && statuses.length > 0) {
    const wantsInStock = statuses.includes("inStock");
    const wantsOnOrder = statuses.includes("onOrder");
    if (wantsInStock && !wantsOnOrder) andConditions.push({ inStock: true });
    if (wantsOnOrder && !wantsInStock) andConditions.push({ inStock: false });
  }

  // 5. Attribute Filters (Category specific)
  if (attrValues && Object.keys(attrValues).length > 0) {
    const categoryFilterSections = CATEGORY_FILTERS[category] ?? [];
    for (const section of categoryFilterSections) {
      const values = attrValues[section.paramKey];
      if (!values || !values.length) continue;

      const attrKey = section.paramKey.replace("attr_", "");
      andConditions.push({
        OR: values.map((v) => ({
          attributes: {
            path: [attrKey],
            string_contains: v,
          },
        })),
      });
    }
  }

  const where: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  try {
    const count = await prisma.product.count({ where });
    return { success: true, count };
  } catch (error) {
    console.error("Count Action Error:", error);
    return { success: false, error: "Failed to count products" };
  }
}
