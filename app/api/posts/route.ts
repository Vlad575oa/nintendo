import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: limit,
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

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json([]);
  }
}
