import { Metadata } from "next";
import {
  Gamepad2, Users, ShieldCheck, Truck,
  Star, Zap, Heart, Trophy, ArrowRight, Quote
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О компании | Nintendo Shop — эксперты в мире гейминга",
  description: "Nintendo Shop — это история двух геймеров, ставшая крупнейшим магазином консолей в СНГ. Только оригинал, собственный сервис и поддержка 24/7.",
  alternates: { canonical: "/about" },
};

const stats = [
  { value: "9 лет", label: "на рынке", icon: Trophy },
  { value: "15k+", label: "клиентов", icon: Users },
  { value: "4.9/5", label: "рейтинг", icon: Star },
  { value: "24/7", label: "поддержка", icon: Zap },
];

const timeline = [
  { year: "2017", title: "Зарождение", desc: "Два друга, 10 консолей и дикое желание привезти легальную Nintendo Switch в Россию. Продали всё за 72 часа." },
  { year: "2019", title: "Точка сборки", desc: "Открытие флагманского шоурума в Митино. Мы стали местом, куда можно зайти просто поговорить о Zelda." },
  { year: "2021", title: "Масштаб", desc: "Запуск федеральной доставки. Наша логистика теперь покрывает 11 часовых поясов. 5000+ заказов в год." },
  { year: "2024", title: "Сервис-центр", desc: "Запустили собственный VIP-сервис. Теперь мы не только продаем, но и полностью обслуживаем ваши консоли." },
  { year: "2026", title: "Эра Switch 2", desc: "Стали лидерами по предзаказам консолей нового поколения. Комьюнити Nintendo Shop — это семья из 15 000 человек." }
];

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-black min-h-screen pt-12 pb-28 transition-colors">
      <div className="container">
        
        {/* Phase 4A: Magnetic Header */}
        <header className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em] animate-in slide-in-from-left duration-500">
              Our Journey
            </span>
            <div className="h-[1px] w-12 bg-neutral-100 dark:bg-white/10" />
            <span className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Since 2017
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
                <h1 className="text-5xl md:text-8xl font-black text-secondary dark:text-white leading-[0.9] tracking-tighter uppercase italic mb-8">
                    Превращаем игры<br /> 
                    <span className="text-primary not-italic">в искусство жизни</span>
                </h1>
                <p className="text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed max-w-3xl">
                    Nintendo Shop — это не просто ритейл. Это история о том, как страсть двух друзей к восьмибитным мирам выросла в крупнейшее экспертное сообщество геймеров в СНГ.
                </p>
            </div>
            <div className="lg:col-span-4 hidden lg:flex justify-end">
                 <div className="w-40 h-40 bg-primary rounded-full flex items-center justify-center -rotate-12 shadow-2xl shadow-primary/30">
                    <span className="text-white font-black text-4xl uppercase leading-none text-center">9 лет<br/><span className="text-xs">в игре</span></span>
                 </div>
            </div>
          </div>
        </header>

        {/* Phase 4B: Stats Grid (Key Takeaways) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
            {stats.map((s, i) => (
                <div key={i} className="p-8 bg-neutral-50 dark:bg-neutral-900 rounded-[40px] border border-transparent dark:border-white/5 group hover:border-primary/20 transition-all">
                    <s.icon className="text-primary mb-6 transition-transform group-hover:scale-110" size={24} />
                    <p className="text-4xl md:text-5xl font-black text-secondary dark:text-white leading-none mb-3 italic tracking-tighter">{s.value}</p>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{s.label}</p>
                </div>
            ))}
        </section>

        {/* Founders Quote - Visual Rhythm */}
        <section className="mb-32 relative">
            <div className="absolute -top-10 -left-10 text-primary opacity-10 pointer-events-none">
                <Quote size={200} />
            </div>
            <div className="bg-secondary rounded-[64px] p-12 md:p-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-4xl">
                    <p className="text-3xl md:text-5xl font-black text-white leading-tight mb-10 tracking-tight italic">
                        «Мы создали место, где геймеру не нужно ничего объяснять. Мы понимаем восторг от первого включения и боль от дрифта стиков — потому что мы сами такие же.»
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-black italic">M&D</div>
                        <div>
                            <p className="text-white font-black uppercase text-sm tracking-widest">Максим и Денис</p>
                            <p className="text-primary text-[10px] font-black uppercase tracking-widest">Основатели Nintendo Shop</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Interactive Timeline */}
        <section className="mb-32">
            <h2 className="text-4xl font-black text-secondary dark:text-white uppercase italic tracking-tighter mb-16">Наш путь роста</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {timeline.map((item, i) => (
                    <div key={i} className="flex flex-col gap-6">
                        <div className="text-5xl font-black text-primary/20 italic leading-none">{item.year}</div>
                        <div className="w-full h-[1px] bg-neutral-100 dark:bg-white/10 relative">
                            <div className="absolute top-[-3px] left-0 w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-secondary dark:text-white uppercase mb-3 tracking-wide">{item.title}</h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Pro Tip - Expert Layer */}
        <div className="mb-32 p-8 bg-primary/5 border border-primary/10 rounded-[40px] flex flex-col md:flex-row items-center gap-10">
            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shrink-0">
                <Zap className="text-white" size={32} />
            </div>
            <div>
                <p className="text-primary font-black text-[10px] uppercase tracking-widest mb-2">Elite Insider Tip</p>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed font-bold italic">
                    За 9 лет через наши руки прошли тысячи консолей. Если вы только начинаете — не гонитесь за самыми дорогими моделями. Напишите нам, расскажите во что хотите играть, и мы подберем идеальный сетап, который сэкономит вам до 30% бюджета без потери качества опыта.
                </p>
            </div>
        </div>

        {/* CTA */}
        <div className="p-12 bg-neutral-900 rounded-[56px] text-center relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-[0.1em] mb-4">Станьте частью комьюнити</h2>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-10">Там, где игры становятся жизнью</p>
            <div className="flex flex-wrap justify-center gap-4">
                <Link href="/catalog/consoles" className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20">
                    В каталог
                </Link>
                <Link href="/blog" className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">
                    Читать блог
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
