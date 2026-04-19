import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PostForm } from "../../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: parseInt(params.id) } });
  if (!post) notFound();

  return (
    <PostForm
      initial={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        content: post.content,
        image: post.image ?? "",
        category: post.category ?? "Статья",
        isPublished: post.isPublished,
        metaTitle: post.metaTitle ?? "",
        metaDesc: post.metaDesc ?? "",
      }}
    />
  );
}
