import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { buildRateLimitKey, rateLimit } from "@/lib/rateLimit";

const ContactsSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  topic: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(3000),
});

export async function POST(req: Request) {
  try {
    const limit = rateLimit(buildRateLimitKey("contacts", req), 5, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Слишком много запросов. Попробуйте позже." }, { status: 429 });
    }
    const parsed = ContactsSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Некорректные данные формы" }, { status: 400 });
    }
    const { name, email, topic, message } = parsed.data;

    await prisma.contactMessage.create({
      data: { name, email, topic, message },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact form error:", error.message);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
