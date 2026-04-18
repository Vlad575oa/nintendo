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
          <h3 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
            Экспертные статьи
          </h3>
        </div>
        <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-primary transition-colors">
          Все материалы <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group flex flex-col neu-raised overflow-hidden hover:shadow-[8px_8px_20px_var(--shadow-dark),-8px_-8px_20px_var(--shadow-light)] transition-all duration-500"
          >
            <div className="aspect-video overflow-hidden">
              <img 
                src={post.image || "/images/placeholder.jpg"} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                  {post.category || "Обзор"}
                </span>
                <span className="text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                   <Clock size={10} /> 4 мин
                </span>
              </div>
              <h4 className="text-lg font-black text-[var(--text-primary)] leading-tight uppercase tracking-tight group-hover:text-primary transition-colors mb-4 line-clamp-2">
                {post.title}
              </h4>
              <p className="text-[var(--text-secondary)] text-xs leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
