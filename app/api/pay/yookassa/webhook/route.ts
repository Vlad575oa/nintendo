import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, object } = body;

    // Validate that it's a payment success event
    if (event === "payment.succeeded") {
      const paymentId = object.id;
      
      await prisma.order.update({
        where: { paymentId: paymentId },
        data: { status: "paid" },
      });
      
      console.log(`Payment confirmed for order with paymentId ${paymentId}`);
    }

    if (event === "payment.canceled") {
      const paymentId = object.id;
      await prisma.order.update({
        where: { paymentId: paymentId },
        data: { status: "failed" },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
