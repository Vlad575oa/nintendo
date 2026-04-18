import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Блог игромана | Новости, обзоры и гайды | Nintendo Shop",
  description: "Самые свежие новости из мира консолей, подробные обзоры PS5 Pro, Nintendo Switch 2 и ретро-гейминга.",
  alternates: { canonical: "/blog" },
};

const calculateReadingTime = (content: string) => {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
};

const CATEGORY_COLORS: Record<string, string> = {
  "Обзоры":  "bg-blue-50 text-blue-600",
  "Гайды":   "bg-green-50 text-green-600",
  "Новости": "bg-orange-50 text-orange-600",
  "Слухи":   "bg-purple-50 text-purple-600",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const currentCategory = searchParams.category || "Все";

  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      ...(currentCategory !== "Все" ? { category: currentCategory } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const allPosts = await prisma.post.findMany({
    where: { isPublished: true },
    select: { category: true },
  });

  const counts = allPosts.reduce<Record<string, number>>((acc, p) => {
    if (p.category) acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  const categories = ["Все", "Обзоры", "Гайды", "Новости", "Слухи"];

  return (
    <div className="bg-[#fcfcfd] min-h-screen pt-6 pb-20">
      <div className="container">

        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-secondary uppercase leading-[0.9] mb-3">
            Блог <span className="text-primary">игромана</span>
          </h1>
          <p className="text-neutral-400 font-bold max-w-xl">
            Обзоры, гайды, новости и слухи из мира Nintendo, PS5 и Xbox.
          </p>
        </div>

        {/* Categories filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 border-b border-neutral-100 pb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = currentCategory === cat;
              const count = cat === "Все" ? allPosts.length : (counts[cat] ?? 0);
              return (
                <Link
                  key={cat}
                  href={cat === "Все" ? "/blog" : `/blog?category=${cat}`}
                  scroll={false}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-[11px] uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "bg-secondary text-white shadow-lg"
                      : "bg-white text-neutral-400 hover:bg-neutral-50 border border-neutral-100"
                  }`}
                >
                  {cat}
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-400"}`}>
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
          <p className="text-neutral-400 font-bold text-[9px] uppercase tracking-[0.2em] bg-neutral-50 px-4 py-2 rounded-lg border border-neutral-100">
            Найдено: {posts.length} {posts.length === 1 ? "публикация" : posts.length < 5 ? "публикации" : "публикаций"}
          </p>
        </div>

        {/* Post grid */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-[32px] py-24 text-center border border-neutral-100">
            <p className="text-2xl font-black text-neutral-200 mb-2">Пусто</p>
            <p className="text-neutral-400 font-bold text-sm">В этой категории пока нет статей</p>
            <Link href="/blog" className="mt-4 inline-block text-primary font-black text-sm hover:underline">
              Посмотреть все →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => {
              const isFeatured = idx === 0 && currentCategory === "Все";
              const readTime = calculateReadingTime(post.content);
              const catColor = CATEGORY_COLORS[post.category ?? ""] ?? "bg-neutral-50 text-neutral-500";

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group flex flex-col bg-white border border-neutral-100 rounded-[28px] overflow-hidden hover:border-primary/20 hover:shadow-2xl hover:shadow-neutral-200/60 transition-all duration-500 ${
                    isFeatured ? "md:col-span-2 lg:col-span-2 md:flex-row" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`relative overflow-hidden bg-neutral-100 ${
                      isFeatured ? "md:w-1/2 aspect-video md:aspect-auto" : "aspect-[16/9]"
                    }`}
                  >
                    <img
                      src={post.image || "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Category badge on image */}
                    <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${catColor}`}>
                      {post.category || "Статья"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className={`p-7 flex flex-col flex-grow ${isFeatured ? "md:w-1/2 justify-center md:p-10" : ""}`}>
                    <div className="flex items-center gap-3 text-neutral-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} className="text-primary" />
                        {readTime} мин
                      </div>
                      <span className="w-1 h-1 bg-neutral-200 rounded-full" />
                      {format(new Date(post.createdAt), "dd.MM.yy")}
                    </div>

                    <h3
                      className={`font-black text-secondary group-hover:text-primary transition-colors leading-[1.2] mb-3 tracking-tight ${
                        isFeatured ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
                      }`}
                    >
                      {post.title}
                    </h3>

                    <p className="text-neutral-500 font-medium leading-relaxed text-sm mb-6 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-neutral-50 pt-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center">
                          <User size={12} className="text-neutral-400" />
                        </div>
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                          Nintendo Media
                        </span>
                      </div>
                      <div className="w-9 h-9 rounded-full border border-neutral-100 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
