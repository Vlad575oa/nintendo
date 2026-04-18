import prisma from "@/lib/prisma";
import FAQClient from "@/components/FAQClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вопросы и ответы (FAQ) | Поддержка Nintendo Shop",
  description: "Всё о доставке, гарантии и оплате игровых консолей. Ответы на частые вопросы.",
  alternates: { canonical: "/faq" },
};

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen pt-12 pb-24 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container">
        
        {/* Phase 4A: Magnetic Header (The Voice) */}
        <header className="mb-16 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em] animate-in slide-in-from-left duration-500">
              Expert Center
            </span>
            <div className="h-[1px] w-12 bg-neutral-100 dark:bg-white/10" />
            <span className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Support 24/7
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-secondary dark:text-white leading-[0.95] tracking-tighter uppercase italic mb-8">
            База знаний<br /> 
            <span className="text-primary not-italic">Nintendo Shop</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed max-w-2xl">
            Мы собрали ответы на 100% вопросов, чтобы ваш путь к новой игре был максимально прозрачным и безопасным. 
          </p>
        </header>

        {/* Phase 4B: Key Takeaways (The Layout) */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
                { title: "Только оригинал", desc: "Мы не продаем копии и рефы", icon: "💎" },
                { title: "Экспресс доставка", desc: "От 2 часов по Москве и МО", icon: "⚡" },
                { title: "Честная гарантия", desc: "Собственный сервис-центр", icon: "🛡️" },
                { title: "Support Expert", desc: "Живое общение без ботов", icon: "👑" }
            ].map((item, i) => (
                <div key={i} className="p-6 bg-neutral-900 rounded-3xl border border-white/5 group hover:border-primary/30 transition-all">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                    <h4 className="text-white font-black uppercase text-[12px] tracking-wider mb-2">{item.title}</h4>
                    <p className="text-white/40 text-[11px] font-medium leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </div>

        {/* Categories + Accordion (client) */}
        <FAQClient faqs={faqs} />

      </div>
    </div>
  );
}
