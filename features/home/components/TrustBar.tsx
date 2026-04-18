"use client";

import { CheckCircle2, ShieldCheck, Zap, Truck } from "lucide-react";

const stats = [
  { icon: ShieldCheck, label: "Гарантия", sub: "Официальная 1 год" },
  { icon: Truck, label: "Доставка", sub: "За 2 часа по МСК" },
  { icon: Zap, label: "Сервис", sub: "Любые консультации" },
  { icon: CheckCircle2, label: "Оригинал", sub: "100% аутентичность" },
];

export const TrustBar = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
      {stats.map((item, idx) => (
        <div 
          key={idx}
          className="neu-raised p-6 flex items-center gap-4 hover:shadow-[8px_8px_20px_var(--shadow-dark),-8px_-8px_20px_var(--shadow-light)] transition-all duration-300 group cursor-default"
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-base)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-primary transition-colors">
            <item.icon size={22} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)] leading-none mb-1.5">
              {item.label}
            </p>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              {item.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
