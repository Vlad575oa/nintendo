"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FaqItem {
  id?: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  isNew?: boolean;
}

const CATEGORIES = ["Заказы", "Доставка", "Оплата", "Гарантия", "Товары", "Прочее"];
const inputCls = "w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-[#111827] placeholder:text-neutral-300 outline-none focus:bg-white focus:border-primary/30 transition-all";

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/faq")
      .then((r) => r.json())
      .then((d) => { setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const addNew = () => {
    const tempId = Date.now();
    setItems((p) => [
      ...p,
      { id: tempId, question: "", answer: "", category: "Заказы", order: p.length, isNew: true },
    ]);
    setOpenId(tempId);
  };

  const setField = (id: number, key: keyof FaqItem, val: any) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, [key]: val } : i)));

  const save = async (item: FaqItem) => {
    setSaving(item.id!);
    const method = item.isNew ? "POST" : "PUT";
    const url = item.isNew ? "/api/admin/faq" : `/api/admin/faq/${item.id}`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: item.question, answer: item.answer, category: item.category, order: item.order }),
    });
    if (res.ok) {
      const data = await res.json();
      setItems((p) =>
        p.map((i) => (i.id === item.id ? { ...data.faq, isNew: false } : i))
      );
    }
    setSaving(null);
  };

  const remove = async (item: FaqItem) => {
    if (!confirm("Удалить этот вопрос?")) return;
    if (!item.isNew) await fetch(`/api/admin/faq/${item.id}`, { method: "DELETE" });
    setItems((p) => p.filter((i) => i.id !== item.id));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      <header className="bg-white border-b border-neutral-100 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#111827]">FAQ</h1>
          <p className="text-xs text-neutral-400 font-bold mt-0.5">{items.length} вопросов</p>
        </div>
        <button
          onClick={addNew}
          className="flex items-center gap-2 bg-primary text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={14} /> Добавить вопрос
        </button>
      </header>

      <div className="p-8 space-y-4 max-w-4xl">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm py-20 text-center">
            <HelpCircle size={40} className="mx-auto mb-3 text-neutral-200" />
            <p className="text-neutral-400 font-bold text-sm">FAQ пуст</p>
            <button onClick={addNew} className="mt-4 text-primary text-sm font-black">+ Добавить первый вопрос</button>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${item.isNew ? "border-primary/30" : "border-neutral-100"}`}>
              <button
                className="w-full px-6 py-4 flex items-center gap-3 text-left group"
                onClick={() => setOpenId(openId === item.id ? null : item.id!)}
              >
                <div className={`w-1 h-8 rounded-full flex-shrink-0 ${item.isNew ? "bg-primary" : "bg-neutral-200"}`} />
                <span className="flex-1 text-sm font-black text-[#111827] line-clamp-1">
                  {item.question || <span className="text-neutral-400 italic">Новый вопрос...</span>}
                </span>
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest bg-neutral-50 px-2 py-1 rounded-lg">{item.category}</span>
                {openId === item.id ? <ChevronUp size={14} className="text-neutral-400" /> : <ChevronDown size={14} className="text-neutral-400" />}
              </button>

              {openId === item.id && (
                <div className="px-6 pb-6 border-t border-neutral-100 pt-5 space-y-4">
                  <div className="grid grid-cols-[1fr_180px] gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Вопрос</label>
                      <input
                        className={inputCls}
                        value={item.question}
                        onChange={(e) => setField(item.id!, "question", e.target.value)}
                        placeholder="Как оформить заказ?"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Категория</label>
                      <select
                        className={inputCls}
                        value={item.category}
                        onChange={(e) => setField(item.id!, "category", e.target.value)}
                      >
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5">Ответ</label>
                    <textarea
                      className={`${inputCls} resize-none`}
                      rows={4}
                      value={item.answer}
                      onChange={(e) => setField(item.id!, "answer", e.target.value)}
                      placeholder="Подробный ответ на вопрос..."
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => remove(item)}
                      className="flex items-center gap-2 text-xs font-black text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={13} /> Удалить
                    </button>
                    <button
                      onClick={() => save(item)}
                      disabled={saving === item.id}
                      className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-xs font-black rounded-xl hover:bg-red-700 transition-all disabled:opacity-60"
                    >
                      <Save size={13} />
                      {saving === item.id ? "Сохранение..." : "Сохранить"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
