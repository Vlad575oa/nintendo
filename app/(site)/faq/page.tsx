import prisma from "@/lib/prisma";
import { 
  ChevronDown, 
  HelpCircle, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Package,
  MessageSquare,
  Search
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вопросы и ответы (FAQ) | Поддержка Nintendo Shop",
  description: "Всё о доставке, гарантии и оплате игровых консолей. Ответы на технические вопросы о PS5 Pro и Nintendo Switch.",
  alternates: {
    canonical: "/faq"
  }
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  return (
    <details className="group border-b border-neutral-100 last:border-0 py-8">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <span className="text-xl font-bold text-secondary group-hover:text-primary transition-all duration-300 pr-8">
          {question}
        </span>
        <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center group-open:rotate-180 transition-all duration-500 group-open:bg-primary group-open:text-white group-open:shadow-xl group-open:shadow-primary/30">
          <ChevronDown size={20} className="text-neutral-400 group-open:text-white" />
        </div>
      </summary>
      <div className="mt-6 text-neutral-500 text-lg leading-relaxed font-medium animate-in fade-in slide-in-from-top-4 duration-500 max-w-2xl">
        {answer}
      </div>
    </details>
  );
};

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { order: 'asc' }
  });

  const categories = [
    { name: "Заказы", icon: Package, count: 12 },
    { name: "Доставка", icon: Truck, count: 8 },
    { name: "Оплата", icon: CreditCard, count: 6 },
    { name: "Гарантия", icon: ShieldCheck, count: 4 },
  ];

  return (
    <div className="bg-white min-h-screen pt-40 pb-32">
      <div className="container">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-end">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 rounded-full text-primary text-[11px] font-black uppercase tracking-[0.2em]">
              <HelpCircle size={16} />
              Центр поддержки
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-secondary leading-[0.9] uppercase">
              Чем мы <br />
              <span className="text-primary">поможем?</span>
            </h1>
            <p className="text-xl text-neutral-400 font-bold max-w-xl leading-relaxed">
              Мы собрали всё, что может вызвать вопросы у геймера — от нюансов с регионами аккаунтов до сроков курьерской доставки.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-neutral-50 rounded-[40px] -z-10 group-hover:bg-primary/5 transition-colors" />
            <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-neutral-50 flex items-center gap-6 translate-y-[-10%] group-hover:translate-y-[-15%] transition-transform duration-500">
               <div className="w-16 h-16 rounded-[20px] bg-secondary flex items-center justify-center text-white shrink-0 shadow-xl">
                 <Search size={24} />
               </div>
               <div className="flex-grow">
                 <p className="text-[10px] uppercase font-black tracking-widest text-neutral-400 mb-1">Поиск по базе</p>
                 <input 
                  type="text" 
                  placeholder="Начните вводить ваш вопрос..." 
                  className="w-full text-lg font-bold placeholder:text-neutral-200 focus:outline-none"
                 />
               </div>
            </div>
          </div>
        </div>

        {/* Dynamic Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {categories.map((cat) => (
            <div key={cat.name} className="group p-10 bg-neutral-50 hover:bg-white rounded-[40px] border border-transparent hover:border-neutral-100 hover:shadow-2xl hover:shadow-neutral-200/50 transition-all duration-500 cursor-pointer">
              <div className="w-16 h-16 rounded-[24px] bg-white group-hover:bg-primary flex items-center justify-center mb-8 shadow-sm group-hover:shadow-xl group-hover:shadow-primary/30 transition-all">
                <cat.icon size={28} className="text-neutral-300 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-secondary mb-2">{cat.name}</h3>
              <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest">{cat.count} ВОПРОСОВ</p>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-neutral-50/50 rounded-[60px] p-8 md:p-20 overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-12">
               <h2 className="text-3xl font-black text-secondary uppercase tracking-tighter">Популярные темы</h2>
               <div className="text-xs font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-200 pb-1">Развернуть всё</div>
            </div>
            
            <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-xl shadow-neutral-200/20 border border-neutral-100">
              {faqs.map((faq) => (
                <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>

        {/* Floating Support Support */}
        <div className="mt-32 p-16 bg-secondary rounded-[60px] relative overflow-hidden text-center md:text-left">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <h3 className="text-4xl font-black text-white leading-tight">Всё еще нужна помощь? <br /> Мы на связи 24/7.</h3>
                <p className="text-neutral-400 font-bold max-w-md">Наши технические специалисты ответят в течение 5 минут в Telegram.</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-6">
                <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                  Telegram Bot
                </button>
                <button className="px-10 py-5 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-all border border-white/10">
                  Позвонить
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
