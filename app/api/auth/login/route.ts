import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  verifyPassword,
  generateSessionToken,
  getSessionExpiry,
  SESSION_COOKIE,
} from "@/lib/auth";
import { buildRateLimitKey, rateLimit } from "@/lib/rateLimit";

const LoginSchema = z.object({
  identifier: z.string().trim().min(3).max(120),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const limit = rateLimit(buildRateLimitKey("auth-login", request), 10, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
    }

    const parsed = LoginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }
    const { identifier, password } = parsed.data;

    // Determine if identifier is email or phone
    const isEmail = identifier.includes("@");
    const normalized = isEmail ? identifier.toLowerCase() : identifier.replace(/\D/g, "");
    if (!isEmail && (normalized.length < 10 || normalized.length > 15)) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: isEmail ? { email: normalized } : { phone: normalized },
    });

    if (!user || !user.passwordHash || !user.passwordSalt) {
      return NextResponse.json(
        { error: "Неверный логин или пароль" },
        { status: 401 }
      );
    }

    const valid = verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!valid) {
      return NextResponse.json(
        { error: "Неверный логин или пароль" },
        { status: 401 }
      );
    }

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
    console.error("[login]", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
