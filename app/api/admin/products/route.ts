import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadImagesToS3 } from "@/lib/s3";

function normalizeSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const fd = await request.formData();

    const name = fd.get("name") as string;
    const description = fd.get("description") as string;
    const price = Math.round(parseFloat(fd.get("price") as string) * 100);
    const priceOldRaw = fd.get("priceOld") as string;
    const priceOld = priceOldRaw ? Math.round(parseFloat(priceOldRaw) * 100) : null;
    const categoryId = parseInt(fd.get("categoryId") as string);
    const brand = (fd.get("brand") as string) || null;
    const color = (fd.get("color") as string) || null;
    const inStock = fd.get("inStock") === "true";
    const isNew = fd.get("isNew") === "true";
    const isSale = fd.get("isSale") === "true";
    const stock = parseInt(fd.get("stock") as string) || 10;
    const metaTitle = (fd.get("metaTitle") as string) || null;
    const metaDesc = (fd.get("metaDesc") as string) || null;
    const attrsRaw = fd.get("attributes") as string;
    const attributesList: { key: string; value: string }[] = attrsRaw ? JSON.parse(attrsRaw) : [];
    const attributes = Object.fromEntries(attributesList.map((a) => [a.key, a.value]));

    const files = fd.getAll("images") as File[];
    const imageUrls = files.length ? await uploadImagesToS3(files, "products") : [];

    const childCount = await prisma.category.count({ where: { parentId: categoryId } });
    if (childCount > 0) {
      return NextResponse.json(
        { error: "Для выбранной категории нужно указать подкатегорию" },
        { status: 400 }
      );
    }

    const slugRaw = (fd.get("slug") as string) || "";
    if (!slugRaw.trim()) {
      return NextResponse.json({ error: "Slug обязателен" }, { status: 400 });
    }
    const slug = normalizeSlug(slugRaw);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: `Slug «${slug}» уже занят товаром «${existing.name}»` },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name, slug, description, price, priceOld,
        categoryId, brand, color, inStock, isNew, isSale,
        stock, images: imageUrls, attributes, metaTitle, metaDesc,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
