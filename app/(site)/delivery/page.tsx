import {
  Truck, MapPin, Clock, CreditCard, Banknote,
  Smartphone, ShieldCheck, Package, Star, Zap, CheckCircle2
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Доставка и оплата | Nintendo Shop",
  description: "Доставка по Москве в день заказа. СДЭК, Boxberry, самовывоз. Оплата картой, СБП, наличными и в рассрочку 0%.",
  alternates: { canonical: "/delivery" },
};

const deliveryMethods = [
  {
    icon: Zap,
    label: "Экспресс-курьер",
    subtitle: "По Москве",
    time: "В день заказа",
    price: "500 ₽",
    free: "Бесплатно от 50 000 ₽",
    desc: "Заказ до 14:00 — доставим сегодня. Курьер позвонит за 1 час и согласует удобное окно.",
    accent: true,
  },
  {
    icon: Truck,
    label: "СДЭК / Boxberry",
    subtitle: "По всей России",
    time: "2–7 рабочих дней",
    price: "от 250 ₽",
    free: "Бесплатно от 15 000 ₽",
    desc: "Доставка до двери или до пункта выдачи. Трек-номер — в SMS сразу после отправки.",
    accent: false,
  },
  {
    icon: MapPin,
    label: "Самовывоз",
    subtitle: "Москва, м. Митино",
    time: "В день заказа",
    price: "Бесплатно",
    free: "Ежедневно 10:00–21:00",
    desc: "Заберите в нашем шоуруме: проверьте консоль на месте и получите подарок при первом визите.",
    accent: false,
  },
];

const paymentMethods = [
  {
    icon: CreditCard,
    label: "Банковская карта",
    desc: "Visa, Mastercard, МИР. SSL-шифрование, 3D Secure. Скидка 3% при онлайн-оплате.",
  },
  {
    icon: Smartphone,
    label: "СБП",
    desc: "Оплата по QR-коду или номеру телефона. Мгновенно, без комиссии.",
  },
  {
    icon: Banknote,
    label: "Наличные / карта курьеру",
    desc: "Принимаем при получении в Москве и через СДЭК в большинстве городов.",
  },
  {
    icon: Star,
    label: "Рассрочка 0%",
    desc: "На 3, 6 и 12 месяцев через Тинькофф и Сбер. Решение за 2 минуты без визита в банк.",
  },
];

export default function DeliveryPage() {
  return (
    <div className="bg-white min-h-screen pt-6 pb-28">
      <div className="container max-w-5xl">

        {/* Hero */}
        <div className="mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 rounded-full text-primary text-[11px] font-black uppercase tracking-[0.2em]">
            <Truck size={14} />
            Доставка и оплата
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-secondary leading-[0.9] uppercase">
            Привезём<br />
            <span className="text-primary">быстро и бережно</span>
          </h1>
          <p className="text-lg text-neutral-400 font-bold max-w-xl leading-relaxed">
            Каждую консоль упаковываем в двойную коробку. Курьер звонит заранее — вы выбираете удобное время.
          </p>
        </div>

        {/* Delivery methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {deliveryMethods.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className={`rounded-[32px] p-8 flex flex-col gap-5 ${
                  m.accent
                    ? "bg-secondary text-white"
                    : "bg-neutral-50 border border-neutral-100"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-[18px] flex items-center justify-center ${
                    m.accent ? "bg-white/15" : "bg-white shadow-sm"
                  }`}
                >
                  <Icon size={24} className={m.accent ? "text-white" : "text-primary"} />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${m.accent ? "text-white/50" : "text-neutral-400"}`}>
                    {m.subtitle}
                  </p>
                  <h3 className={`text-xl font-black ${m.accent ? "text-white" : "text-secondary"}`}>
                    {m.label}
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed font-medium ${m.accent ? "text-white/70" : "text-neutral-500"}`}>
                  {m.desc}
                </p>
                <div className={`mt-auto pt-5 border-t ${m.accent ? "border-white/10" : "border-neutral-100"} flex justify-between items-end`}>
                  <div>
                    <p className={`text-2xl font-black ${m.accent ? "text-white" : "text-secondary"}`}>{m.price}</p>
                    <p className={`text-xs font-bold ${m.accent ? "text-white/50" : "text-neutral-400"}`}>{m.free}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest ${m.accent ? "text-white/60" : "text-neutral-400"}`}>
                    <Clock size={12} />
                    {m.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Packaging note */}
        <div className="bg-primary/5 border border-primary/10 rounded-[28px] p-8 flex items-start gap-6 mb-16">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Package size={22} className="text-primary" />
          </div>
          <div>
            <h3 className="font-black text-secondary text-lg mb-2">Как мы упаковываем консоли</h3>
            <p className="text-neutral-500 font-medium leading-relaxed">
              Заводская коробка производителя → пузырчатая плёнка → внешняя транспортировочная коробка с амортизирующим наполнителем. Консоль не сдвинется ни на миллиметр — даже при грубом обращении курьерской службы.
            </p>
          </div>
        </div>

        {/* Payment */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-secondary uppercase tracking-tighter mb-8">
            Способы оплаты
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paymentMethods.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.label} className="bg-neutral-50 rounded-[24px] p-7 flex gap-5 items-start hover:bg-white hover:shadow-lg hover:shadow-neutral-200/50 border border-transparent hover:border-neutral-100 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-secondary mb-1">{p.label}</h3>
                    <p className="text-sm text-neutral-500 font-medium leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom guarantee strip */}
        <div className="bg-secondary rounded-[32px] p-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: ShieldCheck, text: "Официальный чек с каждым заказом" },
            { icon: CheckCircle2, text: "Проверка целостности при курьере" },
            { icon: Clock, text: "Поддержка заказа 24/7 в Telegram" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="flex flex-col items-center gap-3">
                <Icon size={28} className="text-primary" />
                <p className="text-white font-bold text-sm leading-snug">{item.text}</p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
