"use client";

import { Trophy, Users, Star, Zap, Gamepad2, ShieldCheck, Truck, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { value: "7+", label: "лет на рынке", icon: Trophy, color: "text-primary bg-primary/5" },
  { value: "12k+", label: "клиентов", icon: Users, color: "text-primary bg-primary/5" },
  { value: "4.9", label: "рейтинг", icon: Star, color: "text-primary bg-primary/10" },
  { value: "24/7", label: "поддержка", icon: Zap, color: "text-orange-500 bg-orange-500/10" },
  { value: "100%", label: "оригинал", icon: ShieldCheck, color: "text-green-600 bg-green-600/10" },
  { value: "1 год", label: "гарантия", icon: Award, color: "text-blue-500 bg-blue-500/10" },
  { value: "РФ", label: "доставка", icon: Truck, color: "text-primary bg-primary/5" },
];

const timeline = [
  {
    year: "2017",
    title: "Начало",
    desc: "Руслан и Сергей — два друга-геймера — устали ждать официальных поставок Nintendo и решили привозить консоли сами. Первые 10 Switch продали за 3 дня через группу ВКонтакте.",
  },
  {
    year: "2019",
    title: "Первый шоурум",
    desc: "Открылась точка самовывоза в Митино. Клиенты могли прийти, подержать консоль в руках и уйти с покупкой. В очереди стояли до 20 человек в выходной день.",
  },
  {
    year: "2021",
    title: "Сайт и масштаб",
    desc: "Запустили интернет-магазин с доставкой по всей России. Подключили СДЭК и собственную курьерскую службу. Перевалили за 3 000 выполненных заказов.",
  },
  {
    year: "2023",
    title: "PS5 Pro в ассортименте",
    desc: "Добавили PlayStation 5 Pro и расширили линейку аксессуаров. Открыли сервисный центр для гарантийного обслуживания.",
  },
  {
    year: "2025",
    title: "Nintendo Switch 2",
    desc: "Одними из первых в России привезли Nintendo Switch 2. 200 предзаказов за первые сутки. Комьюнити выросло до 12 000 постоянных клиентов.",
  },
];

export const AboutSection = () => {
  return (
    <section id="why-us" className="mb-20 scroll-mt-24">
      <div className="bg-white rounded-[48px] p-8 md:p-16 border border-neutral-100 shadow-2xl shadow-neutral-200/40 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        {/* Top Ribbon */}
        <div className="flex flex-wrap items-center gap-4 mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <Gamepad2 size={12} />
            Наша история
          </div>
          
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-neutral-50 rounded-full border border-neutral-100/50">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all hover:scale-105", s.color)}>
                  <Icon size={12} />
                  <span className="text-[10px] font-black tracking-tight">{s.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10">
          {/* Story Text */}
          <div>
            <h2 className="text-[clamp(1.75rem,5vw,3.5rem)] font-black tracking-tighter text-secondary leading-[0.85] uppercase mb-8">
              Живём <span className="text-secondary italic">играми</span> с <span className="text-primary italic">2017</span> года
            </h2>
            
            <div className="space-y-6 max-w-xl">
              <p className="text-xl font-black text-secondary leading-snug">
                «Мы не торговали репликами тогда и не делаем этого сейчас. Только оригинал, только хардкор.»
              </p>
              <p className="text-neutral-500 font-bold leading-relaxed">
                Nintendo Shop начинался с двух друзей и десяти консолей. Сегодня — это команда из 15 профессиональных геймеров, собственный авторизованный сервис и более 12 000 клиентов по всей РФ.
              </p>
              <p className="text-neutral-400 font-bold leading-relaxed text-sm">
                Мы прошли путь от маленькой группы в VK до экспертов, которые знают о Joy-Con и дрейфе стиков всё. Мы не просто продаем — мы создаем сообщество единомышленников.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-xl font-black text-secondary uppercase tracking-widest mb-10 text-right md:text-left">
              Этапы роста
            </h3>
            <div className="relative space-y-8">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-neutral-100" />
              {timeline.map((item) => (
                <div key={item.year} className="relative pl-14">
                  <div className="absolute left-0 top-1 w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm z-10">
                    <span className="text-[10px] font-black text-primary">{item.year}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-secondary uppercase tracking-tight mb-1 text-sm">{item.title}</h4>
                    <p className="text-xs text-neutral-400 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
