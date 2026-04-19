import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import prisma from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
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

    const post = await prisma.post.update({
      where: { id },
      data: {
        title, excerpt, content, category, isPublished, metaTitle, metaDesc,
        ...(imageUrl ? { image: imageUrl } : {}),
      },
    });
    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.post.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
