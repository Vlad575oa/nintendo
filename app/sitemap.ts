import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://nintendo-shop.ru";

  // Get all products
  const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true, category: { select: { slug: true } } } });
  
  // Get all categories
  const categories = await prisma.category.findMany({ select: { slug: true } });

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/catalog/${p.category.slug}/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  const categoryUrls = categories.map((c) => ({
    url: `${baseUrl}/catalog/${c.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/catalog`, lastModified: new Date() },
    ...categoryUrls,
    ...productUrls,
  ];
}
