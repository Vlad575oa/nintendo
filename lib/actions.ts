"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface OrderItemInput {
  productId: number;
  quantity: number;
  price: number;
}

interface CreateOrderInput {
  name: string;
  phone: string;
  address: string;
  items: OrderItemInput[];
  totalAmount: number;
}

export type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function createOrderAction(input: CreateOrderInput): Promise<ActionResponse<any>> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check stock for all items
      for (const item of input.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, name: true },
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Товар "${product?.name || "ID " + item.productId}" закончился на складе`);
        }
      }

      // 2. Decrement stock
      for (const item of input.items) {
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

      // 3. Create Order
      const order = await tx.order.create({
        data: {
          name: input.name,
          phone: input.phone,
          address: input.address,
          totalAmount: input.totalAmount,
          status: "pending",
          items: {
            create: input.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price_at_purchase: item.price,
            })),
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
  if (!query || query.length < 2) return [];

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      take: 8,
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
        image: p.images[0] || "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=200",
    }));
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}
