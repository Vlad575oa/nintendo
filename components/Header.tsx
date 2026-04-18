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
    <header className="sticky top-0 z-50 glass h-[84px] flex items-center transition-all duration-300">
      <div className="container px-4 flex items-center gap-4 xl:gap-8">
        
        {/* Logo - Sleek & Modern */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-[0_8px_20px_var(--primary-glow)] transition-all group-hover:scale-105 active:scale-95 overflow-hidden relative">
            <span className="text-white font-black text-2xl italic leading-none ml-0.5 z-10 select-none">N</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          </div>
          <div className="hidden lg:flex flex-col leading-none -space-y-0.5">
            <span className="text-[10px] font-black text-neutral-400/80 uppercase tracking-[0.2em] mb-0.5">Premium Store</span>
            <span className="text-[17px] font-black text-secondary tracking-tighter uppercase dark:text-white">
                Nintendo<span className="text-primary italic">.</span>Shop
            </span>
          </div>
        </Link>

        {/* Catalog Button - Refined */}
        <button className="hidden lg:flex items-center gap-2 px-6 h-11 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-tighter shadow-xl shadow-black/5 hover:bg-primary hover:shadow-[0_8px_20px_var(--primary-glow)] transition-all group shrink-0">
          <Menu size={18} className="transition-transform group-hover:rotate-90" />
          <span>Каталог</span>
        </button>

        {/* Central Search Bar */}
        <div className="flex-1 min-w-[300px] max-w-3xl">
          <Search />
        </div>

        {/* Action Icons Panel */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Auth Area */}
          <div className="relative" ref={menuRef}>
            {mounted && user ? (
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl hover:bg-neutral-100/50 transition-all group"
              >
                <div className="relative">
                    <User size={22} className="text-secondary dark:text-neutral-400 group-hover:text-primary transition-colors" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-neutral-900 shadow-sm" />
                </div>
                <span className="text-[9px] font-black text-neutral-400/80 uppercase tracking-widest mt-2 group-hover:text-secondary truncate max-w-full px-1">
                    {user.name?.split(' ')[0] ?? "Профиль"}
                </span>
                
                {/* User Dropdown */}
                {userMenuOpen && (
                    <div className="absolute top-[calc(100%+12px)] right-0 w-64 glass rounded-[24px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] p-2 z-[60] animate-in fade-in slide-in-from-top-2">
                         <div className="px-4 py-4 mb-2 bg-neutral-900 rounded-2xl">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">Личный кабинет</p>
                            <p className="text-sm font-black text-white mt-1.5 truncate">{user.name ?? user.email}</p>
                        </div>
                        <ul className="space-y-1">
                            <li>
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100/50 dark:hover:bg-white/5 rounded-xl transition-all">
                                    <Package size={16} className="text-neutral-400" />
                                    Мои заказы
                                </button>
                            </li>
                            <li>
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100/50 dark:hover:bg-white/5 rounded-xl transition-all">
                                    <Heart size={16} className="text-neutral-400" />
                                    Избранное
                                </button>
                            </li>
                            <li className="pt-2 border-t border-neutral-100 dark:border-white/5">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-primary hover:bg-primary/5 rounded-xl transition-all"
                                >
                                    <LogOut size={16} />
                                    Выход
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
              </button>
            ) : (
                <Link 
                    href="/auth/login"
                    className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl hover:bg-neutral-100/50 transition-all group"
                >
                    <User size={22} className="text-secondary dark:text-neutral-400 group-hover:text-primary transition-colors" />
                    <span className="text-[9px] font-black text-neutral-400/80 uppercase tracking-widest mt-2 group-hover:text-secondary">Войти</span>
                </Link>
            )}
          </div>

          {/* Orders Link */}
          <Link 
            href="/orders" 
            className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-2xl hover:bg-neutral-100/50 transition-all group"
          >
            <Package size={22} className="text-secondary dark:text-neutral-400 group-hover:text-primary transition-colors" />
            <span className="text-[9px] font-black text-neutral-400/80 uppercase tracking-widest mt-2 group-hover:text-secondary">Заказы</span>
          </Link>

          {/* Cart with Premium Badge */}
          <Link 
            href="/cart" 
            className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl hover:bg-neutral-100/50 transition-all group relative bg-neutral-50 dark:bg-white/5"
          >
            <div className="relative">
                <ShoppingCart size={22} className="text-secondary dark:text-neutral-300 group-hover:text-primary transition-colors" />
                {mounted && totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-neutral-900 shadow-lg shadow-primary/20 animate-in zoom-in h-[16px] flex items-center justify-center">
                        {totalItems}
                    </span>
                )}
            </div>
            <span className="text-[9px] font-black text-neutral-400/80 uppercase tracking-widest mt-2 group-hover:text-secondary">Корзина</span>
          </Link>

        </div>
      </div>
    </header>
  );
};
