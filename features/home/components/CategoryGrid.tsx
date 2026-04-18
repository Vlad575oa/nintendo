"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    id: "consoles",
    name: "Игровые консоли",
    items: "50+ позиций",
    image: "/images/blog/ps5-pro-premium.jpg",
    accent: "from-blue-500/10",
  },
  {
    id: "games",
    name: "Игры & Хиты",
    items: "200+ позиций",
    image: "/images/blog/switch-2-best-games-2026.jpg",
    accent: "from-red-500/10",
  },
  {
    id: "accessories",
    name: "Аксессуары",
    items: "120+ позиций",
    image: "/images/blog/switch-accessories-premium.jpg",
    accent: "from-purple-500/10",
  },
  {
    id: "retro",
    name: "Ретро-гейминг",
    items: "30+ позиций",
    image: "/images/blog/retro-gaming-premium.jpg",
    accent: "from-orange-500/10",
  },
];

export const CategoryGrid = () => {
  return (
    <section className="mb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Shop by Universe</h2>
          <h3 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none">
            Основные категории
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            href={`/catalog/${cat.id}`}
            className="group relative h-[320px] neu-raised overflow-hidden hover:shadow-[8px_8px_20px_var(--shadow-dark),-8px_-8px_20px_var(--shadow-light)] transition-all duration-500"
          >
            {/* Background Image */}
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />
            
            {/* Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent} via-black/10 to-transparent`} />
            <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{cat.items}</span>
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                {cat.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
