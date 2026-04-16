"use client";

import { useState, useRef, useEffect } from "react";
import { Search as SearchIcon, ChevronDown, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { searchProductsAction } from "@/lib/actions";

const POPULAR_ITEMS = [
  { id: 1, name: "Sony PlayStation 5", category: "Консоли", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=200" },
  { id: 2, name: "Microsoft XBOX Series", category: "Консоли", image: "https://images.unsplash.com/photo-1621259182978-f09e5e2ca09a?q=80&w=200" },
  { id: 3, name: "Nintendo Switch", category: "Консоли", image: "https://images.unsplash.com/photo-1578303372704-14f2436099ae?q=80&w=200" },
  { id: 4, name: "Valve Steam Deck", category: "Консоли", image: "https://images.unsplash.com/photo-1643482755502-3f1103233b21?q=80&w=200" },
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

  const displayItems = query.length >= 2 ? results : POPULAR_ITEMS;
  const title = query.length >= 2 ? `Результаты для "${query}"` : "Популярное";

  return (
    <div ref={containerRef} className={cn(
        "relative transition-all duration-300 z-50",
        isOpen ? "flex-[2] max-w-2xl" : "flex-1 max-w-md mx-8"
    )}>
      {/* Search Bar Container */}
      <div className={cn(
        "flex items-center bg-neutral-50 px-3 py-2 rounded-2xl border transition-all duration-300",
        isOpen ? "border-primary bg-white ring-8 ring-primary/5 shadow-lg" : "border-transparent"
      )}>
        {!isOpen && (
            <button className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl border border-neutral-100 text-[10px] font-black uppercase tracking-tight text-secondary hover:bg-neutral-50 transition-all mr-2 whitespace-nowrap animate-in fade-in slide-in-from-left-2">
                <span>Везде</span>
                <ChevronDown size={10} className="text-neutral-400" />
            </button>
        )}

        <div className="flex-1 relative flex items-center">
            {isOpen && (
                isLoading ? <Loader2 size={16} className="text-primary mr-3 animate-spin" /> : <SearchIcon size={16} className="text-primary mr-3 animate-in zoom-in duration-300" />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder={isOpen ? "Что вы ищете?" : "Искать в Nintendo Shop..."}
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-neutral-400 placeholder:font-normal"
            />
            {isOpen && query && (
                <button onClick={() => setQuery("")} className="p-1 hover:bg-neutral-100 rounded-full transition-colors mr-1">
                    <X size={14} className="text-neutral-400" />
                </button>
            )}
        </div>

        {!isOpen && (
            <div className="flex items-center ml-2 border-l border-neutral-200 pl-3">
                <SearchIcon size={18} className="text-neutral-400" />
            </div>
        )}
      </div>

      {/* Dropdown Window */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-[32px] shadow-2xl border border-neutral-100 p-6 animate-in fade-in zoom-in-95 duration-200 min-h-[100px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-secondary uppercase tracking-tight">{title}</h3>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-neutral-50 rounded-full transition-colors">
                <X size={20} className="text-neutral-300" />
            </button>
          </div>

          <div className="space-y-4">
            {displayItems.length > 0 ? (
              displayItems.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/catalog/${item.categorySlug || "any"}/${item.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 transition-all group"
                >
                  <div className="flex-1 mr-4">
                    <h4 className="text-sm font-bold text-secondary group-hover:text-primary transition-colors line-clamp-1">{item.name}</h4>
                    <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider mt-0.5">{item.category}</p>
                  </div>
                  <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                </Link>
              ))
            ) : (
                <div className="py-8 text-center">
                    <p className="text-sm font-medium text-neutral-400">Ничего не найдено :(</p>
                </div>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-neutral-50">
             <Link href="/catalog/all" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                Перейти в весь каталог
             </Link>
          </div>
        </div>
      )}
    </div>
  );
};
