import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import prisma from "@/lib/prisma";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[а-яёa-z0-9]+/gi, (m) => m)
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function saveImages(files: File[]): Promise<string[]> {
  const uploadDir = join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadDir, { recursive: true });
  const urls: string[] = [];
  for (const file of files) {
    const buf = Buffer.from(await file.arrayBuffer());
    const name = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    await writeFile(join(uploadDir, name), buf);
    urls.push(`/uploads/products/${name}`);
  }
  return urls;
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
    const imageUrls = files.length ? await saveImages(files) : [];

    let slug = slugify(name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

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
