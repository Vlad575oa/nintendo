import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { yookassa } from "@/lib/yookassa";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, address, items, totalAmount } = body;

    // 1. Create Order in DB
    const order = await prisma.order.create({
      data: {
        name,
        phone,
        address,
        totalAmount,
        items: items as any,
        status: "pending",
      },
    });

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
      confirmationUrl: payment.confirmation.confirmation_url,
      orderId: order.id,
    });
  } catch (error: any) {
    console.error("Checkout Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
  }
}
