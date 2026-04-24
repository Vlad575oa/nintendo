import { Metadata } from "next";
import {
  Gamepad2, Users, ShieldCheck, Truck,
  Star, Zap, Heart, Trophy, ArrowRight, Award
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "О компании | Gameshop24",
  description: "Gameshop24 — магазин для тех, кто живёт играми. Основан в 2017 году командой геймеров. Только оригинальная техника, гарантия и поддержка 24/7.",
  alternates: { canonical: "/about" },
};

const stats = [
  { value: "7+", label: "лет на рынке", icon: Trophy, color: "text-primary bg-primary/5" },
  { value: "12k+", label: "клиентов", icon: Users, color: "text-primary bg-primary/5" },
  { value: "4.9", label: "рейтинг", icon: Star, color: "text-primary bg-primary/10" },
  { value: "24/7", label: "поддержка", icon: Zap, color: "text-orange-500 bg-orange-500/10" },
  { value: "100%", label: "оригинал", icon: ShieldCheck, color: "text-green-600 bg-green-600/10" },
  { value: "1 год", label: "гарантия", icon: Award, color: "text-blue-500 bg-blue-500/10" },
  { value: "РФ", label: "доставка", icon: Truck, color: "text-primary bg-primary/5" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Только оригинал",
    desc: "Мы не торгуем репликами, «серыми» поставками или восстановленными устройствами под видом новых. Каждая консоль проходит трехэтапную проверку перед продажей: серийный номер, целостность пломб и комплектация. Мы работаем только с проверенными поставщиками.",
  },
  {
    icon: Heart,
    title: "Геймеры для геймеров",
    desc: "Gameshop24 — это не просто бизнес. Наша команда сама тестирует каждый аксессуар и играет в каждую новинку. Мы выпустили десятки гайдов по выбору консолей и защите экранов. Мы говорим с вами на одном языке, потому что сами горим тем же.",
  },
  {
    icon: Truck,
    title: "Скорость и Бережность",
    desc: "Ваш заказ не валяется на складе. Курьер забирает его сразу после сборки. Мы используем усиленную упаковку «в три слоя», чтобы коробка доехала до вас в идеальном коллекционном состоянии. По Москве доставляем день в день, по РФ — за 2-4 дня.",
  },
  {
    icon: Users,
    title: "Поддержка и Сервис",
    desc: "Проблема с дрейфом стика? Сложности с регионами в eShop? Мы не отправляем вас в Google. Наши эксперты по поддержке на связи в Telegram и по телефону, чтобы помочь делом. У нас есть свой сервисный центр — единственный в городе, который специализируется именно на Nintendo.",
  },
];

