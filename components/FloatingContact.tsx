"use client";

import { Send } from "lucide-react";
import Link from "next/link";

export const FloatingContact = () => {
  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
      {/* Max Chat Button - Elite Upgrade */}
      <button className="relative w-12 h-12 transition-all duration-500 hover:scale-110 active:scale-90 group">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-[#9000FF] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
        
        <div className="relative w-full h-full bg-gradient-to-tr from-[#9000FF] to-[#B04BFF] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(144,0,255,0.3)] border border-white/20 group-hover:rotate-6 transition-transform">
            {/* The "MAX" Eye Icon - Refined to match original */}
            <div className="w-6 h-6 rounded-full border-[3.5px] border-white flex items-center justify-center relative">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                {/* Subtle outer ring */}
                <div className="absolute inset-[-6px] rounded-full border border-white/10" />
            </div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-white text-[#9000FF] px-4 py-2 rounded-2xl text-[10px] font-black shadow-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap">
            Чат с Max
        </div>
      </button>

      {/* Telegram Button - Elite Upgrade */}
      <Link 
        href="https://t.me/nintendo_shop" 
        target="_blank"
        className="relative w-12 h-12 transition-all duration-500 hover:scale-110 active:scale-90 group"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-[#26A5E4] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />

        <div className="relative w-full h-full bg-gradient-to-tr from-[#26A5E4] to-[#40B3E8] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(38,165,228,0.3)] border border-white/20 group-hover:-rotate-6 transition-transform">
            {/* Authentic Telegram Paper Plane SVG */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current transform translate-x-[-1px] translate-y-[0.5px]">
                <path d="M20.665 3.717l-17.73 6.837c-1.213.486-1.203 1.163-.222 1.467l4.552 1.42 1.12 7.728c.147 1.02.544 1.173 1.163.633l5.485-4.512 4.758 3.514c.875.482 1.503.233 1.722-.813l3.115-14.688c.32-1.282-.486-1.866-1.323-1.503z" />
            </svg>
        </div>

        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-white text-[#26A5E4] px-4 py-2 rounded-2xl text-[10px] font-black shadow-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap">
            Telegram канал
        </div>
      </Link>
    </div>
  );
};
