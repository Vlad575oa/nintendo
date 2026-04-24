"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface OrderItemInput {
  productId: number;
  quantity: number;
}

interface CreateOrderInput {
  name: string;
  phone: string;
  address: string;
  items: OrderItemInput[];
}

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createOrderAction(input: CreateOrderInput): Promise<ActionResponse<any>> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const normalizedItems = input.items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      }));
      if (!normalizedItems.length) {
        throw new Error("Корзина пуста");
      }
      if (normalizedItems.some((i) => !Number.isInteger(i.productId) || !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 20)) {
        throw new Error("Некорректные позиции заказа");
      }

      const productIds = Array.from(new Set(normalizedItems.map((i) => i.productId)));
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, stock: true, name: true, price: true, inStock: true, isVisible: true },
      });
      const productMap = new Map(products.map((p) => [p.id, p]));

      // 1. Check stock and visibility for all items
      for (const item of normalizedItems) {
        const product = productMap.get(item.productId);
        if (!product || product.isVisible === false || product.inStock === false || product.stock < item.quantity) {
          throw new Error(`Товар "${product?.name || "ID " + item.productId}" недоступен`);
        }
      }

      // 2. Decrement stock
      for (const item of normalizedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        const updatedProduct = await tx.product.findUnique({ where: { id: item.productId } });
        if (updatedProduct && updatedProduct.stock <= 0) {
          await tx.product.update({
            where: { id: item.productId },
            data: { inStock: false },
          });
        }
      }

      const orderItems = normalizedItems.map((item) => {
        const product = productMap.get(item.productId)!;
        return {
          productId: item.productId,
          quantity: item.quantity,
          price_at_purchase: product.price,
        };
      });
      const serverTotal = orderItems.reduce((sum, item) => sum + item.price_at_purchase * item.quantity, 0);
      if (serverTotal <= 0) {
        throw new Error("Некорректная сумма заказа");
      }

      // 3. Create Order
      const order = await tx.order.create({
        data: {
          name: input.name,
          phone: input.phone,
          address: input.address,
          totalAmount: serverTotal,
          status: "pending",
          items: {
            create: orderItems,
          },
        },
      });

      return order;
    });

    revalidatePath("/admin");
    revalidatePath("/catalog");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Order Creation Error:", error.message);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function searchProductsAction(query: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isVisible: { not: false },
        ...(query && query.length >= 2 ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { category: { name: { contains: query, mode: "insensitive" } } },
          ],
        } : {}),
      },
      take: query && query.length >= 2 ? 8 : 4,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true, slug: true } },
      },
    });

    return products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category.name,
      categorySlug: p.category.slug,
      image: p.images[0] || "",
    }));
  } catch (error: any) {
    console.error("Search Error:", error);
    return [];
  }
}

export async function duplicateProductAction(id: number): Promise<ActionResponse<any>> {
  try {
    const original = await prisma.product.findUnique({
      where: { id },
    });

    if (!original) {
      throw new Error("Товар не найден");
    }

    // Generate unique slug
    const suffix = Math.random().toString(36).substring(2, 6);
    const newSlug = `${original.slug}-copy-${suffix}`;

    // Create duplicate (excluding ID and timestamps)
    const { id: _, createdAt, updatedAt, ...rest } = original as any;

    const duplicate = await prisma.product.create({
      data: {
        ...rest,
        slug: newSlug,
        name: `${original.name} (Копия)`,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/catalog");

    return { success: true, data: duplicate };
  } catch (error: any) {
    console.error("Duplication Error:", error);
    return { success: false, error: error.message || "Failed to duplicate product" };
  }
}

export async function togglePostPublishAction(id: number): Promise<ActionResponse<any>> {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { isPublished: true },
    });

    if (!post) {
      throw new Error("Статья не найдена");
    }

    const updated = await prisma.post.update({
      where: { id },
      data: { isPublished: !post.isPublished },
    });

    revalidatePath("/admin/posts");
    revalidatePath("/blog");

    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Toggle Publish Error:", error);
    return { success: false, error: error.message || "Failed to toggle status" };
  }
}
