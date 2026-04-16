import { NextResponse } from "next/server";
import { createOrderAction } from "@/lib/actions";
import { yookassa } from "@/lib/yookassa";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, address, items, totalAmount } = body;

    // 1. Create Order via transaction-safe Action
    const result = await createOrderAction({
      name,
      phone,
      address,
      items: items.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const order = result.data;

    // 2. Create Payment in Yookassa
    const payment = await yookassa.createPayment(
      totalAmount,
      `Заказ №${order.id} в Nintendo Shop`,
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
