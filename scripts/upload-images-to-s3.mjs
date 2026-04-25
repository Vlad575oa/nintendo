// Run: node scripts/upload-images-to-s3.mjs
// Uploads all files from public/images/** to S3 and updates DB image URLs

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";
import { join, relative, extname } from "path";
import { createReadStream, readdirSync, statSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config({ path: ".env" });

const BUCKET = process.env.S3_BUCKET;
const ENDPOINT = process.env.S3_ENDPOINT;
const PUBLIC_URL = process.env.S3_PUBLIC_URL ?? ENDPOINT;
const ACCESS_KEY = process.env.S3_ACCESS_KEY;
const SECRET_KEY = process.env.S3_SECRET_KEY;

if (!BUCKET || !ENDPOINT || !ACCESS_KEY || !SECRET_KEY) {
  console.error("❌ Не заданы S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY или S3_SECRET_KEY в .env");
  process.exit(1);
}

const s3 = new S3Client({
  region: process.env.S3_REGION ?? "ru1",
  endpoint: ENDPOINT,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
  forcePathStyle: true,
});

const prisma = new PrismaClient();

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
};

// Recursively collect all files
function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (entry === ".DS_Store") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

const publicDir = join(process.cwd(), "public");
const imagesDir = join(publicDir, "images");
const allFiles = walk(imagesDir);

// Map: local path → S3 URL
const urlMap = new Map();

console.log(`📦 Загружаем ${allFiles.length} файлов в S3...\n`);

let uploaded = 0;
let skipped = 0;

for (const filePath of allFiles) {
  const ext = extname(filePath).toLowerCase();
  const contentType = MIME[ext];
  if (!contentType) { skipped++; continue; }

  // Key = relative path from public/, e.g. "images/blog/foo.webp"
  const key = relative(publicDir, filePath).replace(/\\/g, "/");
  const buf = await readFile(filePath);

  try {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buf,
      ContentType: contentType,
      ACL: "public-read",
    }));
    const s3Url = `${PUBLIC_URL}/${BUCKET}/${key}`;
    urlMap.set(`/${key}`, s3Url);
    uploaded++;
    if (uploaded % 50 === 0) console.log(`  ✅ ${uploaded}/${allFiles.length}`);
  } catch (err) {
    console.error(`  ❌ Ошибка загрузки ${key}: ${err.message}`);
  }
}

console.log(`\n✅ Загружено: ${uploaded}, пропущено: ${skipped}`);

// Update product image URLs in DB
console.log("\n🔄 Обновляем URL изображений товаров в БД...");
const products = await prisma.product.findMany({ select: { id: true, images: true } });
let updatedProducts = 0;

for (const product of products) {
  const newImages = product.images.map(img => urlMap.get(img) ?? img);
  if (newImages.some((url, i) => url !== product.images[i])) {
    await prisma.product.update({ where: { id: product.id }, data: { images: newImages } });
    updatedProducts++;
  }
}
console.log(`  ✅ Товаров обновлено: ${updatedProducts}`);

// Update post image URLs in DB
console.log("\n🔄 Обновляем URL изображений статей в БД...");
const posts = await prisma.post.findMany({ select: { id: true, image: true } });
let updatedPosts = 0;

for (const post of posts) {
  if (!post.image) continue;
  const newImage = urlMap.get(post.image) ?? post.image;
  if (newImage !== post.image) {
    await prisma.post.update({ where: { id: post.id }, data: { image: newImage } });
    updatedPosts++;
  }
}
console.log(`  ✅ Статей обновлено: ${updatedPosts}`);

await prisma.$disconnect();
console.log("\n🎉 Готово! Все изображения загружены на S3 и ссылки в БД обновлены.");
