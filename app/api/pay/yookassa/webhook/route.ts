import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const WebhookSchema = z.object({
  event: z.string(),
  object: z.object({
    id: z.string(),
    status: z.string().optional(),
  }),
});

export async function POST(req: Request) {
  try {
    const parsed = WebhookSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }
    const { event, object } = parsed.data;

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
      const order = await prisma.order.findUnique({ where: { paymentId } });
      if (order && order.status !== "paid") {
        await prisma.order.update({
          where: { paymentId },
          data: { status: "failed" },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return NextResponse.json({ success: false, error: "Webhook failed" }, { status: 400 });
  }
}
