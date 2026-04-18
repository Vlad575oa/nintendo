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
    <div className="bg-white min-h-screen pt-6 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container">


        {/* Categories + Accordion (client) */}
        <FAQClient faqs={faqs} />

        {/* Support CTA */}
        <div className="mt-20 p-14 bg-secondary rounded-[48px] relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-5">
              <h3 className="text-3xl font-black text-white leading-tight">
                Всё ещё нужна помощь? <br />Мы на связи 24/7.
              </h3>
              <p className="text-neutral-400 font-bold max-w-md">
                Наши специалисты ответят в течение 5 минут в Telegram.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-5">
              <button className="px-9 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                Telegram Bot
              </button>
              <button className="px-9 py-4 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-all border border-white/10">
                Позвонить
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
