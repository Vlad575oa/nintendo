"use client";

import { useState, useRef, useEffect } from "react";
import { Search as SearchIcon, ChevronDown, X, Loader2, History, TrendingUp } from "lucide-react";
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
              <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp size={12} />
                {query.length >= 2 ? "Результаты поиска" : "Популярные товары"}
              </h3>
              
              <div className="space-y-1">
                {(query.length >= 2 ? results : POPULAR_ITEMS).map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/catalog/${item.categorySlug || "any"}/${item.slug || ""}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-neutral-50 transition-all group"
                  >
                    <div className="w-11 h-11 relative rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-secondary group-hover:text-primary transition-colors truncate">{item.name}</h4>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{item.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {query.length < 2 && (
                <section>
                    <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <History size={12} />
                        История поиска
                    </h3>
                    <div className="flex flex-col">
                        {["DualSense Edge", "Switch 2", "Xbox Controller"].map((history) => (
                            <button key={history} className="flex items-center gap-3 p-2.5 text-xs font-bold text-neutral-500 hover:text-secondary hover:bg-neutral-50 rounded-xl transition-all text-left">
                                <SearchIcon size={12} className="text-neutral-300" />
                                {history}
                            </button>
                        ))}
                    </div>
                </section>
            )}
          </div>
          
          <div className="mt-6 pt-5 border-t border-neutral-50">
             <Link href="/" onClick={() => setIsOpen(false)} className="block text-center text-xs font-black text-primary uppercase tracking-[0.1em] hover:text-red-700 transition-colors">
                Смотреть все результаты в каталоге
             </Link>
          </div>
        </div>
      )}
    </div>
  );
};
