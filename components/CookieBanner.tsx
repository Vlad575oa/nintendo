"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-[100] animate-in slide-in-from-bottom-10 fade-in duration-700">
      <div className="bg-secondary text-white p-6 rounded-[32px] shadow-2xl border border-white/10 backdrop-blur-xl bg-opacity-95 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors" />
        
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Cookie className="text-primary" size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-lg">Мы используем файлы cookie</h4>
              <p className="text-neutral-400 text-sm leading-relaxed font-medium">
                Для работы сайта и аналитики (Яндекс Метрика). Продолжая, вы соглашаетесь с нашей{" "}
                <Link href="/legal/privacy" className="text-white underline hover:text-primary transition-colors">
                  Политикой конфиденциальности
                </Link>.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleAccept}
              className="flex-grow py-3 bg-white text-secondary hover:bg-neutral-200 rounded-xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
            >
              Принять всё
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-black text-sm transition-all border border-white/10"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
