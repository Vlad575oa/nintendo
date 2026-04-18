"use client";

import { Send } from "lucide-react";
import Link from "next/link";

export const FloatingContact = () => {
  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
      {/* Max Chat Button */}
      <button className="relative w-12 h-12 transition-all duration-500 hover:scale-110 active:scale-90 group">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-[#9000FF] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
        
        <div className="relative w-full h-full bg-[#9000FF] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(144,0,255,0.3)] border-2 border-white/10 group-hover:rotate-6 transition-transform">
            {/* The "O" looking icon from screenshot */}
            <div className="w-7 h-7 rounded-full border-[4px] border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-white text-[#9000FF] px-4 py-2 rounded-2xl text-[10px] font-black shadow-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap">
            Чат с Max
        </div>
      </button>

      {/* Telegram Button */}
      <Link 
        href="https://t.me/nintendo_shop" 
        target="_blank"
        className="relative w-12 h-12 transition-all duration-500 hover:scale-110 active:scale-90 group"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-[#26A5E4] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />

        <div className="relative w-full h-full bg-[#26A5E4] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(38,165,228,0.3)] border-2 border-white/10 group-hover:-rotate-6 transition-transform">
            <Send size={20} fill="white" className="text-white ml-0.5 mt-0.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-white text-[#26A5E4] px-4 py-2 rounded-2xl text-[10px] font-black shadow-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap">
            Telegram канал
        </div>
      </Link>
    </div>
  );
};
