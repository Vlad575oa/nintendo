import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import {
  verifyPassword,
  generateSessionToken,
  getSessionExpiry,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Заполните все поля" },
        { status: 400 }
      );
    }

    // Determine if identifier is email or phone
    const isEmail = identifier.includes("@");
    const normalized = isEmail ? identifier.toLowerCase() : identifier.replace(/\D/g, "");

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
