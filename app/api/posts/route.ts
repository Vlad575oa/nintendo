import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // Fetch more than needed so we can sort Nintendo articles first
    const raw = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: limit * 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        category: true,
        createdAt: true,
      },
    });

    const isNintendo = (p: typeof raw[0]) =>
      p.category?.toLowerCase().includes("nintendo") ||
      p.title?.toLowerCase().includes("nintendo") ||
      p.title?.toLowerCase().includes("switch");

    const posts = [
      ...raw.filter(isNintendo),
      ...raw.filter((p) => !isNintendo(p)),
    ].slice(0, limit);

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json([]);
  }
}
