import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import prisma from "@/lib/prisma";

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

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
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

    const existingImagesRaw = fd.get("existingImages") as string;
    const existingImages: string[] = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];

    const newFiles = fd.getAll("images") as File[];
    const newUrls = newFiles.length ? await saveImages(newFiles) : [];
    const images = [...existingImages, ...newUrls];

    const product = await prisma.product.update({
      where: { id },
      data: {
        name, description, price, priceOld, categoryId,
        brand, color, inStock, isNew, isSale, stock,
        images, attributes, metaTitle, metaDesc,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { isVisible } = await request.json();
    const product = await prisma.product.update({ where: { id }, data: { isVisible } });
    return NextResponse.json({ success: true, isVisible: product.isVisible });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
