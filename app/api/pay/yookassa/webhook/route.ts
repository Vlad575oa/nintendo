import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Yookassa IP ranges (official list)
const YOOKASSA_IPS = [
  "185.71.76.", "185.71.77.", "77.75.153.", "77.75.154.",
  "77.75.156.", "2a02:5180:",
];

const WebhookSchema = z.object({
  event: z.string(),
  object: z.object({
    id: z.string(),
    status: z.string().optional(),
  }),
});

function isYookassaIp(ip: string): boolean {
  return YOOKASSA_IPS.some((prefix) => ip.startsWith(prefix));
}

async function verifyPaymentWithYookassa(paymentId: string): Promise<string | null> {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secretKey = process.env.YOOKASSA_SECRET_KEY;
  if (!shopId || !secretKey) return null;

  try {
    const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");
    const res = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.status as string;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    // IP verification
    const forwardedFor = req.headers.get("x-forwarded-for") ?? "";
    const realIp = req.headers.get("x-real-ip") ?? "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || realIp;

    if (process.env.NODE_ENV === "production" && !isYookassaIp(clientIp)) {
      console.warn(`Webhook rejected: unknown IP ${clientIp}`);
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const parsed = WebhookSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }
    const { event, object } = parsed.data;

    if (event === "payment.succeeded") {
      const paymentId = object.id;

      // Verify payment status directly with Yookassa (don't trust webhook payload)
      const confirmedStatus = await verifyPaymentWithYookassa(paymentId);
      if (confirmedStatus !== "succeeded") {
        console.warn(`Webhook fraud attempt: payment ${paymentId} status is ${confirmedStatus}`);
        return NextResponse.json({ success: false }, { status: 400 });
      }

      const order = await prisma.order.findUnique({ where: { paymentId } });
      if (order && order.status !== "paid") {
        await prisma.order.update({ where: { paymentId }, data: { status: "paid" } });
      }
    }

    if (event === "payment.canceled") {
      const paymentId = object.id;
      const order = await prisma.order.findUnique({ where: { paymentId } });
      if (order && order.status !== "paid") {
        await prisma.order.update({ where: { paymentId }, data: { status: "failed" } });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return NextResponse.json({ success: false, error: "Webhook failed" }, { status: 400 });
  }
}
