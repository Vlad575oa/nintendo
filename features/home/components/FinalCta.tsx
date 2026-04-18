"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const FinalCta = () => {
  return (
    <section className="relative h-[400px] mb-20 rounded-[40px] overflow-hidden bg-primary flex items-center justify-center text-center p-8">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden flex flex-wrap gap-1 items-center justify-center">
        {Array.from({ length: 100 }).map((_, i) => (
          <span key={i} className="text-4xl font-black text-white transform rotate-45">N</span>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl">
        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-6">
          Готовы начать<br />свой новый квест?
        </h3>
        <p className="text-white/80 font-bold mb-10 text-sm md:text-base uppercase tracking-widest">
          Присоединяйтесь к тысячам довольных геймеров Nintendo Shop
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/catalog" 
            className="w-full sm:w-auto px-10 h-16 bg-white text-primary rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all duration-300"
          >
            Перейти в каталог
            <ArrowRight size={18} />
          </Link>
          <Link 
            href="/auth/register" 
            className="w-full sm:w-auto px-10 h-16 bg-black/10 text-white border border-white/20 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest hover:bg-black/20 transition-all duration-300"
          >
            Создать аккаунт
          </Link>
        </div>
      </div>
    </section>
  );
};
