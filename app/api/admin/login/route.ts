import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { z } from "zod";
import { ADMIN_COOKIE, createAdminSession } from "@/lib/adminSession";
import { buildRateLimitKey, rateLimit } from "@/lib/rateLimit";

const AdminLoginSchema = z.object({
  password: z.string().min(8).max(128),
});

function safeEqual(input: string, secret: string): boolean {
  const left = crypto.createHash("sha256").update(input).digest();
  const right = crypto.createHash("sha256").update(secret).digest();
  return crypto.timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  try {
    const limit = rateLimit(buildRateLimitKey("admin-login", request), 10, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Слишком много попыток. Попробуйте позже." }, { status: 429 });
    }

    const parsed = AdminLoginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
    }
    const { password } = parsed.data;

    const directorPassword = process.env.ADMIN_DIRECTOR_PASSWORD;
    const managerPassword = process.env.ADMIN_MANAGER_PASSWORD;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!directorPassword && !managerPassword && !adminPassword) {
      return NextResponse.json({ error: "Админ-доступ не настроен на сервере" }, { status: 503 });
    }

    let role: "DIRECTOR" | "MANAGER" | "ADMIN" | null = null;
    if (directorPassword && safeEqual(password, directorPassword)) role = "DIRECTOR";
    else if (managerPassword && safeEqual(password, managerPassword)) role = "MANAGER";
    else if (adminPassword && safeEqual(password, adminPassword)) role = "ADMIN";

    if (role) {
      cookies().set(ADMIN_COOKIE, await createAdminSession(role), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 12, // 12 hours
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
