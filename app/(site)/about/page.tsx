import { Metadata } from "next";
import {
  Gamepad2, Users, ShieldCheck, Truck,
  Star, Zap, Heart, Trophy, ArrowRight
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О компании | Nintendo Shop",
  description: "Nintendo Shop — магазин для тех, кто живёт играми. Основан в 2017 году командой геймеров. Только оригинальная техника, гарантия и поддержка 24/7.",
  alternates: { canonical: "/about" },
};

const stats = [
  { value: "7+", label: "лет на рынке", icon: Trophy },
  { value: "12 000+", label: "довольных клиентов", icon: Users },
  { value: "4.9", label: "рейтинг на Яндексе", icon: Star },
  { value: "24/7", label: "поддержка", icon: Zap },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Только оригинал",
    desc: "Мы не торгуем репликами и «серыми» поставками. Каждая консоль — прямо из официальных каналов дистрибуции, с заводскими пломбами и документами.",
  },
  {
    icon: Heart,
    title: "Геймеры для геймеров",
    desc: "Наша команда сама играет. Мы знаем, что значит ждать релиза, радоваться распаковке и злиться на дрейф стика Joy-Con. Поэтому говорим с вами на одном языке.",
  },
  {
    icon: Truck,
    title: "Скорость — это уважение",
    desc: "Заказ до 14:00 — сегодня у вас дома. Мы не оставляем посылки «на складе до выяснения». Каждый заказ отслеживается, и вы всегда знаете, где ваша консоль.",
  },
  {
    icon: Users,
    title: "Поддержка, которая помогает",
    desc: "Не скрипты и не автоответы. Живые люди, которые решают проблему, а не перекладывают её. Средний ответ — 15 минут. Потому что так должно быть.",
  },
];

const timeline = [
  {
    year: "2017",
    title: "Начало",
    desc: "Максим и Денис — два друга-геймера — устали ждать официальных поставок Nintendo и решили привозить консоли сами. Первые 10 Switch продали за 3 дня через группу ВКонтакте.",
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
    desc: "Добавили PlayStation 5 Pro и расширили линейку аксессуаров. Открыли сервисный центр для гарантийного обслуживания — теперь не нужно искать мастера на стороне.",
  },
  {
    year: "2025",
    title: "Nintendo Switch 2",
    desc: "Одними из первых в России привезли Nintendo Switch 2. 200 предзаказов за первые сутки. Комьюнити выросло до 12 000 постоянных клиентов.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen pt-6 pb-28">
      <div className="container max-w-5xl">

        {/* Hero */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 rounded-full text-primary text-[11px] font-black uppercase tracking-[0.2em] mb-8">
            <Gamepad2 size={14} />
            О компании
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-secondary leading-[0.9] uppercase mb-6">
                Живём<br />
                <span className="text-primary">играми</span><br />
                с 2017
              </h1>
              <p className="text-lg text-neutral-400 font-bold leading-relaxed">
                Nintendo Shop начинался с двух друзей и десяти консолей. Сегодня — это команда из 15 человек, собственный сервисный центр и 12 000 геймеров, которым мы не подвели.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-neutral-50 rounded-[24px] p-6 border border-neutral-100">
                    <Icon size={20} className="text-primary mb-3" />
                    <p className="text-3xl font-black text-secondary leading-none mb-1">{s.value}</p>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="mb-20">
          <div className="bg-secondary rounded-[40px] p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Наша история</p>
              <p className="text-2xl md:text-3xl font-black text-white leading-snug mb-6">
                «Мы не хотели быть просто магазином. Мы хотели быть местом, где геймеры чувствуют себя своими.»
              </p>
              <p className="text-neutral-400 font-bold leading-relaxed">
                В 2017 году официальных поставок Nintendo в Россию почти не было. Максим и Денис — студенты, фанаты Mario и Zelda — решили исправить это сами. Они скинулись на первую партию Switch, продали всё за три дня и поняли: это работает.
              </p>
              <p className="text-neutral-400 font-bold leading-relaxed mt-4">
                Сегодня Nintendo Shop — это не просто магазин. Это сообщество людей, которые понимают, что такое «ещё одна попытка» в 3 ночи и почему новый релиз важнее любого совещания. Мы продаём не железо — мы продаём впечатления.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tighter mb-10">
            Как мы росли
          </h2>
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[26px] top-0 bottom-0 w-px bg-neutral-100 hidden sm:block" />
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <div key={item.year} className="sm:pl-16 relative">
                  <div className="hidden sm:flex absolute left-0 top-1 w-[52px] h-[52px] rounded-full bg-white border-2 border-neutral-100 items-center justify-center">
                    <span className="text-[10px] font-black text-primary">{item.year}</span>
                  </div>
                  <div className="bg-neutral-50 rounded-[24px] p-7 border border-neutral-100 hover:border-primary/20 hover:shadow-lg hover:shadow-neutral-200/40 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="sm:hidden text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full">{item.year}</span>
                      <h3 className="font-black text-secondary">{item.title}</h3>
                    </div>
                    <p className="text-sm text-neutral-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tighter mb-8">
            Наши принципы
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="group bg-neutral-50 rounded-[28px] p-8 border border-transparent hover:bg-white hover:border-neutral-100 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-[16px] bg-white shadow-sm group-hover:bg-primary group-hover:shadow-xl group-hover:shadow-primary/30 flex items-center justify-center mb-6 transition-all duration-300">
                    <Icon size={20} className="text-neutral-300 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-black text-secondary text-lg mb-3">{v.title}</h3>
                  <p className="text-sm text-neutral-500 font-medium leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-neutral-50 rounded-[32px] p-10 flex flex-col sm:flex-row items-center justify-between gap-8 border border-neutral-100">
          <div>
            <h3 className="text-2xl font-black text-secondary mb-2">Готовы к покупке?</h3>
            <p className="text-neutral-400 font-bold">Перейдите в каталог или напишите — поможем выбрать.</p>
          </div>
          <div className="flex gap-4 shrink-0">
            <Link
              href="/catalog/consoles"
              className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              Каталог
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contacts"
              className="px-8 py-4 bg-white border border-neutral-200 text-secondary rounded-2xl font-black uppercase tracking-widest text-sm hover:border-primary/30 hover:shadow-lg transition-all"
            >
              Контакты
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
