"use client";

import { Share2, Check, Copy } from "lucide-react";
import { useState } from "react";

const REACTIONS = [
  { emoji: "🔥", label: "Огонь" },
  { emoji: "🤩", label: "Восторг" },
  { emoji: "🤔", label: "Интересно" },
  { emoji: "👾", label: "Геймер" },
];

interface BlogShareBarProps {
  title: string;
  url: string;
}

export const BlogShareBar = ({ title, url }: BlogShareBarProps) => {
  const [picked, setPicked] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
      <div>
        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2 text-center md:text-left">
          Было полезно?
        </p>
        <div className="flex items-center gap-6 text-xl">
          {REACTIONS.map(({ emoji, label }) => (
            <button
              key={emoji}
              onClick={() => setPicked(emoji)}
              title={label}
              className={`transition-all duration-200 select-none ${
                picked === emoji
                  ? "scale-150 drop-shadow-lg"
                  : "hover:scale-125 opacity-70 hover:opacity-100"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
        {picked && (
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-2 text-center md:text-left animate-in fade-in slide-in-from-bottom-1">
            Спасибо за реакцию!
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-black text-secondary">Поделись инсайдом</p>
          <p className="text-[10px] text-neutral-400 font-bold">
            {copied ? "Ссылка скопирована!" : "1.2k репостов за неделю"}
          </p>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-3 px-6 py-3.5 bg-primary text-white rounded-[18px] font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          {copied ? <Check size={14} /> : <Share2 size={14} />}
          {copied ? "Скопировано" : "Отправить другу"}
        </button>
      </div>
    </div>
  );
};
