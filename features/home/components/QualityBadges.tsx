"use client";

import { ShieldCheck, Award, Zap, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const BADGES = [
  {
    icon: ShieldCheck,
    title: "100% Оригинал",
    desc: "Только аутентичные товары от официальных дистрибьюторов.",
    color: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: Award,
    title: "Официальная гарантия",
    desc: "Полная правовая защита и сервисное обслуживание на 12 месяцев.",
    color: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-500",
  },
  {
    icon: Zap,
    title: "Моментальная отгрузка",
    desc: "Собственный склад в Москве. Отправка в день заказа до 18:00.",
    color: "from-orange-500/10 to-yellow-500/10",
    iconColor: "text-orange-500",
  },
  {
    icon: Headphones,
    title: "Экспертная помощь",
    desc: "Наши менеджеры — фанаты Nintendo, готовые помочь 24/7.",
    color: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-500",
  },
];

export const QualityBadges = () => {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BADGES.map((badge, idx) => (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`relative overflow-hidden group p-8 rounded-[32px] bg-white border border-neutral-100 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/5`}
          >
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <badge.icon size={28} className={badge.iconColor} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-secondary mb-3 italic">
                {badge.title}
              </h3>
              <p className="text-[13px] text-neutral-500 font-medium leading-relaxed">
                {badge.desc}
              </p>
            </div>
            
            {/* Corner Decorative Element */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-neutral-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150 rotate-12" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
