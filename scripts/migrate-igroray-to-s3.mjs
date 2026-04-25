// node scripts/migrate-igroray-to-s3.mjs
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import crypto from "crypto";

config({ path: ".env" });

const BUCKET = process.env.S3_BUCKET;
const ENDPOINT = process.env.S3_ENDPOINT;
const PUBLIC_URL = process.env.S3_PUBLIC_URL ?? ENDPOINT;

const s3 = new S3Client({
  region: process.env.S3_REGION ?? "ru1",
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

const prisma = new PrismaClient();

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function fetchAndUpload(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type")?.split(";")[0] ?? "image/jpeg";
  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const key = `products/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buf,
    ContentType: contentType,
    ACL: "public-read",
  }));

  return `${PUBLIC_URL}/${BUCKET}/${key}`;
}

const products = await prisma.$queryRaw`
  SELECT id, name, images FROM "Product" WHERE images::text LIKE '%igroray%'
`;

console.log(`🔄 Мигрируем изображения ${products.length} товаров с igroray.ru → S3\n`);

let success = 0;
let errors = 0;

for (const product of products) {
  const images = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
  const newImages = [];
  let changed = false;

  for (const imgUrl of images) {
    if (!imgUrl.includes("igroray.ru")) {
      newImages.push(imgUrl);
      continue;
    }
    try {
      const s3Url = await fetchAndUpload(imgUrl);
      newImages.push(s3Url);
      changed = true;
    } catch (err) {
      console.error(`  ❌ [${product.id}] ${imgUrl.slice(0, 60)}... → ${err.message}`);
      newImages.push(imgUrl); // keep original on error
      errors++;
    }
  }

  if (changed) {
    await prisma.product.update({ where: { id: product.id }, data: { images: newImages } });
    console.log(`  ✅ [${product.id}] ${product.name}`);
    success++;
  }
}

await prisma.$disconnect();
console.log(`\n🎉 Готово! Успешно: ${success}, ошибок: ${errors}`);
