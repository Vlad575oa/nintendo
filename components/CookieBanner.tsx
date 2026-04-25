"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let consent: string | null = null;
    try {
      consent = localStorage.getItem("cookie-consent");
    } catch {
      // Some browsers/privacy modes can throw on storage access.
    }

    if (consent) return;

    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("cookie-consent", "accepted");
    } catch {
      // Ignore storage write errors and just hide the banner.
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] w-full px-4 animate-in slide-in-from-bottom-6 fade-in duration-500">
      <div className="mx-auto w-full max-w-[560px] bg-secondary text-white p-5 md:p-6 rounded-3xl shadow-2xl border border-white/10 bg-opacity-95 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors" />
        
        <div className="relative z-10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Cookie className="text-primary" size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-base md:text-lg">Мы используем cookie</h4>
              <p className="text-neutral-300 text-xs md:text-sm leading-relaxed font-medium">
                Для работы сайта и аналитики (Яндекс Метрика). Продолжая, вы соглашаетесь с нашей{" "}
                <Link href="/legal/privacy" className="text-white underline hover:text-primary transition-colors">
                  Политикой конфиденциальности
                </Link>.
              </p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button 
              onClick={handleAccept}
              className="flex-grow py-2.5 bg-white text-secondary hover:bg-neutral-200 rounded-xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
            >
              Принять всё
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl font-black text-sm transition-all border border-white/10"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
