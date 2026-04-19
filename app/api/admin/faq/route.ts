import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const faqs = await prisma.fAQ.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  return NextResponse.json(faqs);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const faq = await prisma.fAQ.create({
      data: {
        question: body.question,
        answer: body.answer,
        category: body.category ?? "Заказы",
        order: body.order ?? 0,
      },
    });
    return NextResponse.json({ success: true, faq });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
