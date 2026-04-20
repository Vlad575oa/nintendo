import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, FileText, Eye } from "lucide-react";
import { PostDeleteButton } from "./PostDeleteButton";
import { PostPublishToggle } from "./PostPublishToggle";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <header className="bg-white border-b border-neutral-100 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#111827]">Блог</h1>
          <p className="text-xs text-neutral-400 font-bold mt-0.5">{posts.length} статей</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 bg-primary text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={14} /> Новая статья
        </Link>
      </header>

      <div className="p-8">
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100">
                {["Заголовок", "Категория", "Статус", "Дата", ""].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[9px] font-black uppercase tracking-widest text-neutral-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-20 text-center">
                    <FileText size={40} className="mx-auto mb-3 text-neutral-200" />
                    <p className="text-neutral-400 font-bold text-sm">Статей нет. Напишите первую!</p>
                  </td>
                </tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.image && (
                          <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-black text-[#111827] line-clamp-1 max-w-xs">{p.title}</p>
                          <p className="text-[10px] text-neutral-400 font-bold">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-neutral-500">{p.category ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${p.isPublished ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>
                        {p.isPublished ? "Опубликована" : "Черновик"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-neutral-400">
                      {new Date(p.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <PostPublishToggle postId={p.id} isPublished={p.isPublished} />
                        <Link
                          href={`/admin/posts/${p.id}/edit`}
                          className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all"
                        >
                          <Pencil size={13} />
                        </Link>
                        <PostDeleteButton postId={p.id} postTitle={p.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
