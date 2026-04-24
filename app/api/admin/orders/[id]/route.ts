import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const OrderStatusSchema = z.object({
  status: z.enum(["pending", "paid", "processing", "shipped", "completed", "failed", "cancelled"]),
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const parsed = OrderStatusSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Некорректный статус" }, { status: 400 });
    }
    const { status } = parsed.data;
    const order = await prisma.order.update({
      where: { id: parseInt(params.id) },
      data: { status },
    });
    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
