"use client";

import Link from "next/link";
import { Send, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { name: "Публичная оферта", href: "/legal/offer" },
    { name: "Политика обработки персональных данных", href: "/legal/privacy" },
    { name: "Условия использования", href: "/legal/terms" },
    { name: "Настройки файлов Cookie", href: "/legal/cookies" },
    { name: "Карта сайта", href: "/sitemap-info" },
  ];

  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 border-t border-neutral-900">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Contacts */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
              NINTENDO<span className="text-primary">.</span>SHOP
            </Link>
            <div className="space-y-4 text-sm text-neutral-400 font-bold">
              <p className="flex flex-col">
                <span className="text-neutral-500 uppercase text-[10px] tracking-widest mb-1">Телефон</span>
                <Link href="tel:+74951234567" className="text-white hover:text-primary transition-colors text-lg">
                  +7 (495) 123-45-67
                </Link>
              </p>
              <p className="flex flex-col">
                <span className="text-neutral-500 uppercase text-[10px] tracking-widest mb-1">Email</span>
                <Link href="mailto:support@nintendo-shop.ru" className="text-white hover:text-primary transition-colors">
                  support@nintendo-shop.ru
                </Link>
              </p>
              <div className="pt-4 space-y-1 text-[11px] leading-relaxed">
                <p>ООО "ГЕЙМПРО"</p>
                <p>ИНН: 7743891254</p>
                <p>ОГРН: 1177746382091</p>
                <p>Адрес: г. Москва, ул. Митинская, д. 10, корп. 1</p>
              </div>
            </div>
          </div>

          {/* Catalog */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Каталог</h4>
            <ul className="space-y-3 text-sm font-bold text-neutral-400">
              <li><Link href="/catalog/playstation" className="hover:text-white transition-colors">PlayStation 5</Link></li>
              <li><Link href="/catalog/xbox" className="hover:text-white transition-colors">Xbox Series</Link></li>
              <li><Link href="/catalog/nintendo" className="hover:text-white transition-colors">Nintendo Switch</Link></li>
              <li><Link href="/catalog/accessories" className="hover:text-white transition-colors">Аксессуары</Link></li>
              <li><Link href="/catalog/games" className="hover:text-white transition-colors">Игры</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Информация</h4>
            <ul className="space-y-3 text-sm font-bold text-neutral-400">
              <li><Link href="/about" className="text-sm font-medium hover:text-white transition-colors">О компании</Link></li>
              <li><Link href="/blog" className="text-sm font-medium hover:text-white transition-colors">Блог игромана</Link></li>
              <li><Link href="/faq" className="text-sm font-medium hover:text-white transition-colors">Вопросы и ответы</Link></li>
              <li><Link href="/delivery" className="text-sm font-medium hover:text-white transition-colors">Доставка и оплата</Link></li>
              <li><Link href="/warranty" className="text-sm font-medium hover:text-white transition-colors">Гарантия</Link></li>
              <li><Link href="/contacts" className="hover:text-white transition-colors">Контакты</Link></li>
            </ul>
          </div>

          {/* Social & Support */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">На связи</h4>
            <div className="grid grid-cols-4 gap-3">
              <Link 
                href="https://t.me/max_support" 
                target="_blank"
                className="group relative"
              >
                <div className="w-10 h-10 bg-[#9000FF] rounded-xl flex items-center justify-center shadow-[0_5px_15px_rgba(144,0,255,0.2)] transition-all group-hover:scale-110 active:scale-95">
                  <div className="w-5 h-5 rounded-full border-[3px] border-white flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>
              </Link>
              <Link 
                href="https://t.me/nintendo_shop" 
                target="_blank"
                className="group relative"
              >
                <div className="w-10 h-10 bg-[#26A5E4] rounded-xl flex items-center justify-center shadow-[0_5px_15px_rgba(38,165,228,0.2)] transition-all group-hover:scale-110 active:scale-95">
                  <Send size={18} fill="white" className="text-white ml-0.5 mt-0.5" />
                </div>
              </Link>
              <Link 
                href="https://vk.com/nintendo_shop" 
                target="_blank"
                className="group relative"
              >
                <div className="w-10 h-10 bg-[#0077FF] rounded-xl flex items-center justify-center shadow-[0_5px_15px_rgba(0,119,255,0.2)] transition-all group-hover:scale-110 active:scale-95">
                  <div className="text-white font-black text-sm">VK</div>
                </div>
              </Link>
              <Link 
                href="https://youtube.com/nintendo_shop" 
                target="_blank"
                className="group relative"
              >
                <div className="w-10 h-10 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-[0_5px_15px_rgba(255,0,0,0.2)] transition-all group-hover:scale-110 active:scale-95">
                  <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5" />
                </div>
              </Link>
            </div>
            
            <div className="pt-4 border-t border-neutral-900">
              <div className="flex items-center gap-3 text-neutral-400 group">
                <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Clock size={14} />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[10px] uppercase tracking-wider text-neutral-600 font-bold">Время работы</span>
                  <span className="block text-[12px] text-white font-bold leading-none">10:00 — 21:00</span>
                </div>
              </div>
              <p className="mt-3 text-[10px] text-neutral-500 font-medium leading-relaxed">
                Ежедневно, без выходных и праздников.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 border-t border-neutral-900 flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
            {legalLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-[11px] font-bold text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <p className="text-[10px] font-bold text-neutral-600 leading-relaxed uppercase tracking-widest">
              © {currentYear} NINTENDO SHOP. ВСЕ ПРАВА ЗАЩИЩЕНЫ. КОПИРОВАНИЕ МАТЕРИАЛОВ С САЙТА ЗАПРЕЩЕНО. 
              ВСЯ ИНФОРМАЦИЯ НА САЙТЕ НОСИТ СПРАВОЧНЫЙ ХАРАКТЕР И НЕ ЯВЛЯЕТСЯ ПУБЛИЧНОЙ ОФЕРТОЙ (П.2 СТ.437 ГК РФ).
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
