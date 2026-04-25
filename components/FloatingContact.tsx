"use client";

import Link from "next/link";

export const FloatingContact = () => {
  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-[100] flex flex-col gap-3">
      {/* Max Chat Button */}
      <Link href="https://max.ru/u/79266763488" target="_blank" rel="noopener noreferrer" className="relative w-10 h-10 transition-all duration-500 hover:scale-110 active:scale-90 group">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-[#A044FF] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
        
        <div className="relative w-full h-full flex items-center justify-center transition-transform group-hover:rotate-6 drop-shadow-xl">
            <img src="/icons/logotip-messendzhera-max.svg" alt="Chat with Max" className="w-full h-full object-contain rounded-full shadow-lg" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-white text-[#9000FF] px-4 py-2 rounded-2xl text-[10px] font-black shadow-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap">
            Чат с Max
        </div>
      </Link>

      {/* Telegram Button */}
      <Link 
        href="https://t.me/+79266763488" 
        target="_blank"
        className="relative w-10 h-10 transition-all duration-500 hover:scale-110 active:scale-90 group"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-[#37BBFE] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />

        <div className="relative w-full h-full flex items-center justify-center transition-transform group-hover:-rotate-6 drop-shadow-xl">
            <img src="/icons/telegram-svgrepo-com.svg" alt="Telegram" className="w-full h-full object-contain rounded-full shadow-lg" />
        </div>

        {/* Tooltip */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-white text-[#26A5E4] px-4 py-2 rounded-2xl text-[10px] font-black shadow-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap">
            Telegram канал
        </div>
      </Link>
    </div>
  );
};
