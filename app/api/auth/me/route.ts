import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth";

export async function GET() {
  try {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (!token) return NextResponse.json(null);

    const session = await prisma.session.findUnique({
      where: { id: token },
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
    });

    if (!session || session.expiresAt < new Date()) {
      cookies().delete(SESSION_COOKIE);
      return NextResponse.json(null);
    }

    return NextResponse.json(session.user);
  } catch {
    return NextResponse.json(null);
  }
}
