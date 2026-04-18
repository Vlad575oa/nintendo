"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export const ExpertInsights = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/posts?limit=3")
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(() => {});
  }, []);

  if (!posts.length) return null;

  return (
    <section className="mb-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Knowledge Base</h2>
          <h3 className="text-3xl md:text-5xl font-black text-secondary dark:text-white uppercase tracking-tighter leading-none">
            Экспертные статьи
          </h3>
        </div>
        <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors">
          Все материалы <ArrowRight size={14} />
        </Link>
      </div>

      {/* Elite Layer: Key Takeaways Summary */}
      <div className="mb-12 p-8 bg-neutral-950 rounded-[32px] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Clock size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Quick Summary</h4>
            <h5 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
               Главное сегодня в мире гейминга
            </h5>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {[
                    "Предзаказы Switch 2 ожидаются в Q4 2026",
                    "Ghost of Yotei: новые детали геймплея",
                    "Xbox Game Pass расширяет библиотеку в СНГ",
                    "Retro-тренды: почему цены на GameBoy растут"
                ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/60 text-xs font-bold uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group flex flex-col bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm border border-neutral-100 dark:border-white/5 rounded-[32px] overflow-hidden hover:border-primary/20 transition-all duration-500 hover:-translate-y-1"
          >
            <div className="aspect-video overflow-hidden">
              <img 
                src={post.image || "/images/placeholder.jpg"} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                  {post.category || "Обзор"}
                </span>
                <span className="text-neutral-400 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                   <Clock size={10} /> 4 мин
                </span>
              </div>
              <h4 className="text-lg font-black text-secondary dark:text-white leading-tight uppercase tracking-tight group-hover:text-primary transition-colors mb-4 line-clamp-2">
                {post.title}
              </h4>
              <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
