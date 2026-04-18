"use client";

import { useState } from "react";
import {
  MessageCircle, Phone, Mail, MapPin, Clock,
  Send, Building2, CheckCircle2
} from "lucide-react";

const channels = [
  {
    icon: MessageCircle,
    label: "Telegram",
    value: "@nintendo_shop_support",
    sub: "Ответ до 15 минут",
    badge: "24/7",
    href: "https://t.me/nintendo_shop_support",
    accent: true,
  },
  {
    icon: Phone,
    label: "Телефон",
    value: "+7 (495) 123-45-67",
    sub: "Пн–Вс, 10:00–21:00",
    badge: "Бесплатно",
    href: "tel:+74951234567",
    accent: false,
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@nintendo-shop.ru",
    sub: "Ответ до 2 часов",
    badge: "24/7",
    href: "mailto:support@nintendo-shop.ru",
    accent: false,
  },
  {
    icon: MapPin,
    label: "Шоурум",
    value: "Москва, ул. Митинская, 10",
    sub: "м. Митино, 5 мин пешком",
    badge: "Самовывоз",
    href: "#map",
    accent: false,
  },
];

const topics = [
  "Вопрос по заказу",
  "Гарантийный случай",
  "Возврат / обмен",
  "Консультация по товару",
  "Сотрудничество",
  "Другое",
];

export default function ContactsPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-white min-h-screen pt-6 pb-28">
      <div className="container max-w-5xl">

        {/* Hero */}
        <div className="mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 rounded-full text-primary text-[11px] font-black uppercase tracking-[0.2em]">
            <MessageCircle size={14} />
            Контакты
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-secondary leading-[0.9] uppercase">
            Мы на связи<br />
            <span className="text-primary">24 / 7</span>
          </h1>
          <p className="text-lg text-neutral-400 font-bold max-w-xl leading-relaxed">
            Среднее время ответа — <strong className="text-secondary">15 минут</strong>. Пишите по любому вопросу: от выбора консоли до решения гарантийного случая.
          </p>
        </div>

        {/* Channel cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <a
                key={ch.label}
                href={ch.href}
                className={`group rounded-[28px] p-7 flex flex-col gap-4 transition-all duration-300 ${
                  ch.accent
                    ? "bg-secondary hover:bg-secondary/90"
                    : "bg-neutral-50 border border-transparent hover:bg-white hover:border-neutral-100 hover:shadow-xl hover:shadow-neutral-200/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center ${ch.accent ? "bg-white/15" : "bg-white shadow-sm group-hover:bg-primary group-hover:shadow-xl group-hover:shadow-primary/30 transition-all"}`}>
                    <Icon size={20} className={ch.accent ? "text-white" : "text-neutral-400 group-hover:text-white transition-colors"} />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${ch.accent ? "bg-white/15 text-white" : "bg-primary/10 text-primary"}`}>
                    {ch.badge}
                  </span>
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${ch.accent ? "text-white/50" : "text-neutral-400"}`}>{ch.label}</p>
                  <p className={`font-black text-sm ${ch.accent ? "text-white" : "text-secondary"}`}>{ch.value}</p>
                </div>
                <p className={`text-xs font-bold ${ch.accent ? "text-white/50" : "text-neutral-400"}`}>{ch.sub}</p>
              </a>
            );
          })}
        </div>

        {/* Form + hours */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-16">

          {/* Form */}
          <div className="lg:col-span-3 bg-neutral-50 rounded-[32px] p-8 md:p-10">
            <h2 className="text-2xl font-black text-secondary mb-6">Напишите нам</h2>

            {sent ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-black text-secondary">Сообщение отправлено!</h3>
                <p className="text-neutral-400 font-bold max-w-xs">Мы ответим в ближайшее время. Обычно — в течение 15 минут.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", topic: "", message: "" }); }}
                  className="mt-2 text-primary font-black text-sm hover:underline"
                >
                  Отправить ещё одно
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Ваше имя *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Иван"
                      className="w-full bg-white border border-neutral-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-secondary placeholder:text-neutral-200 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="ivan@mail.ru"
                      className="w-full bg-white border border-neutral-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-secondary placeholder:text-neutral-200 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Тема *</label>
                  <select
                    required
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full bg-white border border-neutral-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-secondary focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                  >
                    <option value="" disabled>Выберите тему...</option>
                    {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Сообщение *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Опишите ваш вопрос..."
                    className="w-full bg-white border border-neutral-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-secondary placeholder:text-neutral-200 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
                >
                  <Send size={16} />
                  Отправить сообщение
                </button>
              </form>
            )}
          </div>

          {/* Hours + details */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-neutral-50 rounded-[28px] p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={18} className="text-primary" />
                <h3 className="font-black text-secondary">Режим работы</h3>
              </div>
              <div className="space-y-3">
                {[
                  { day: "Пн — Пт", hours: "10:00 — 21:00" },
                  { day: "Сб — Вс", hours: "11:00 — 20:00" },
                  { day: "Telegram / чат", hours: "24 / 7" },
                ].map((row) => (
                  <div key={row.day} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                    <span className="text-sm font-bold text-neutral-500">{row.day}</span>
                    <span className="text-sm font-black text-secondary">{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-50 rounded-[28px] p-8 flex-grow">
              <div className="flex items-center gap-3 mb-6">
                <Building2 size={18} className="text-primary" />
                <h3 className="font-black text-secondary">Реквизиты</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Компания", value: "ООО «ГЕЙМПРО»" },
                  { label: "ИНН", value: "7743891254" },
                  { label: "ОГРН", value: "1177746382091" },
                  { label: "Адрес", value: "125438, г. Москва, пер. 4-й Лихачёвский, д. 4" },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">{row.label}</p>
                    <p className="text-sm font-bold text-secondary">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
