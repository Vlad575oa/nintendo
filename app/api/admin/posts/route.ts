import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import prisma from "@/lib/prisma";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9а-яёa-z-]/gi, "")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const fd = await request.formData();
    const title = fd.get("title") as string;
    const excerpt = (fd.get("excerpt") as string) || null;
    const content = fd.get("content") as string;
    const category = (fd.get("category") as string) || "Статья";
    const isPublished = fd.get("isPublished") === "true";
    const metaTitle = (fd.get("metaTitle") as string) || null;
    const metaDesc = (fd.get("metaDesc") as string) || null;

    let imageUrl: string | null = (fd.get("imageUrl") as string) || null;
    const imageFile = fd.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const uploadDir = join(process.cwd(), "public", "uploads", "posts");
      await mkdir(uploadDir, { recursive: true });
      const buf = Buffer.from(await imageFile.arrayBuffer());
      const name = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
      await writeFile(join(uploadDir, name), buf);
      imageUrl = `/uploads/posts/${name}`;
    }

    let slug = slugify(title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const post = await prisma.post.create({
      data: { title, slug, excerpt, content, category, isPublished, image: imageUrl, metaTitle, metaDesc },
    });
    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
