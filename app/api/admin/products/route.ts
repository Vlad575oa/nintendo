import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract product data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseInt(formData.get("price") as string) * 100; // Convert to kopeks
    const priceOld = formData.get("priceOld") ? parseInt(formData.get("priceOld") as string) * 100 : null;
    const categoryName = formData.get("category") as string;
    const metaTitle = formData.get("metaTitle") as string;
    const metaDesc = formData.get("metaDesc") as string;
    
    // Handle Images
    const files = formData.getAll("images") as File[];
    const imageUrls: string[] = [];

    if (files.length > 0) {
      // Ensure the uploads directory exists
      const uploadDir = join(process.cwd(), "public", "uploads", "products");
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // Directory might already exist
      }

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = join(uploadDir, filename);

        await writeFile(filePath, buffer);
        imageUrls.push(`/uploads/products/${filename}`);
      }
    }

    // Find category ID
    const category = await prisma.category.findFirst({
        where: { name: { contains: categoryName, mode: 'insensitive' } }
    });

    if (!category) {
        return NextResponse.json({ error: "Категория не найдена" }, { status: 400 });
    }

    // Create product in DB
    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        description,
        price,
        priceOld,
        images: imageUrls,
        categoryId: category.id,
        metaTitle,
        metaDesc,
        inStock: true,
        stock: 10,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Ошибка при сохранении товара: " + error.message }, { status: 500 });
  }
}
