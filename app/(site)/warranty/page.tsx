import {
  ShieldCheck, RotateCcw, Wrench, XCircle, CheckCircle2,
  Package, Clock, MessageSquare, AlertTriangle
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Гарантия и возврат | Gameshop24",
  description: "Гарантия 12 месяцев на консоли. Возврат в течение 14 дней. Бесплатный сервис при заводском браке.",
  alternates: { canonical: "/warranty" },
};

const guarantees = [
  {
    icon: ShieldCheck,
    label: "Консоли",
    period: "12 месяцев",
    desc: "Официальная сервисная гарантия от нашего авторизованного центра. Заводской брак — бесплатный ремонт или замена.",
    accent: true,
  },
  {
    icon: Package,
    label: "Аксессуары",
    period: "6 месяцев",
    desc: "Контроллеры, зарядные станции, чехлы. При производственном дефекте — замена в течение 7 рабочих дней.",
    accent: false,
  },
  {
    icon: CheckCircle2,
    label: "Игры (диски)",
    period: "Проверка при получении",
    desc: "Все диски проверяются перед отправкой. Если повреждение выявлено при получении — меняем сразу.",
    accent: false,
  },
];

const returnSteps = [
  {
    num: "01",
    title: "Свяжитесь с нами",
    desc: "Напишите в Telegram 7(926)676-34-88 или на email. Укажите номер заказа и опишите ситуацию.",
  },
  {
    num: "02",
    title: "Пришлите фото / видео",
    desc: "Сделайте фото дефекта или короткое видео. Это ускорит проверку и избавит от лишних вопросов.",
  },
  {
    num: "03",
    title: "Курьер заберёт товар",
    desc: "Мы организуем бесплатный вызов курьера. Упакуйте товар в оригинальную коробку.",
  },
  {
    num: "04",
    title: "Ремонт или возврат",
    desc: "Диагностика — 3–5 рабочих дней. Ремонт или замена — до 14 дней. Деньги возвращаем за 3–10 дней.",
  },
];

const coveredItems = [
  "Заводские дефекты экрана, кнопок и разъёмов",
  "Неисправности батареи при нормальной эксплуатации",
  "Проблемы с программным обеспечением консоли",
  "Дефекты Joy-Con (дрейф стиков) — по отдельному соглашению",
];

const notCoveredItems = [
  "Механические повреждения (падения, сколы, трещины)",
  "Попадание жидкости внутрь корпуса",
  "Самостоятельный ремонт или вскрытие корпуса",
  "Блокировки аккаунта за нарушение правил платформы",
];

export default function WarrantyPage() {
  return (
    <div className="bg-white min-h-screen pt-6 pb-24">
      <div className="container max-w-5xl">

        {/* Hero — compact */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <ShieldCheck size={13} />
            Гарантия и возврат
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-secondary leading-[0.95] uppercase">
            Ваша защита —<br />
            <span className="text-primary">наш приоритет</span>
          </h1>
          <p className="text-base text-neutral-400 font-bold max-w-xl leading-relaxed">
            Продаём только оригинальную технику и стоим за неё горой. Проблема с заказом? Решим без бюрократии.
          </p>
        </div>

        {/* Guarantee cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {guarantees.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.label}
                className={`rounded-[32px] p-8 flex flex-col gap-4 ${
                  g.accent ? "bg-secondary" : "bg-neutral-50 border border-neutral-100"
                }`}
              >
                <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center ${g.accent ? "bg-white/15" : "bg-white shadow-sm"}`}>
                  <Icon size={24} className={g.accent ? "text-white" : "text-primary"} />
                </div>
                <div>
                  <h3 className={`text-xl font-black ${g.accent ? "text-white" : "text-secondary"}`}>{g.label}</h3>
                  <p className={`text-3xl font-black mt-1 ${g.accent ? "text-primary" : "text-secondary"}`}>{g.period}</p>
                </div>
                <p className={`text-sm font-medium leading-relaxed ${g.accent ? "text-white/70" : "text-neutral-500"}`}>
                  {g.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Covered / Not covered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          <div className="bg-green-50 border border-green-100 rounded-[28px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 size={22} className="text-green-600" />
              <h3 className="text-lg font-black text-secondary">Покрывается гарантией</h3>
            </div>
            <ul className="space-y-3">
              {coveredItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-[28px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <XCircle size={22} className="text-red-500" />
              <h3 className="text-lg font-black text-secondary">Не покрывается гарантией</h3>
            </div>
            <ul className="space-y-3">
              {notCoveredItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Return process */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tighter mb-8">
            Как оформить возврат
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {returnSteps.map((step) => (
              <div key={step.num} className="bg-neutral-50 rounded-[24px] p-7">
                <p className="text-5xl font-black text-neutral-100 mb-4 leading-none">{step.num}</p>
                <h3 className="font-black text-secondary mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Return terms note */}
        <div className="bg-amber-50 border border-amber-100 rounded-[28px] p-8 flex items-start gap-6 mb-16">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-black text-secondary text-lg mb-2">Условия возврата по закону</h3>
            <p className="text-neutral-600 font-medium leading-relaxed text-sm">
              Товар надлежащего качества принимается к возврату в течение <strong>14 дней</strong> при сохранении товарного вида и оригинальной упаковки (ФЗ «О защите прав потребителей»). Технически сложные товары (консоли) надлежащего качества после активации возврату не подлежат — но мы всегда идём навстречу и найдём решение.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-secondary rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Есть вопрос по гарантии?</h3>
            <p className="text-neutral-400 font-bold">Ответим в Telegram за 5 минут, ежедневно 24/7.</p>
          </div>
          <div className="flex gap-4 shrink-0">
            <a
              href="https://t.me/+79266763488"
              className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              Telegram
            </a>
            <a
              href="mailto:shop@gameshop24.ru"
              className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-all border border-white/10"
            >
              Email
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
