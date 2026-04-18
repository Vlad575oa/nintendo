import { Metadata } from "next";
import { Truck, CreditCard, ShieldCheck, Zap, Globe, PackageCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Доставка и Оплата | Nintendo Shop Premium Service",
  description: "Узнайте о способах экспресс-доставки и безопасных методах оплаты в Nintendo Shop. Доставка от 2 часов по Москве, отправка по всей России.",
  alternates: { canonical: "/info/delivery" },
};

export default function DeliveryPage() {
  return (
    <div className="bg-white dark:bg-black min-h-screen pt-12 pb-24 transition-colors">
      <div className="container">
        
        {/* Phase 4A: Magnetic Header */}
        <header className="mb-20 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-accent/10 text-accent rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
              Logistics & Finance
            </span>
            <div className="h-[1px] w-12 bg-neutral-100 dark:bg-white/10" />
            <span className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Safe & Fast
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-secondary dark:text-white leading-[0.95] tracking-tighter uppercase italic mb-8">
            Бесшовная доставка<br /> 
            <span className="text-primary not-italic">честная оплата</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed max-w-2xl">
            Мы понимаем, что ожидание новой игры — самое трудное. Поэтому мы построили логистику, которая обгоняет ваши ожидания.
          </p>
        </header>

        {/* Phase 4B: Key Takeaways Grid */}
        <section className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-neutral-50 dark:bg-neutral-900 rounded-[40px] border border-transparent dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Zap size={80} />
                    </div>
                    <h3 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight mb-4">Экспресс МСК</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed font-medium">
                        Доставка собственной курьерской службой в течение 2-4 часов после подтверждения заказа.
                    </p>
                </div>
                <div className="p-8 bg-neutral-50 dark:bg-neutral-900 rounded-[40px] border border-transparent dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Globe size={80} />
                    </div>
                    <h3 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight mb-4">Вся Россия</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed font-medium">
                        Отправка СДЭК или Почтой России в день заказа. Страховка 100% стоимости посылки за наш счет.
                    </p>
                </div>
                <div className="p-8 bg-neutral-50 dark:bg-neutral-900 rounded-[40px] border border-transparent dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <CreditCard size={80} />
                    </div>
                    <h3 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight mb-4">Безопасно</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed font-medium">
                        Оплата картой онлайн, через СБП или наличными при получении. Все транзакции защищены.
                    </p>
                </div>
            </div>
        </section>

        {/* Detailed Logic - Visual Rhythm */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Delivery Details */}
            <article>
                <div className="flex items-center gap-3 mb-8">
                    <Truck className="text-primary" size={24} />
                    <h2 className="text-2xl font-black text-secondary dark:text-white uppercase tracking-tight">Как мы доставляем</h2>
                </div>
                <div className="space-y-12">
                    <div className="relative pl-8 border-l-2 border-primary/20">
                        <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-black" />
                        <h4 className="text-lg font-black text-secondary dark:text-white mb-2 uppercase italic">Москва и МО</h4>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                            Наши курьеры — это эксперты Nintendo. Они не только привезут товар, но и помогут проверить комплектность. 
                            <br /><strong className="text-primary italic">Стоимость: 500₽ (бесплатно при заказе от 20 000₽)</strong>
                        </p>
                    </div>
                    <div className="relative pl-8 border-l-2 border-primary/20">
                        <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-neutral-300 dark:bg-neutral-700 border-4 border-white dark:border-black" />
                        <h4 className="text-lg font-black text-secondary dark:text-white mb-2 uppercase italic">Регионы РФ</h4>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                            Используем только надежные тарифы СДЭК с пометкой "Хрупкое". Вы получите трек-номер сразу после передачи в службу доставки.
                        </p>
                    </div>
                    
                    {/* Elite Element: Pro Tip */}
                    <div className="p-6 bg-accent/5 rounded-2xl border border-accent/10 flex items-start gap-4">
                        <Zap className="text-accent shrink-0" size={20} />
                        <div>
                            <p className="text-accent font-black text-[10px] uppercase tracking-widest mb-1">Elite Pro Tip</p>
                            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed font-bold">
                                При получении в пунктах СДЭК обязательно вскройте посылку до подписания акта приемки. Наша страховка покрывает любые повреждения при транспортировке.
                            </p>
                        </div>
                    </div>
                </div>
            </article>

            {/* Payment Details */}
            <article>
                <div className="flex items-center gap-3 mb-8">
                    <PackageCheck className="text-primary" size={24} />
                    <h2 className="text-2xl font-black text-secondary dark:text-white uppercase tracking-tight">Методы оплаты</h2>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-900 p-10 rounded-[48px] border border-neutral-100 dark:border-white/5">
                    <div className="space-y-8">
                        {[
                            { name: "Оплата онлайн", desc: "Все виды банковских карт + СБП через защищенный шлюз" },
                            { name: "Наличными курьеру", desc: "Доступно только для Москвы и Московской области" },
                            { name: "Оплата по счету", desc: "Для юридических лиц (предоставляем полный пакет закрывающих документов)" }
                        ].map((method, idx) => (
                            <div key={idx} className="flex gap-6">
                                <div className="text-primary font-black text-xl italic opacity-30 leading-none">0{idx+1}</div>
                                <div>
                                    <h5 className="text-sm font-black text-secondary dark:text-white uppercase mb-1">{method.name}</h5>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{method.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </article>
        </div>

        {/* Final CTA Integration */}
        <div className="mt-24 p-12 bg-neutral-950 rounded-[48px] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden flex flex-wrap gap-4 p-4">
                {Array.from({ length: 20 }).map((_, i) => (
                    <CreditCard key={i} size={40} className="text-white" />
                ))}
            </div>
            <div className="relative z-10">
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Остались вопросы по логистике?</h3>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-8">Мы на связи в Telegram 24 часа в сутки</p>
                <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Написать эксперту
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
