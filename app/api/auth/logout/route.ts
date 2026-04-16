import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  try {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (token) {
      await prisma.session.deleteMany({ where: { id: token } }).catch(() => {});
      cookies().delete(SESSION_COOKIE);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
