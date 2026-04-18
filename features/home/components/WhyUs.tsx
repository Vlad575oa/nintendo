"use client";

import { Crown, Heart, Zap, Globe } from "lucide-react";

export const WhyUs = () => {
  return (
    <section className="mb-20 px-8 md:px-20 py-16 md:py-24 bg-neutral-900 rounded-[56px] relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">The Standard</h2>
          <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-8">
            Почему геймеры<br />выбирают нас?
          </h3>
          <p className="text-white/50 text-lg leading-relaxed max-w-md">
            Мы не просто магазин электроники. Мы команда фанатов, которая привозит лучшие 
            гаджеты со всего мира, обеспечивая локальную поддержку и безупречный сервис.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
            <Crown className="text-primary mb-6" size={32} />
            <h4 className="text-white font-black uppercase text-sm mb-3">Premium Selection</h4>
            <p className="text-white/40 text-xs leading-relaxed">Только проверенные бренды и эксклюзивные лимитированные серии.</p>
          </div>
          <div className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
            <Zap className="text-accent mb-6" size={32} />
            <h4 className="text-white font-black uppercase text-sm mb-3">Instant Support</h4>
            <p className="text-white/40 text-xs leading-relaxed">Среднее время ответа в Telegram — 2 минуты в рабочее время.</p>
          </div>
          <div className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
            <Globe className="text-blue-500 mb-6" size={32} />
            <h4 className="text-white font-black uppercase text-sm mb-3">Global Connection</h4>
            <p className="text-white/40 text-xs leading-relaxed">Поставки напрямую от производителей из Японии, США и Европы.</p>
          </div>
          <div className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
            <Heart className="text-red-500 mb-6" size={32} />
            <h4 className="text-white font-black uppercase text-sm mb-3">Community First</h4>
            <p className="text-white/40 text-xs leading-relaxed">Мы организуем турниры и встречи для наших постоянных клиентов.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
