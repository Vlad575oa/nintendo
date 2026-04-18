"use client";

import { useState, useRef, useEffect } from "react";
import { Search as SearchIcon, ChevronDown, X, Loader2, History, TrendingUp, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { searchProductsAction } from "@/lib/actions";

const POPULAR_TAGS = ["PlayStation 5 Pro", "Xbox Series X", "Nintendo Switch OLED", "DualSense", "Elden Ring"];

const POPULAR_ITEMS = [
  { id: 1, name: "Sony PlayStation 5", category: "Консоли", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=200" },
  { id: 2, name: "Microsoft XBOX Series", category: "Консоли", image: "https://images.unsplash.com/photo-1621259182978-f09e5e2ca09a?q=80&w=200" },
  { id: 3, name: "Nintendo Switch", category: "Консоли", image: "https://images.unsplash.com/photo-1578303372704-14f2436099ae?q=80&w=200" },
];

export const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSearch = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await searchProductsAction(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(handleSearch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full z-50">
      {/* Ozon-style Search Bar */}
      <div className={cn(
        "flex items-center h-11 bg-white border-2 rounded-[14px] transition-all duration-300 overflow-hidden",
        isOpen ? "border-primary shadow-[0_0_0_4px_rgba(230,0,18,0.1)]" : "border-neutral-200"
      )}>
        {/* Category Selector */}
        <button className="flex items-center gap-1.5 px-4 h-full bg-neutral-50 hover:bg-neutral-100 border-r border-neutral-200 transition-colors group">
          <span className="text-[13px] font-bold text-secondary">Везде</span>
          <ChevronDown size={14} className="text-neutral-400 group-hover:text-secondary transition-colors" />
        </button>

        {/* Input Area */}
        <div className="flex-1 relative flex items-center px-3 h-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Искать в Nintendo Shop..."
            className="w-full bg-transparent border-none focus:ring-0 outline-none text-[14px] font-medium text-secondary ml-1 placeholder:text-neutral-400"
          />
          {query && (
            <button 
              onClick={() => setQuery("")} 
              className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors mr-1"
            >
              <X size={16} className="text-neutral-400" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <button className="flex items-center justify-center w-14 h-full bg-primary hover:bg-red-700 transition-all group shrink-0">
          {isLoading ? (
            <Loader2 size={20} className="text-white animate-spin" />
          ) : (
            <SearchIcon size={20} className="text-white group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* Ozon-style Dropdown */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-100 p-5 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          
          {/* Quick Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {POPULAR_TAGS.map((tag) => (
              <button 
                key={tag} 
                className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 rounded-full text-[11px] font-bold text-neutral-500 hover:text-secondary transition-all"
                onClick={() => setQuery(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-[10px] font-black text-secondary dark:text-white uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <TrendingUp size={12} className="text-primary" />
                {query.length >= 2 ? "Результаты поиска" : "Популярное"}
              </h3>
              
              <div className="grid grid-cols-1 gap-2">
                {(query.length >= 2 ? results : POPULAR_ITEMS).map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/catalog/${item.categorySlug || "any"}/${item.slug || ""}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all group relative overflow-hidden"
                  >
                    <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-100 dark:border-white/5 transition-transform group-hover:scale-105">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-secondary dark:text-white group-hover:text-primary transition-colors truncate">{item.name}</h4>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Раздел каталога</p>
                    </div>
                    <ChevronDown size={14} className="text-neutral-200 group-hover:text-primary -rotate-90 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </section>

            {query.length < 2 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-black text-secondary dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                            <History size={12} className="text-primary" />
                            История
                        </h3>
                        <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Очистить</button>
                    </div>
                    <div className="flex flex-col gap-1">
                        {["Sony PlayStation 5 Pro", "xbox", "Nintendo Switch 2"].map((history) => (
                            <button key={history} className="flex items-center justify-between p-3 text-xs font-bold text-neutral-500 hover:text-secondary hover:bg-neutral-50 dark:hover:bg-white/5 rounded-xl transition-all text-left group">
                                <div className="flex items-center gap-3">
                                    <History size={14} className="text-neutral-300 group-hover:text-primary" />
                                    <span>{history}</span>
                                </div>
                                <X size={14} className="text-neutral-200 hover:text-primary opacity-0 group-hover:opacity-100" />
                            </button>
                        ))}
                    </div>
                </section>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-white/5 space-y-6">
             <div className="flex flex-wrap gap-2">
                {[
                    "КУПИТЬ ШУТЕРЫ PLAYSTATION 5 PRO",
                    "КУПИТЬ ПРИКЛЮЧЕНЧЕСКИЕ ИГРЫ PLAYSTATION 5 PRO",
                    "КУПИТЬ РОЛЕВЫЕ ИГРЫ PLAYSTATION 5 PRO",
                ].map((tag) => (
                    <Link 
                        key={tag} 
                        href="/catalog/all" 
                        className="px-4 py-2 bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/10 rounded-full text-[9px] font-black text-secondary dark:text-neutral-400 uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
                    >
                        {tag}
                    </Link>
                ))}
             </div>

             <Link 
                href="/catalog/all" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center justify-center gap-2 w-full h-12 bg-neutral-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] hover:bg-primary hover:shadow-[0_12px_24px_var(--primary-glow)] transition-all"
             >
                Смотреть все результаты в каталоге
                <ArrowRight size={14} />
             </Link>
          </div>
        </div>
      )}
    </div>
  );
};
