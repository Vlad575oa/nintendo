"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#2c2c30] text-white pt-12 pb-6 border-t border-white/[0.06] relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />

            <div className="container relative z-10 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">

                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-[0_6px_16px_var(--primary-glow)] transition-all group-hover:scale-105">
                                <span className="text-white font-black text-xl italic leading-none">G</span>
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase italic">
                                Gameshop<span className="text-primary">24</span>
                            </span>
                        </Link>
                        <p className="text-neutral-500 text-[12px] font-medium leading-relaxed max-w-xs">
                            Премиальный магазин игровых консолей и аксессуаров. Только оригинальные товары с гарантией.
                        </p>
                        <div className="flex items-center gap-2.5">
                            {[
                                { icon: "/icons/telegram-svgrepo-com.svg", color: "hover:bg-[#26A5E4]/20", id: "tg", href: "https://t.me/+79266763488", newTab: true },
                                { icon: "/icons/whatsapp-svgrepo-com.svg", color: "hover:bg-[#25D366]/20", id: "wa", href: "https://wa.me/79266763488", newTab: true },
                                { icon: "/icons/logotip-messendzhera-max.svg", color: "hover:bg-white/20", id: "max", href: "https://max.ru/u/79266763488", newTab: true },
                            ].map((s) => (
                                <Link
                                    key={s.id}
                                    href={s.href}
                                    target={s.newTab ? "_blank" : undefined}
                                    rel={s.newTab ? "noopener noreferrer" : undefined}
                                    className={`w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center transition-all ${s.color} hover:border-white/10 group/soc`}
                                >
                                    <img
                                        src={s.icon}
                                        alt={s.id}
                                        className="w-[18px] h-[18px] object-contain"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Nav */}
                    <div>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-4">Каталог</h4>
                        <ul className="space-y-2">
                            {[
                                { name: "Nintendo Switch", href: "/catalog/nintendo" },
                                { name: "PlayStation 5", href: "/catalog/playstation" },
                                { name: "Xbox Series", href: "/catalog/xbox" },
                                { name: "Аксессуары", href: "/catalog/accessories" },
                                { name: "Все товары", href: "/catalog/all" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-[12px] font-bold text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-4">Информация</h4>
                        <ul className="space-y-2">
                            {[
                                { name: "О компании", href: "/about" },
                                { name: "Блог", href: "/blog" },
                                { name: "Доставка и оплата", href: "/delivery" },
                                { name: "Гарантия", href: "/warranty" },
                                { name: "FAQ", href: "/faq" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-[12px] font-bold text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacts */}
                    <div>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-4">Контакты</h4>
                        <div className="space-y-3">
                            <Link href="tel:+79266763488" className="flex items-center gap-3 group/item">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover/item:bg-primary/20 transition-colors">
                                    <Phone size={13} className="text-neutral-400 group-hover/item:text-primary transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-black text-white">7(926)676-34-88</p>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">09:00 — 21:00</p>
                                </div>
                            </Link>
                            <Link href="mailto:shop@gameshop24.ru" className="flex items-center gap-3 group/item">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover/item:bg-primary/20 transition-colors">
                                    <Mail size={13} className="text-neutral-400 group-hover/item:text-primary transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-black text-white">shop@gameshop24.ru</p>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Email</p>
                                </div>
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <MapPin size={13} className="text-neutral-400" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-black text-white">Москва, Митинская 10, корп. 1</p>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Шоурум</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-6 border-t border-white/5">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                        {[
                            { name: "Публичная оферта", href: "/legal/offer" },
                            { name: "Конфиденциальность", href: "/legal/privacy" },
                            { name: "Условия использования", href: "/legal/terms" },
                            { name: "Файлы Cookie", href: "/legal/cookies" },
                            { name: "Контакты", href: "/contacts" },
                        ].map((link) => (
                            <Link key={link.name} href={link.href} className="text-[10px] font-bold text-neutral-600 hover:text-neutral-400 transition-colors uppercase tracking-widest">
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <p className="text-[10px] font-black text-neutral-700 uppercase tracking-widest">
                            © {currentYear} Gameshop24
                        </p>
                        <Link
                            href="https://t.me/vlad557"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all group"
                        >
                            <span className="text-[9px] font-black text-neutral-500 uppercase tracking-[.3em] group-hover:text-neutral-400">Build</span>
                            <div className="bg-primary px-2 py-0.5 rounded text-[9px] font-black text-white italic">VD</div>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
