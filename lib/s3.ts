import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const BUCKET = process.env.S3_BUCKET!;
const ENDPOINT = process.env.S3_ENDPOINT!;
const PUBLIC_URL = process.env.S3_PUBLIC_URL ?? ENDPOINT;

const s3 = new S3Client({
  region: process.env.S3_REGION ?? "ru1",
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 5 * 1024 * 1024;

export async function uploadImagesToS3(
  files: File[],
  folder: "products" | "posts"
): Promise<string[]> {
  const urls: string[] = [];

  for (const file of files) {
    if (!ALLOWED_MIME.has(file.type)) {
      throw new Error("Недопустимый формат файла. Разрешены JPG/PNG/WEBP");
    }
    if (file.size > MAX_SIZE) {
      throw new Error("Файл слишком большой. Максимум 5MB");
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const key = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buf,
        ContentType: file.type,
        ACL: "public-read",
      })
    );

    urls.push(`${PUBLIC_URL}/${BUCKET}/${key}`);
  }

  return urls;
}
