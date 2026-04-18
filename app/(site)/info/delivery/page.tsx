import { Metadata } from "next";
import { Truck, CreditCard, ShieldCheck, Zap, Globe, PackageCheck, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Доставка и Оплата | Nintendo Shop Premium Logistics",
  description: "Получите вашу консоль сегодня! Экспресс-доставка за 2 часа по Москве. Честная оплата и надежная страховка груза. Узнайте больше.",
  alternates: { canonical: "/info/delivery" },
};

export default function DeliveryPage() {
  const deliverySchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Express Delivery",
    "provider": {
      "@type": "Organization",
      "name": "Nintendo Shop"
    },
    "areaServed": "RU",
    "description": "Экспресс-доставка игровых консолей и аксессуаров за 2-4 часа по Москве и области."
  };

  return (
    <div className="min-h-screen pt-12 pb-24 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(deliverySchema) }}
      />
      <div className="container relative z-10">
        
        {/* Phase 4A: Magnetic Header (Psychological Triggers: Speed & Peace of Mind) */}
        <header className="mb-20 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em] animate-in slide-in-from-left duration-500">
              Elite Logistics
            </span>
            <div className="h-[1px] w-12 bg-neutral-100 dark:bg-white/10" />
            <span className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Instant Joy
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-secondary dark:text-white leading-[0.9] tracking-tighter uppercase italic mb-8">
            Начните играть<br /> 
            <span className="text-primary not-italic">через 2 часа</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed max-w-3xl">
            Мы не просто доставляем коробки — мы сокращаем путь между вами и вашим новым приключением. Собственная курьерская служба работает быстрее, чем вы успеете пройти туториал.
          </p>
        </header>

        {/* Phase 4B: Visual Rhythm - Delivery Methods Comparison Table */}
        <section className="mb-24">
            <h2 className="text-2xl font-black text-secondary dark:text-white uppercase italic mb-8 flex items-center gap-3">
                <Info className="text-primary" /> Выберите свой темп
            </h2>
            <div className="overflow-x-auto rounded-[32px] border border-neutral-100 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-50/50 dark:bg-white/5">
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">Метод</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">Срок</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">Стоимость</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                        <tr className="hover:bg-primary/5 transition-colors">
                            <td className="p-6 font-black text-secondary dark:text-white text-sm uppercase">Экспресс (МСК)</td>
                            <td className="p-6 text-primary font-black text-sm italic">2-4 часа</td>
                            <td className="p-6 text-neutral-500 font-bold text-sm">500₽ / Бесплатно*</td>
                        </tr>
                        <tr className="hover:bg-primary/5 transition-colors">
                            <td className="p-6 font-black text-secondary dark:text-white text-sm uppercase">Стандарт (МО)</td>
                            <td className="p-6 text-neutral-600 dark:text-neutral-300 font-black text-sm">В день заказа</td>
                            <td className="p-6 text-neutral-500 font-bold text-sm">от 700₽</td>
                        </tr>
                        <tr className="hover:bg-primary/5 transition-colors">
                            <td className="p-6 font-black text-secondary dark:text-white text-sm uppercase">СДЭК (Регионы)</td>
                            <td className="p-6 text-neutral-600 dark:text-neutral-300 font-black text-sm">2-5 дней</td>
                            <td className="p-6 text-neutral-500 font-bold text-sm">По тарифу службы</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className="mt-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-4">
                * Бесплатная доставка по Москве при заказе от 30 000₽
            </p>
        </section>

        {/* Phase 4B: Engagement - Pro Tip Block */}
        <div className="mb-24 p-8 bg-primary/5 border border-primary/10 rounded-[40px] flex flex-col md:flex-row items-center gap-10 backdrop-blur-sm">
            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <Zap className="text-white" size={32} />
            </div>
            <div>
                <p className="text-primary font-black text-[10px] uppercase tracking-widest mb-2">Elite Insights</p>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed font-bold italic">
                    «Наши курьеры — это не просто доставщики, а технические специалисты. При получении вы можете вскрыть упаковку, включить консоль и проверить ее работоспособность прямо на месте. Мы приветствуем это, потому что уверены в своем товаре на 101%».
                </p>
            </div>
        </div>

        {/* Payment Methods - AIDA applied (Action) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-12 bg-white/40 dark:bg-white/[0.03] backdrop-blur-md rounded-[56px] border border-white/10 relative overflow-hidden group">
                <CreditCard className="absolute -top-6 -right-6 text-secondary/5 dark:text-white/5 group-hover:text-primary/10 transition-colors" size={180} />
                <h3 className="text-2xl font-black text-secondary dark:text-white uppercase italic tracking-tighter mb-6 relative z-10">Оплата онлайн</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-8 relative z-10 font-medium">
                    Принимаем все виды банковских карт, СБП и QR-коды. Все платежи проходят через зашифрованный банковский шлюз — ваши данные в безопасности.
                </p>
                <div className="flex gap-2 relative z-10">
                    <span className="px-3 py-1 bg-neutral-100 dark:bg-white/10 rounded-lg text-[9px] font-black text-neutral-500 dark:text-white/60">VISA</span>
                    <span className="px-3 py-1 bg-neutral-100 dark:bg-white/10 rounded-lg text-[9px] font-black text-neutral-500 dark:text-white/60">MASTERCARD</span>
                    <span className="px-3 py-1 bg-neutral-100 dark:bg-white/10 rounded-lg text-[9px] font-black text-neutral-500 dark:text-white/60">МИР</span>
                    <span className="px-3 py-1 bg-neutral-100 dark:bg-white/10 rounded-lg text-[9px] font-black text-neutral-500 dark:text-white/60">СБП</span>
                </div>
            </div>
            <div className="p-12 bg-white/40 dark:bg-white/[0.03] backdrop-blur-md rounded-[56px] border border-white/10 relative overflow-hidden group">
                <PackageCheck className="absolute -top-6 -right-6 text-secondary/5 dark:text-white/5 group-hover:text-primary/10 transition-colors" size={180} />
                <h3 className="text-2xl font-black text-secondary dark:text-white uppercase italic tracking-tighter mb-6 relative z-10">При получении</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-8 relative z-10 font-medium">
                    Доступно для Москвы и области. Проверьте товар, убедитесь в его подлинности и только после этого оплатите любым удобным способом курьеру.
                </p>
                <div className="h-[1px] w-full bg-neutral-200 dark:bg-white/10 mb-6" />
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-black text-secondary dark:text-white uppercase tracking-widest">Никакого риска</span>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
}
