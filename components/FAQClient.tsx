"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Package, Truck, CreditCard, ShieldCheck, Search, X } from "lucide-react";

type FAQ = {
  id: number;
  question: string;
  answer: string;
  category: string;
};

const CAT_ICONS: Record<string, React.ElementType> = {
  "Заказы": Package,
  "Доставка": Truck,
  "Оплата": CreditCard,
  "Гарантия": ShieldCheck,
};

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/15 text-primary rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function FAQItem({
  question,
  answer,
  query,
  forceOpen,
}: {
  question: string;
  answer: string;
  query: string;
  forceOpen: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isOpen = forceOpen || open;

  return (
    <div className="border-b border-neutral-100 last:border-0" onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between cursor-pointer py-7 gap-4">
        <span className="text-lg font-bold text-secondary leading-snug pr-4">
          {highlight(question, query)}
        </span>
        <div
          className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-primary text-white shadow-xl shadow-primary/30 rotate-180"
              : "bg-neutral-50 text-neutral-400"
          }`}
        >
          <ChevronDown size={18} />
        </div>
      </div>
      {isOpen && (
        <div className="text-neutral-500 text-base leading-relaxed font-medium pb-7 max-w-3xl animate-in fade-in slide-in-from-top-2 duration-300">
          {highlight(answer, query)}
        </div>
      )}
    </div>
  );
}

export default function FAQClient({ faqs }: { faqs: FAQ[] }) {
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () =>
      faqs.reduce<Record<string, number>>((acc, f) => {
        acc[f.category] = (acc[f.category] ?? 0) + 1;
        return acc;
      }, {}),
    [faqs]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchCat = active === "all" || f.category === active;
      if (!q) return matchCat;
      return matchCat && (
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
      );
    });
  }, [faqs, active, query]);

  const isSearching = query.trim().length > 0;

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-10">
        <div className="bg-white rounded-[28px] shadow-2xl shadow-neutral-200/60 border border-neutral-100 flex items-center gap-5 px-6 py-5">
          <div className="w-12 h-12 rounded-[16px] bg-secondary flex items-center justify-center shrink-0">
            <Search size={20} className="text-white" />
          </div>
          <div className="flex-grow">
            <p className="text-[9px] uppercase font-black tracking-widest text-neutral-400 mb-1">
              Поиск по базе
            </p>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Начните вводить ваш вопрос..."
              className="w-full text-base font-bold placeholder:text-neutral-300 focus:outline-none text-secondary bg-transparent"
              autoComplete="off"
            />
          </div>
          {isSearching && (
            <button
              onClick={() => setQuery("")}
              className="w-9 h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors shrink-0"
            >
              <X size={15} className="text-neutral-500" />
            </button>
          )}
        </div>

        {/* Live results count badge */}
        {isSearching && (
          <div className="absolute -bottom-4 left-6 px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/30 animate-in fade-in duration-200">
            {filtered.length === 0 ? "Ничего не найдено" : `${filtered.length} ${filtered.length === 1 ? "вопрос" : filtered.length < 5 ? "вопроса" : "вопросов"}`}
          </div>
        )}
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20 mt-6 md:px-0">
        {Object.keys(CAT_ICONS).map((slug) => {
          const Icon = CAT_ICONS[slug];
          const isActive = active === slug;
          return (
            <button
              key={slug}
              onClick={() => setActive(isActive ? "all" : slug)}
              className={`group p-6 rounded-[32px] border text-left transition-all duration-300 cursor-pointer overflow-hidden relative ${
                isActive
                  ? "bg-primary border-primary shadow-2xl shadow-primary/30"
                  : "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-white/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
                  isActive
                    ? "bg-white/20"
                    : "bg-neutral-50 dark:bg-white/5 group-hover:bg-primary group-hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-colors ${
                    isActive ? "text-white" : "text-neutral-400"
                  }`}
                />
              </div>
              <h3 className={`text-sm font-black mb-1 uppercase tracking-tight ${isActive ? "text-white" : "text-secondary dark:text-white"}`}>
                {slug}
              </h3>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "text-white/60" : "text-neutral-400 font-medium"}`}>
                {counts[slug] ?? 0} ответов
              </p>
              
              {isActive && (
                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      <div className="bg-neutral-50/50 rounded-[48px] p-6 md:p-14">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-secondary uppercase tracking-tighter">
              {isSearching
                ? `Результаты поиска`
                : active === "all"
                ? "Все вопросы"
                : active}
              <span className="ml-3 text-base font-bold text-neutral-400">
                ({filtered.length})
              </span>
            </h2>
            {(active !== "all" || isSearching) && (
              <button
                onClick={() => { setActive("all"); setQuery(""); }}
                className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
              >
                Сбросить
              </button>
            )}
          </div>

          <div className="bg-white rounded-[32px] px-6 md:px-12 shadow-xl shadow-neutral-200/20 border border-neutral-100">
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-neutral-300 text-5xl mb-4">🔍</p>
                <p className="font-black text-secondary mb-2">Ничего не найдено</p>
                <p className="text-sm text-neutral-400 font-bold">
                  Попробуйте другой запрос или{" "}
                  <button onClick={() => setQuery("")} className="text-primary hover:underline">
                    сбросьте поиск
                  </button>
                </p>
              </div>
            ) : (
              filtered.map((faq) => (
                <FAQItem
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  query={query}
                  forceOpen={isSearching}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