const timeline = [
  {
    year: "2017",
    title: "Эпоха ВКонтакте",
    desc: "Руслан и Сергей — два друга и фаната Zelda — решили привезти первые 10 консолей Nintendo Switch прямо из Европы. Первая партия разлетелась за 72 часа через группу в ВК. Мы поняли: живое комьюнити в России существует и оно огромно.",
  },
  {
    year: "2019",
    title: "Первый «Оффлайн»",
    desc: "Открыли шоурум в Митино. Тогда мы поняли, что геймерам важно пощупать консоль, сравнить экраны V1 и V2 вживую. В выходные дни очередь на консультации растягивалась на часы, и мы решили масштабироваться.",
  },
  {
    year: "2021",
    title: "Выход на Россию",
    desc: "Запустили полноценный интернет-магазин с автоматизированной логистикой по всей стране. Подключили СДЭК и собственную курьерскую службу. Число выполненных заказов перевалило за 3 000, а ассортимент пополнился редкими лимитированными изданиями.",
  },
  {
    year: "2023",
    title: "Сервис и PlayStation",
    desc: "Учитывая спрос, добавили PlayStation 5 Pro и расширили линейку аксессуаров. Но главное — открыли свой специализированный сервисный центр для постгарантийного обслуживания. Теперь мы закрываем весь цикл: от покупки до ремонта.",
  },
  {
    year: "2025",
    title: "Новая Эра",
    desc: "Встретили запуск Nintendo Switch 2 (Switch Successor). Более 200 предзаказов за первые сутки. Наше комьюнити выросло до 12 000 постоянных клиентов. Мы продолжаем привозить новинки одними из первых в стране, сохраняя адекватные цены.",
  },
];

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-12 pb-28">
      <div className="container max-w-6xl px-4 lg:px-8">

        {/* --- HERO SECTION: EDITORIAL REDESIGN --- */}
        <div className="mb-32">
          {/* Top Metadata */}
          <div className="flex items-center gap-4 mb-8">
             <div className="h-px w-12 bg-primary/30" />
             <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">История бренда</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <h1 className="text-[clamp(3.5rem,10vw,7rem)] font-black tracking-tighter text-secondary leading-[0.82] uppercase mb-10">
                Живём <span className="text-primary italic">играми</span><br />
                с <span className="text-neutral-200">2017</span> года
              </h1>
              
              <div className="max-w-xl space-y-6">
                <p className="text-xl md:text-2xl text-secondary font-black leading-[1.3] tracking-tight">
                  Gameshop24 начинался с двух друзей и десяти консолей, привезенных из Европы. Мы прошли путь от маленькой группы в VK до крупнейшего специализированного магазина в РФ.
                </p>
                <div className="h-px w-20 bg-neutral-100" />
                <p className="text-base text-neutral-500 font-bold leading-relaxed">
                  Сегодня — это команда из 15 профессиональных геймеров, собственный авторизованный сервисный центр и более 12 000 клиентов, которые доверяют нам свой досуг. Мы знаем о Switch всё — и делимся этими знаниями с вами.
                </p>
                
                {/* Stats row inside hero */}
                <div className="flex flex-wrap gap-8 pt-6">
                   {stats.slice(0, 3).map(s => (
                     <div key={s.label}>
                        <p className="text-2xl font-black text-secondary leading-none mb-1">{s.value}</p>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{s.label}</p>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Right: CINEMATIC IMAGE */}
            <div className="lg:col-span-5 pt-8">
               <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl shadow-neutral-200">
                  <Image 
                    src="/about_hero_cinematic.png" 
                    alt="Gameshop24 Heritage" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
               </div>
            </div>
          </div>
        </div>

        {/* --- IMMERSIVE STORY BLOCK --- */}
        <div className="mb-32 grayscale-hover">
          <div className="bg-[#1a1a1c] rounded-[64px] p-12 md:p-20 relative overflow-hidden group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block mb-6 px-1">Миссия и ценности</span>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.05] mb-10 max-w-2xl">
                  «Мы не хотели быть просто магазином. Мы строили место, где геймеры чувствуют себя дома.»
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <p className="text-neutral-400 text-sm font-bold leading-relaxed">
                    В 2017 году официальных поставок Nintendo в Россию почти не было. Руслан и Сергей — два друга и фаната Zelda — решили исправить это сами. Они продали первую партию за три дня и поняли главное: комьюнити жаждет качественного сервиса и живого общения.
                  </p>
                  <p className="text-neutral-400 text-sm font-bold leading-relaxed">
                    Сегодня Gameshop24 — это сообщество людей, которые понимают, почему новый релиз важнее любого совещания. Мы продаём не просто электронику, а входной билет в миры, которые меняют жизни. Мы геймеры, и это наш главный залог честности.
                  </p>
                </div>
              </div>
              
              <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
                 <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center text-primary animate-pulse">
                    <Heart size={32} fill="currentColor" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- TIMELINE: ARCHITECTURAL REDESIGN --- */}
        <div className="mb-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-black text-secondary uppercase tracking-tighter">Как мы росли</h2>
            <div className="hidden md:block text-[10px] font-black text-neutral-300 uppercase tracking-widest">2017 — 2025</div>
          </div>
          
          <div className="relative">
            {/* vertical track */}
            <div className="absolute left-[31px] top-6 bottom-6 w-px bg-neutral-100 hidden md:block" />
            
            <div className="space-y-4">
              {timeline.map((item, i) => (
                <div key={item.year} className="md:pl-20 relative group">
                  {/* Point */}
                  <div className="hidden md:flex absolute left-0 top-6 w-16 h-16 rounded-full bg-white border border-neutral-100 items-center justify-center z-10 transition-all duration-500 group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:scale-110">
                    <span className="text-[11px] font-black text-secondary group-hover:text-primary transition-colors">{item.year}</span>
                  </div>
                  
                  <div className="bg-white rounded-[32px] p-8 border border-neutral-100/60 hover:border-primary/20 hover:shadow-2xl hover:shadow-neutral-200/50 transition-all duration-500">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                       <span className="md:hidden text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full">{item.year}</span>
                       <h3 className="text-xl font-black text-secondary uppercase tracking-tight">{item.title}</h3>
                    </div>
                    <p className="text-neutral-500 font-medium leading-relaxed max-w-3xl">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- VALUES: PREMIUM GRID --- */}
        <div className="mb-32">
           <div className="max-w-2xl mb-12">
              <h2 className="text-4xl font-black text-secondary uppercase tracking-tighter mb-4">Наши принципы</h2>
              <p className="text-neutral-400 font-bold">Мы не просто магазин электроники. Мы — часть игрового наследия, и наши правила отражают это.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="group p-10 rounded-[40px] bg-white border border-neutral-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-neutral-200/40 transition-all duration-500 relative overflow-hidden">
                    {/* Hover Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                       <Icon size={24} className="text-neutral-300 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-secondary mb-4 uppercase tracking-tight">{v.title}</h3>
                    <p className="text-neutral-500 font-medium leading-relaxed">{v.desc}</p>
                  </div>
                )
              })}
           </div>
        </div>

        {/* --- FINAL CTA --- */}
        <div className="bg-secondary rounded-[56px] p-12 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 border border-secondary shadow-2xl shadow-neutral-900/10">
          <div className="max-w-md">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase leading-none">Готовы к новой главе?</h3>
            <p className="text-neutral-400 font-bold text-lg">Загляните в каталог или свяжитесь с нашими экспертами — мы поможем сделать правильный выбор.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
            <Link
              href="/catalog/all"
              className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
            >
              В каталог
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/contacts"
              className="flex-1 lg:flex-none flex items-center justify-center px-10 h-16 bg-white/[0.03] border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/[0.08] transition-all"
            >
              Связаться с нами
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
