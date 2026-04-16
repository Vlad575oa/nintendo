"use client";

import { useCartStore } from "@/features/cart/store/useCartStore";
import { ShoppingCart, Menu, User, LogOut, ChevronDown, Package, Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search } from "@/features/search/components/Search";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CurrentUser {
  id: number;
  name?: string | null;
  email?: string | null;
}

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const totalItems = useCartStore((state) => state.totalItems());
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserMenuOpen(false);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100 h-[84px] flex items-center shadow-sm">
      <div className="container px-4 flex items-center gap-4 xl:gap-8">
        
        {/* Logo - Sleek & Modern */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-11 h-11 bg-primary rounded-[14px] flex items-center justify-center shadow-[0_5px_15px_rgba(230,0,18,0.25)] transition-all group-hover:scale-105 active:scale-95 overflow-hidden relative">
            <span className="text-white font-black text-2xl italic leading-none ml-0.5 z-10">N</span>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-black/10 transition-transform group-hover:translate-y-full" />
          </div>
          <div className="hidden lg:flex flex-col leading-none -space-y-0.5">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-0.5">Official</span>
            <span className="text-[17px] font-black text-secondary tracking-tighter uppercase">
                Nintendo<span className="text-primary italic">.</span>Shop
            </span>
          </div>
        </Link>

        {/* Ozon-style Catalog Button */}
        <button className="hidden lg:flex items-center gap-2 px-6 h-11 bg-primary hover:bg-red-700 text-white rounded-[14px] font-black text-sm uppercase tracking-tighter shadow-[0_5px_15px_rgba(230,0,18,0.2)] transition-all group shrink-0">
          <Menu size={18} className="transition-transform group-hover:rotate-90" />
          <span>Каталог</span>
        </button>

        {/* Central Search Bar - Ozon Style Integration */}
        <div className="flex-1 min-w-[300px] max-w-3xl">
          <Search />
        </div>

        {/* Action Icons Panel - Ozon Style with Labels */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Auth Area */}
          <div className="relative" ref={menuRef}>
            {mounted && user ? (
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl hover:bg-neutral-50 transition-all group"
              >
                <div className="relative">
                    <User size={24} className="text-secondary group-hover:text-primary transition-colors" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
                </div>
                <span className="text-[10px] font-bold text-neutral-400 mt-1.5 transition-colors group-hover:text-secondary truncate max-w-full px-1">
                    {user.name?.split(' ')[0] ?? "Профиль"}
                </span>
                
                {/* User Dropdown */}
                {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-2 z-[60] animate-in fade-in slide-in-from-top-2">
                         <div className="px-3 py-3 mb-2 bg-neutral-50 rounded-xl">
                            <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-none">Личный кабинет</p>
                            <p className="text-sm font-black text-secondary mt-1 truncate">{user.name ?? user.email}</p>
                        </div>
                        <ul className="space-y-1">
                            <li>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 rounded-xl transition-all">
                                    <Package size={16} />
                                    Мои заказы
                                </button>
                            </li>
                            <li>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-50 rounded-xl transition-all">
                                    <Heart size={16} />
                                    Избранное
                                </button>
                            </li>
                            <li className="pt-2 border-t border-neutral-50">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <LogOut size={16} />
                                    Выйти из профиля
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
              </button>
            ) : (
                <Link 
                    href="/auth/login"
                    className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl hover:bg-neutral-50 transition-all group"
                >
                    <User size={24} className="text-secondary group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-bold text-neutral-400 mt-1.5 transition-colors group-hover:text-secondary">Войти</span>
                </Link>
            )}
          </div>

          {/* Orders / History Link */}
          <Link 
            href="/orders" 
            className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-2xl hover:bg-neutral-50 transition-all group"
          >
            <Package size={24} className="text-secondary group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-bold text-neutral-400 mt-1.5 transition-colors group-hover:text-secondary">Заказы</span>
          </Link>

          {/* Cart with Ozon style Badge */}
          <Link 
            href="/cart" 
            className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl hover:bg-neutral-100 transition-all group relative"
          >
            <div className="relative">
                <ShoppingCart size={24} className="text-secondary group-hover:text-primary transition-colors" />
                {mounted && totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white animate-in zoom-in h-[15px] flex items-center justify-center">
                        {totalItems}
                    </span>
                )}
            </div>
            <span className="text-[10px] font-bold text-neutral-400 mt-1.5 transition-colors group-hover:text-secondary">Корзина</span>
          </Link>

        </div>
      </div>
    </header>
  );
};
