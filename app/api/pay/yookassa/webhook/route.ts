import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, object } = body;

    // Validate that it's a payment success event
    if (event === "payment.succeeded") {
      const paymentId = object.id;
      
      const order = await prisma.order.findUnique({ where: { paymentId: paymentId } });
      
      // Idempotency check: if already paid, just ignore
      if (order && order.status !== "paid") {
        await prisma.order.update({
          where: { paymentId: paymentId },
          data: { status: "paid" },
        });
      }
    }

    if (event === "payment.canceled") {
      const paymentId = object.id;
      await prisma.order.update({
        where: { paymentId: paymentId },
        data: { status: "failed" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return NextResponse.json({ success: false, error: "Webhook failed" }, { status: 400 });
  }
}
