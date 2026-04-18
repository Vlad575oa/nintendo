import { Metadata } from "next";
import { 
  ShieldCheck, RotateCcw, Wrench, XCircle, CheckCircle2, 
  Package, Clock, MessageSquare, AlertTriangle, HeartHandshake, Zap
} from "lucide-react";

export const metadata: Metadata = {
  title: "Гарантия и Возврат | Бескомпромиссная поддержка Nintendo Shop",
  description: "Гарантия 12 месяцев от собственного сервис-центра. Возврат без бюрократии за 14 дней. Мы стоим за качество каждого устройства.",
  alternates: { canonical: "/info/guarantee" },
};

const guarantees = [
  {
    icon: ShieldCheck,
    label: "Консоли",
    period: "12 месяцев",
    desc: "Полное покрытие аппаратной части. Заводской брак? Заменим на новую или отремонтируем в собственном VIP-сервисе.",
    accent: true,
  },
  {
    icon: Zap,
    label: "Аксессуары",
    period: "6 месяцев",
    desc: "Контроллеры, стики и зарядные станции. Быстрая диагностика и замена без лишних вопросов.",
    accent: false,
  },
  {
    icon: CheckCircle2,
    label: "Игры & Диски",
    period: "При получении",
    desc: "100% гарантия читаемости. Если диск поврежден при доставке — замена за наш счет в тот же день.",
    accent: false,
  },
];

export default function GuaranteePage() {
  return (
    <div className="bg-white dark:bg-black min-h-screen pt-12 pb-24 transition-colors">
      <div className="container">
        
        {/* Phase 4A: Magnetic Header */}
        <header className="mb-20 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em] animate-in slide-in-from-left duration-500">
              Protection Shield
            </span>
            <div className="h-[1px] w-12 bg-neutral-100 dark:bg-white/10" />
            <span className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Zero Bureaucracy
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-secondary dark:text-white leading-[0.95] tracking-tighter uppercase italic mb-8">
            Ваша уверенность — <br /> 
            <span className="text-primary not-italic">наш приоритет</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed max-w-2xl">
            Мы не просто продаем коробки. Мы обеспечиваем непрерывный гейминг. Наша гарантия — это обещание поддержки, которое мы держим с 2012 года.
          </p>
        </header>

        {/* Phase 4B: Guarantee Cards with Visual Rhythm */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {guarantees.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.label}
                className={`rounded-[40px] p-8 flex flex-col gap-6 transition-all duration-500 hover:-translate-y-2 ${
                  g.accent ? "bg-secondary shadow-2xl shadow-secondary/20" : "bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-white/5"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${g.accent ? "bg-primary text-white" : "bg-white dark:bg-white/5 shadow-sm text-primary"}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className={`text-xl font-black uppercase tracking-tight ${g.accent ? "text-white" : "text-secondary dark:text-white"}`}>{g.label}</h3>
                  <p className={`text-3xl font-black mt-1 italic ${g.accent ? "text-primary" : "text-primary dark:text-primary"}`}>{g.period}</p>
                </div>
                <p className={`text-sm font-medium leading-relaxed ${g.accent ? "text-white/60" : "text-neutral-500 dark:text-neutral-400"}`}>
                  {g.desc}
                </p>
              </div>
            );
          })}
        </section>

        {/* Covered vs Not Covered - Comparison Table Logic */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
            <div className="p-10 bg-green-50/30 dark:bg-green-500/5 rounded-[48px] border border-green-100 dark:border-green-500/10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 size={20} className="text-green-600 dark:text-green-500" />
                    </div>
                    <h3 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight">Всегда исправляем</h3>
                </div>
                <ul className="space-y-4">
                    {[
                        "Заводские дефекты экранов, кнопок и портов",
                        "Программные сбои оригинальной прошивки",
                        "Неисправности аккумулятора",
                        "Дрифт стиков (первые 6 месяцев)"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-sm font-bold text-neutral-600 dark:text-neutral-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-10 bg-red-50/30 dark:bg-red-500/5 rounded-[48px] border border-red-100 dark:border-red-500/10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                        <XCircle size={20} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight">Не гарантийный случай</h3>
                </div>
                <ul className="space-y-4">
                    {[
                        "Механические повреждения от падений",
                        "Попадание влаги или насекомых",
                        "Следы неквалифицированного вскрытия",
                        "Использование неофициального ПО"
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-sm font-bold text-neutral-600 dark:text-neutral-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-50" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </section>

        {/* Elite Pro Tip: User Care */}
        <div className="mb-24 p-8 bg-neutral-900 border border-white/5 rounded-[40px] flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-2xl shadow-primary/20">
                <HeartHandshake size={48} className="text-white" />
            </div>
            <div>
                <h4 className="text-white font-black uppercase text-sm mb-2 tracking-widest">Совет от команды сервиса:</h4>
                <p className="text-white/40 text-sm leading-relaxed max-w-3xl">
                    Сохраняйте оригинальную упаковку и чек в течение всего гарантийного срока. Это ускоряет процесс возврата или обмена в 3 раза, так как мы сможем мгновенно идентифицировать и упаковать ваше устройство для отправки вендору. 
                    <br /><strong className="text-primary italic">Pro Tip: Если у вас Switch — используйте защитное стекло с первого дня. Механические царапины на тачскрине не являются гарантийным случаем, но сильно влияют на ликвидность гаджета.</strong>
                </p>
            </div>
        </div>

        {/* CTA */}
        <div className="p-12 bg-secondary rounded-[48px] text-center md:text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
                <RotateCcw size={150} className="text-white" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-3">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Нужен возврат или ремонт?</h3>
                    <p className="text-neutral-400 font-bold max-w-md">Напишите в Telegram — мы согласуем приезд курьера за 5 минут.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        Telegram Support
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
