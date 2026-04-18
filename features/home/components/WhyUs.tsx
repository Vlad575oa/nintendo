"use client";

import { Crown, Heart, Zap, Globe } from "lucide-react";

const advantages = [
  {
    icon: Crown,
    color: "text-primary",
    title: "Premium Selection",
    desc: "Только проверенные бренды и эксклюзивные лимитированные серии.",
  },
  {
    icon: Zap,
    color: "text-amber-500",
    title: "Instant Support",
    desc: "Среднее время ответа в Telegram — 2 минуты в рабочее время.",
  },
  {
    icon: Globe,
    color: "text-blue-500",
    title: "Global Connection",
    desc: "Поставки напрямую от производителей из Японии, США и Европы.",
  },
  {
    icon: Heart,
    color: "text-rose-500",
    title: "Community First",
    desc: "Мы организуем турниры и встречи для наших постоянных клиентов.",
  },
];

export const WhyUs = () => {
  return (
    <section className="mb-20 neu-raised px-8 md:px-20 py-16 md:py-24 relative overflow-hidden">
      {/* Soft decorative glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">The Standard</h2>
          <h3 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter leading-none mb-8">
            Почему геймеры<br />выбирают нас?
          </h3>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-md">
            Мы не просто магазин электроники. Мы команда фанатов, которая привозит лучшие 
            гаджеты со всего мира, обеспечивая локальную поддержку и безупречный сервис.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {advantages.map((item) => (
            <div key={item.title} className="p-7 bg-[var(--bg-base)] rounded-2xl hover:shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)] transition-all duration-300 group cursor-default">
              <item.icon className={`${item.color} mb-5`} size={28} />
              <h4 className="text-[var(--text-primary)] font-black uppercase text-sm mb-2">{item.title}</h4>
              <p className="text-[var(--text-muted)] text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
