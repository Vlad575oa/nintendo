import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  hashPassword,
  generateSessionToken,
  getSessionExpiry,
  SESSION_COOKIE,
} from "@/lib/auth";
import { buildRateLimitKey, rateLimit } from "@/lib/rateLimit";

const RegisterSchema = z.object({
  name: z.string().trim().min(2).max(80).optional().or(z.literal("")),
  email: z.string().trim().toLowerCase().email().max(120).optional().or(z.literal("")),
  phone: z.string().trim().min(10).max(24).optional().or(z.literal("")),
  password: z.string().min(8).max(128),
}).refine((d) => Boolean(d.email) || Boolean(d.phone), {
  message: "Необходимо указать email или телефон",
  path: ["email"],
});

export async function POST(request: Request) {
  try {
    const limit = rateLimit(buildRateLimitKey("auth-register", request), 5, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
    }
    const parsed = RegisterSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Некорректные данные" }, { status: 400 });
    }
    const { name, email, phone, password } = parsed.data;
    const normalizedEmail = email ? email.toLowerCase() : null;
    const normalizedPhone = phone ? phone.replace(/\D/g, "") : null;
    if (normalizedPhone && (normalizedPhone.length < 10 || normalizedPhone.length > 15)) {
      return NextResponse.json({ error: "Некорректный номер телефона" }, { status: 400 });
    }

    // Check uniqueness
    if (normalizedEmail) {
      const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existing) {
        return NextResponse.json(
          { error: "Пользователь с таким email уже существует" },
          { status: 409 }
        );
      }
    }

    if (normalizedPhone) {
      const existing = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
      if (existing) {
        return NextResponse.json(
          { error: "Пользователь с таким телефоном уже существует" },
          { status: 409 }
        );
      }
    }

    const { hash, salt } = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash: hash,
        passwordSalt: salt,
      },
    });

    // Create session immediately after registration
    const token = generateSessionToken();
    await prisma.session.create({
      data: {
        id: token,
        sessionToken: token,
        userId: user.id,
        expires: getSessionExpiry(),
      },
    });

    cookies().set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("[register]", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
