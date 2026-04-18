import { Metadata } from "next";
import { 
  ShieldCheck, RotateCcw, Wrench, XCircle, CheckCircle2, 
  Package, Clock, MessageSquare, AlertTriangle, HeartHandshake, Zap, ShieldAlert
} from "lucide-react";

export const metadata: Metadata = {
  title: "Гарантия 360° | Nintendo Shop — Ваша безупречная защита",
  description: "Узнайте почему наша гарантия — самая надежная в РФ. 12 месяцев на весь ассортимент, собственный сервис и возврат без бюрократии. Играйте спокойно.",
  alternates: { canonical: "/info/guarantee" },
};

export default function GuaranteePage() {
  const guaranteeSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Nintendo Shop Warranty",
    "description": "12-месячная гарантия на игровые консоли и 6-месячная гарантия на аксессуары с обслуживанием в собственном сервисном центре.",
    "provider": {
      "@type": "Organization",
      "name": "Nintendo Shop"
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-24 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guaranteeSchema) }}
      />
      <div className="container relative z-10">
        
        {/* Phase 4A: Magnetic Header (Psychological Trigger: Absolute Security) */}
        <header className="mb-20 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em] animate-in slide-in-from-left duration-500">
              Elite Protection
            </span>
            <div className="h-[1px] w-12 bg-neutral-100 dark:bg-white/10" />
            <span className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Zero Risk Policy
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-secondary dark:text-white leading-[0.9] tracking-tighter uppercase italic mb-8">
            Защита 360°:<br /> 
            <span className="text-primary not-italic">никакой бюрократии</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed max-w-2xl">
            Покупка консоли — это инвестиция в ваши эмоции. Мы защищаем эту инвестицию железной гарантией и собственным сервисным центром, который решит любой вопрос быстрее, чем вы пройдете первый уровень.
          </p>
        </header>

        {/* Phase 4B: Key Takeaways - Grid of Truth */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {[
                { label: "Консоли", period: "12 месяцев", desc: "Абпаратная поддержка всех систем. Заводской брак? Мгновенная замена или ремонт.", icon: ShieldCheck, accent: true },
                { label: "Джойконы", period: "6 месяцев", desc: "Единственные в РФ, кто дает реальную гарантию на дрифт стиков и кнопки.", icon: Zap, accent: false },
                { label: "Возврат", period: "14 дней", desc: "Не подошел цвет или просто передумали? Вернем деньги без лишних вопросов.", icon: RotateCcw, accent: false }
            ].map((g, i) => (
                <div key={i} className={`rounded-[48px] p-10 flex flex-col gap-6 transition-all duration-500 hover:-translate-y-2 backdrop-blur-md border ${g.accent ? "bg-primary/5 border-primary/20 shadow-2xl shadow-primary/10" : "bg-white/40 dark:bg-white/[0.03] border-neutral-100 dark:border-white/10 shadow-xl shadow-black/5"}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${g.accent ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                        <g.icon size={26} />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase tracking-tight text-secondary dark:text-white`}>{g.label}</h3>
                        <p className={`text-4xl font-black mt-1 italic leading-none text-primary`}>{g.period}</p>
                    </div>
                    <p className={`text-[13px] font-medium leading-relaxed text-neutral-500 dark:text-neutral-400`}>{g.desc}</p>
                </div>
            ))}
        </section>

        {/* Phase 4B: Visual Rhythm - Comparison Table */}
        <section className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-green-500/5 p-12 rounded-[56px] border border-green-500/10 backdrop-blur-sm">
                <h3 className="text-xl font-black text-secondary dark:text-white uppercase italic mb-8 flex items-center gap-3">
                    <CheckCircle2 className="text-green-600" /> Наше покрытие
                </h3>
                <ul className="space-y-6">
                    {[
                        "Заводские дефекты экранов и матриц (битые пиксели)",
                        "Неисправности портов зарядки и картридеров",
                        "Проблемы с Wi-Fi или Bluetooth модулями",
                        "Выход из строя материнской платы"
                    ].map((item, i) => (
                        <li key={i} className="flex gap-4 text-sm font-bold text-neutral-600 dark:text-neutral-400 leading-snug">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-red-500/5 p-12 rounded-[56px] border border-red-500/10 backdrop-blur-sm">
                <h3 className="text-xl font-black text-secondary dark:text-white uppercase italic mb-8 flex items-center gap-3">
                    <ShieldAlert className="text-red-500" /> Не считается гарантией
                </h3>
                <ul className="space-y-6">
                    {[
                        "Механические повреждения (сколы, трещины корпуса)",
                        "Следы попадания жидкости или липких субстанций",
                        "Самостоятельный разбор или 'прошивка' консоли",
                        "Естественный износ аккумулятора через 1.5-2 года"
                    ].map((item, i) => (
                        <li key={i} className="flex gap-4 text-sm font-bold text-neutral-600 dark:text-neutral-400 leading-snug">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0 opacity-50" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </section>

        {/* Elite Engagement: Pro Tip */}
        <div className="mb-24 p-8 bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[48px] flex flex-col md:flex-row items-center gap-10 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-2xl shadow-primary/30 relative z-10">
                <Wrench size={40} className="text-white" />
            </div>
            <div className="relative z-10">
                <h4 className="text-secondary dark:text-white font-black uppercase text-sm mb-2 tracking-widest">Профессиональный совет:</h4>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-3xl font-medium italic">
                    «Многие магазины отправляют товар на диагностику дистрибьютору, что занимает до 45 дней. В Nintendo Shop мы проводим первичный осмотр за 20 минут в вашем присутствии. <strong className="text-primary">Tip:</strong> Если консоль зависла — не паникуйте, просто зажмите кнопку Power на 15 секунд для жесткой перезагрузки. 90% обращений решаются этим простым действием».
                </p>
            </div>
        </div>

        {/* Action Block - PAS (Solution) */}
        <div className="bg-primary p-12 md:p-20 rounded-[64px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-20 opacity-10 group-hover:rotate-12 transition-transform">
                <HeartHandshake size={300} className="text-white" />
            </div>
            <div className="relative z-10 text-center md:text-left">
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-6">Готовы играть без забот?</h2>
                <p className="text-white/80 text-lg md:text-xl font-bold max-w-xl mb-12">
                     Мы обеспечиваем сервисное обслуживание даже после окончания официальной гарантии. Гейминг с нами — это навсегда.
                </p>
                <button className="px-12 py-6 bg-secondary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-secondary/40 hover:scale-105 active:scale-95 transition-all">
                    Написать в техподдержку
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
