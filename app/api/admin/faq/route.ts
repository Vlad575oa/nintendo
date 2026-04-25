import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/adminSession";
import { z } from "zod";

const FAQSchema = z.object({
  question: z.string().min(5).max(500),
  answer: z.string().min(5).max(5000),
  category: z.string().max(100).optional(),
  order: z.number().int().min(0).max(10000).optional(),
});

export async function GET() {
  const faqs = await prisma.fAQ.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  return NextResponse.json(faqs);
}

export async function POST(request: Request) {
  const session = await verifyAdminSession(cookies().get(ADMIN_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const parsed = FAQSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const faq = await prisma.fAQ.create({
      data: {
        question: parsed.data.question,
        answer: parsed.data.answer,
        category: parsed.data.category ?? "Заказы",
        order: parsed.data.order ?? 0,
      },
    });
    return NextResponse.json({ success: true, faq });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
