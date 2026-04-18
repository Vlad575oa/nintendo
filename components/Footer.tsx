"use client";

import Link from "next/link";
import { Send, Phone, Mail, MapPin, Youtube, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden bg-[#0a0a0a] text-white pt-24 pb-12 border-t border-white/5">
            {/* Premium Mesh Gradient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,107,0,0.05)_0%,transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(255,107,0,0.03)_0%,transparent_40%)]" />
            </div>

            {/* Glowing Accent */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />

            <div className="container relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-24">
                    
                    {/* Brand Section */}
                    <div className="flex flex-col gap-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-[0_8px_20px_var(--primary-glow)] transition-all group-hover:scale-105 active:scale-95">
                                <span className="text-white font-black text-2xl italic leading-none ml-0.5">N</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase italic">
                                Nintendo<span className="text-primary italic">.</span>Shop
                            </span>
                        </Link>
                        <p className="text-neutral-500 text-sm font-medium leading-relaxed max-w-xs">
                            Ваш премиальный гид в мире гейминга. Только оригинальные консоли, редкие аксессуары и экспертный контент с 2012 года.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { icon: Send, color: "hover:bg-[#26A5E4]", id: "tg" },
                                { icon: Youtube, color: "hover:bg-[#FF0000]", id: "yt" },
                                { icon: Instagram, color: "hover:bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500", id: "ig" }
                            ].map((social) => (
                                <Link 
                                    key={social.id}
                                    href="#" 
                                    className={`w-11 h-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center transition-all duration-300 ${social.color} hover:text-white text-neutral-400`}
                                >
                                    <social.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-8 lg:p-10 hover:bg-white/[0.04] transition-all group">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8">Экосистема</h4>
                        <ul className="space-y-4">
                            {[
                                { name: "Nintendo Switch", href: "/catalog/nintendo" },
                                { name: "PlayStation 5", href: "/catalog/playstation" },
                                { name: "Xbox Series", href: "/catalog/xbox" },
                                { name: "Retro Gaming", href: "/catalog/retro" },
                                { name: "Аксессуары", href: "/catalog/accessories" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-[13px] font-bold text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
 
                    {/* Info */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-8 lg:p-10 hover:bg-white/[0.04] transition-all group">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8">Информация</h4>
                        <ul className="space-y-4">
                            {[
                                { name: "О компании", href: "/about" },
                                { name: "Блог игромана", href: "/blog" },
                                { name: "Доставка & Оплата", href: "/info/delivery" },
                                { name: "Гарантия", href: "/info/guarantee" },
                                { name: "FAQ", href: "/faq" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-[13px] font-bold text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacts */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-8 lg:p-10 hover:bg-white/[0.04] transition-all group">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8">Связь с нами</h4>
                        <div className="space-y-6">
                            <Link href="tel:84952259922" className="flex items-start gap-4 group/item">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover/item:bg-primary/20 transition-colors">
                                    <Phone size={16} className="text-neutral-400 group-hover/item:text-primary transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-white">8 495 225-99-22</p>
                                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">09:00 — 21:00 (ЕЖЕДНЕВНО)</p>
                                </div>
                            </Link>
                            <Link href="mailto:support@nintendo.shop" className="flex items-start gap-4 group/item">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover/item:bg-primary/20 transition-colors">
                                    <Mail size={16} className="text-neutral-400 group-hover/item:text-primary transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-white italic">support@nintendo.shop</p>
                                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">ПО ЛЮБЫМ ВОПРОСАМ</p>
                                </div>
                            </Link>
                            <div className="flex items-start gap-4 pt-4 border-t border-white/[0.03]">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <MapPin size={16} className="text-neutral-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-white">Москва, Митинская 10</p>
                                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">ПРЕМИУМ ШОУРУМ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar & Legal Links */}
                <div className="pt-12 border-t border-white/5">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
                        {[
                            { name: "Публичная оферта", href: "/info/offer" },
                            { name: "Конфиденциальность", href: "/info/privacy" },
                            { name: "Условия использования", href: "/info/terms" },
                            { name: "Файлы Cookie", href: "/info/cookies" },
                            { name: "Карта сайта", href: "/sitemap.xml" },
                            { name: "Возврат товара", href: "/info/guarantee" }
                        ].map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-widest"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/[0.02]">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest text-center md:text-left">
                                © {currentYear} NINTENDO SHOP · ООО "ГЕЙМПРО" · ИНН 7743891254 · ОГРН 1177746382091
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                            <span className="text-[9px] font-black text-neutral-500 uppercase tracking-[.3em]">Built with</span>
                            <div className="bg-primary px-2 py-0.5 rounded-md text-[9px] font-black text-white italic">AI</div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
