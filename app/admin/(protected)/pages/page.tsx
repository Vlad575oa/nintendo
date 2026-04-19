"use client";

import { useEffect, useState } from "react";
import { Save, Layers, Phone, Truck, ShieldCheck, Info } from "lucide-react";

const inputCls = "w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-[#111827] placeholder:text-neutral-300 outline-none focus:bg-white focus:border-primary/30 transition-all";
const labelCls = "block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5";

const SECTIONS = [
  {
    key: "about",
    label: "О нас",
    icon: Info,
    fields: [
      { key: "hero_title", label: "Заголовок страницы", type: "input" },
      { key: "hero_subtitle", label: "Подзаголовок", type: "input" },
      { key: "story", label: "Текст о компании", type: "textarea" },
      { key: "phone", label: "Телефон", type: "input" },
      { key: "email", label: "Email", type: "input" },
      { key: "address", label: "Адрес", type: "input" },
    ],
  },
  {
    key: "delivery",
    label: "Доставка",
    icon: Truck,
    fields: [
      { key: "title", label: "Заголовок страницы", type: "input" },
      { key: "delivery_text", label: "Описание доставки", type: "textarea" },
      { key: "free_delivery_from", label: "Бесплатная доставка от (руб)", type: "input" },
      { key: "payment_methods", label: "Способы оплаты", type: "input" },
    ],
  },
  {
    key: "contacts",
    label: "Контакты",
    icon: Phone,
    fields: [
      { key: "phone", label: "Телефон", type: "input" },
      { key: "email", label: "Email", type: "input" },
      { key: "address", label: "Адрес", type: "input" },
      { key: "schedule", label: "График работы", type: "input" },
      { key: "telegram", label: "Telegram URL", type: "input" },
      { key: "whatsapp", label: "WhatsApp URL", type: "input" },
      { key: "vk", label: "ВКонтакте URL", type: "input" },
    ],
  },
  {
    key: "warranty",
    label: "Гарантия",
    icon: ShieldCheck,
    fields: [
      { key: "title", label: "Заголовок страницы", type: "input" },
      { key: "warranty_period", label: "Срок гарантии", type: "input" },
      { key: "warranty_text", label: "Текст о гарантии", type: "textarea" },
      { key: "return_period", label: "Срок возврата", type: "input" },
    ],
  },
];

export default function PagesPage() {
  const [data, setData] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    fetch("/api/admin/pages")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const setField = (section: string, key: string, val: string) =>
    setData((p) => ({ ...p, [section]: { ...(p[section] ?? {}), [key]: val } }));

  const saveSection = async (sectionKey: string) => {
    setSaving(sectionKey);
    await fetch("/api/admin/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(null);
    setSaved(sectionKey);
    setTimeout(() => setSaved(null), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const section = SECTIONS.find((s) => s.key === activeSection)!;

  return (
    <>
      <header className="bg-white border-b border-neutral-100 px-8 py-5">
        <h1 className="text-xl font-black text-[#111827] flex items-center gap-2">
          <Layers size={18} className="text-primary" /> Редактор страниц
        </h1>
        <p className="text-xs text-neutral-400 font-bold mt-0.5">Изменяйте контент статических страниц сайта</p>
      </header>

      <div className="p-8 flex gap-6 max-w-5xl">
        {/* Tabs */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left text-sm font-black transition-all border-b border-neutral-50 last:border-0 ${
                  activeSection === s.key
                    ? "bg-primary/5 text-primary"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-[#111827]"
                }`}
              >
                <s.icon size={15} className={activeSection === s.key ? "text-primary" : "text-neutral-400"} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <section.icon size={16} className="text-primary" />
                <h2 className="text-sm font-black text-[#111827]">Страница: {section.label}</h2>
              </div>
              <button
                onClick={() => saveSection(section.key)}
                disabled={saving === section.key}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-xs font-black rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
              >
                <Save size={13} />
                {saving === section.key ? "Сохранение..." : saved === section.key ? "Сохранено ✓" : "Сохранить"}
              </button>
            </div>

            {section.fields.map((field) => (
              <div key={field.key}>
                <label className={labelCls}>{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={4}
                    value={data[section.key]?.[field.key] ?? ""}
                    onChange={(e) => setField(section.key, field.key, e.target.value)}
                  />
                ) : (
                  <input
                    className={inputCls}
                    value={data[section.key]?.[field.key] ?? ""}
                    onChange={(e) => setField(section.key, field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <p className="text-[10px] text-neutral-400 font-bold mt-3 px-1">
            Изменения применяются при следующей публикации / перезапуске. Для немедленного применения перезапустите сервер.
          </p>
        </div>
      </div>
    </>
  );
}
