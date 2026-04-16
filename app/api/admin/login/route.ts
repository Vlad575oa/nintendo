import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // In production, move this to .env (e.g. ADMIN_PASSWORD=...)
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "nintendo2026";

    if (password === ADMIN_PASSWORD) {
      // Set secure cookie
      cookies().set("admin_session", "verified_session_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
