import { NextResponse } from "next/server";
import { createOrderAction } from "@/lib/actions";
import { yookassa } from "@/lib/yookassa";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { buildRateLimitKey, rateLimit } from "@/lib/rateLimit";

const CheckoutSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(10).max(24),
  address: z.string().trim().min(6).max(240),
  items: z.array(z.object({
    id: z.number().int().positive(),
    quantity: z.number().int().positive().max(20),
  })).min(1).max(50),
});

export async function POST(req: Request) {
  try {
    const limit = rateLimit(buildRateLimitKey("checkout", req), 10, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
    }
    const parsed = CheckoutSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Некорректные данные заказа" }, { status: 400 });
    }
    const { name, phone, address, items } = parsed.data;

    // 1. Create Order via transaction-safe Action
    const result = await createOrderAction({
      name,
      phone,
      address,
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const order = result.data;

    // 2. Create Payment in Yookassa
    const payment = await yookassa.createPayment(
      order.totalAmount / 100,
      `Заказ №${order.id} в Gameshop24`,
      `${process.env.NEXT_PUBLIC_API_URL}/success?orderId=${order.id}`
    );

    // 3. Update Order with paymentId
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: payment.id },
    });

    return NextResponse.json({
      success: true,
      data: {
        confirmationUrl: payment.confirmation.confirmation_url,
        orderId: order.id,
      },
    });
  } catch (error: any) {
    console.error("Checkout API Error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to process order" }, { status: 500 });
  }
}
