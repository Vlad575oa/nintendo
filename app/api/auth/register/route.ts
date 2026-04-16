import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import {
  hashPassword,
  generateSessionToken,
  getSessionExpiry,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен содержать не менее 6 символов" },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Необходимо указать email или телефон" },
        { status: 400 }
      );
    }

    // Check uniqueness
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json(
          { error: "Пользователь с таким email уже существует" },
          { status: 409 }
        );
      }
    }

    if (phone) {
      const normalized = phone.replace(/\D/g, "");
      const existing = await prisma.user.findUnique({ where: { phone: normalized } });
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
        email: email || null,
        phone: phone ? phone.replace(/\D/g, "") : null,
        passwordHash: hash,
        passwordSalt: salt,
      },
    });

    // Create session immediately after registration
    const token = generateSessionToken();
    await prisma.session.create({
      data: {
        id: token,
        userId: user.id,
        expiresAt: getSessionExpiry(),
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
