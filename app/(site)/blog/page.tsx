import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Calendar, User, Tag, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Блог игромана | Новости, обзоры и гайды | Nintendo Shop",
  description: "Самые свежие новости из мира консолей, подробные обзоры PS5 Pro, Nintendo Switch 2 и ретро-гейминга.",
  alternates: {
    canonical: "/blog"
  }
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' }
  });

  const categories = ["Все", "Обзоры", "Гайды", "Новости", "Слухи"];

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 mt-10">
      <div className="container">
        {/* Massive Hero Section */}
        <div className="relative mb-24 overflow-hidden rounded-[60px] bg-secondary p-12 md:p-24 text-white">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-l from-primary/40 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px]" />
          </div>
          
          <div className="relative z-10 max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
              <Sparkles size={14} />
              Hot news
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Голос <br />
              <span className="text-primary italic">поколения</span> <br />
              геймеров
            </h1>
            <p className="text-xl text-neutral-400 font-bold leading-relaxed max-w-xl">
              Обзоры, от которых горят глаза, и новости, которые меняют индустрию. 
              Разбираем самое важное в мире Nintendo, PlayStation и Xbox.
            </p>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-between gap-8 mb-20">
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button 
                key={cat} 
                className="px-8 py-4 rounded-2xl bg-neutral-50 text-neutral-400 font-black text-sm hover:bg-secondary hover:text-white hover:shadow-xl hover:shadow-secondary/20 transition-all duration-300 uppercase tracking-widest"
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="h-[2px] flex-grow bg-neutral-50 mx-8 hidden lg:block" />
          <div className="text-neutral-500 font-black text-sm uppercase tracking-widest">
            {posts.length} СТАТЕЙ
          </div>
        </div>

        {/* High-End Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post, idx) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className={`group relative flex flex-col bg-white border border-neutral-100 rounded-[50px] overflow-hidden hover:shadow-[0_64px_128px_-16px_rgba(0,0,0,0.1)] transition-all duration-700 ${idx === 0 ? 'md:col-span-2 md:flex-row min-h-[500px]' : ''}`}
            >
              <div className={`relative overflow-hidden ${idx === 0 ? 'md:w-1/2' : 'aspect-[16/10]'}`}>
                <img 
                  src={post.image || "/images/placeholder.jpg"} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-8 left-8">
                  <span className="px-6 py-3 bg-white/95 backdrop-blur-xl rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl">
                    {post.category || "Статья"}
                  </span>
                </div>
              </div>

              <div className={`p-10 md:p-14 flex flex-col justify-center ${idx === 0 ? 'md:w-1/2' : 'flex-grow'}`}>
                <div className="flex items-center gap-6 text-neutral-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-primary" />
                    {format(new Date(post.createdAt), 'dd MMMM yyyy', { locale: ru })}
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-primary" />
                    Nintendo Media
                  </div>
                </div>

                <h3 className={`font-black text-secondary group-hover:text-primary transition-colors leading-[1.1] mb-6 tracking-tighter ${idx === 0 ? 'text-4xl md:text-5xl' : 'text-3xl'}`}>
                  {post.title}
                </h3>

                <p className="text-neutral-500 font-medium leading-relaxed text-lg mb-10 flex-grow">
                  {post.excerpt}
                </p>

                <div className="inline-flex items-center gap-3 text-secondary group-hover:text-primary font-black text-sm uppercase tracking-[0.3em] transition-all">
                  Читать материал
                  <div className="w-12 h-12 rounded-full border border-neutral-100 flex items-center justify-center group-hover:translate-x-3 transition-transform group-hover:border-primary">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter / CTA */}
        <div className="mt-32 p-20 bg-primary/5 rounded-[60px] flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
          
          <Sparkles className="text-primary mb-8" size={48} />
          <h2 className="text-4xl md:text-5xl font-black text-secondary mb-6 max-w-2xl leading-tight">
            Будь первым, кто узнает об релизе Switch 2
          </h2>
          <p className="text-neutral-500 font-bold mb-12 max-w-xl">
            Подпишись на нашу рассылку, и мы отправим тебе секретные промокоды и самые горячие новости игрового мира.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <input 
              type="email" 
              placeholder="Ваш email" 
              className="px-8 py-5 rounded-2xl bg-white border border-neutral-100 shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/20 flex-grow font-bold"
            />
            <button className="px-10 py-5 bg-secondary text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-2xl hover:bg-neutral-900 active:scale-95 uppercase tracking-widest">
              Ок
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
