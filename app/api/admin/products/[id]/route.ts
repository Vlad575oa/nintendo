import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/adminSession";
import { uploadImagesToS3 } from "@/lib/s3";

function normalizeSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await verifyAdminSession(cookies().get(ADMIN_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authSession = await verifyAdminSession(cookies().get(ADMIN_COOKIE)?.value);
  if (!authSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    const slugRaw = (fd.get("slug") as string) || "";
    const attrsRaw = fd.get("attributes") as string;
    const attributesList: { key: string; value: string }[] = attrsRaw ? JSON.parse(attrsRaw) : [];
    const attributes = Object.fromEntries(attributesList.map((a) => [a.key, a.value]));

    const existingImagesRaw = fd.get("existingImages") as string;
    const existingImages: string[] = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];

    const newFiles = fd.getAll("images") as File[];
    const newUrls = newFiles.length ? await uploadImagesToS3(newFiles, "products") : [];
    const images = [...existingImages, ...newUrls];

    const childCount = await prisma.category.count({ where: { parentId: categoryId } });
    if (childCount > 0) {
      return NextResponse.json(
        { error: "Для выбранной категории нужно указать подкатегорию" },
        { status: 400 }
      );
    }

    const slug = normalizeSlug(slugRaw);
    if (!slug) {
      return NextResponse.json({ error: "Slug обязателен" }, { status: 400 });
    }

    const conflict = await prisma.product.findFirst({
      where: { slug, NOT: { id } },
    });
    if (conflict) {
      return NextResponse.json(
        { error: `Slug «${slug}» уже занят товаром ID ${conflict.id}` },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name, description, price, priceOld, categoryId,
        brand, color, inStock, isNew, isSale, stock,
        images, attributes, metaTitle, metaDesc,
        slug,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await verifyAdminSession(cookies().get(ADMIN_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    const session = await verifyAdminSession(cookies().get(ADMIN_COOKIE)?.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.r === "MANAGER") {
      return NextResponse.json(
        { error: "У менеджера нет прав на удаление товаров" },
        { status: 403 }
      );
    }

    await prisma.product.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
