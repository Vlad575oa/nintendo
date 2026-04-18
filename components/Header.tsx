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
    <header className="sticky top-0 z-50 glass-dark h-[72px] flex items-center transition-all duration-300">
      <div className="container px-4 flex items-center gap-4 xl:gap-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-[0_6px_16px_var(--primary-glow)] transition-all group-hover:scale-105 active:scale-95 overflow-hidden relative">
            <span className="text-white font-black text-xl italic leading-none ml-0.5 z-10 select-none">N</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          </div>
          <div className="hidden lg:flex flex-col leading-none -space-y-0.5">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">Premium Store</span>
            <span className="text-[16px] font-black text-white tracking-tighter uppercase">
                Nintendo<span className="text-primary italic">.</span>Shop
            </span>
          </div>
        </Link>

        {/* Catalog Button */}
        <button className="hidden lg:flex items-center gap-2 px-5 h-10 bg-white/10 text-white/90 rounded-xl font-bold text-[13px] uppercase tracking-tight border border-white/10 hover:bg-primary hover:border-primary hover:shadow-[0_6px_16px_var(--primary-glow)] transition-all group shrink-0">
          <Menu size={16} className="transition-transform group-hover:rotate-90" />
          <span>Каталог</span>
        </button>

        {/* Central Search Bar */}
        <div className="flex-1 min-w-[280px] max-w-3xl">
          <Search />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          
          {/* Auth Area */}
          <div className="relative" ref={menuRef}>
            {mounted && user ? (
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-white/10 transition-all group"
              >
                <div className="relative">
                    <User size={20} className="text-white/70 group-hover:text-white transition-colors" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full ring-2 ring-black/50 shadow-sm" />
                </div>
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1.5 group-hover:text-white/80 truncate max-w-full px-1">
                    {user.name?.split(' ')[0] ?? "Профиль"}
                </span>
                
                {/* User Dropdown */}
                {userMenuOpen && (
                    <div className="absolute top-[calc(100%+8px)] right-0 w-60 glass rounded-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)] p-1.5 z-[60] animate-in fade-in slide-in-from-top-2">
                         <div className="px-4 py-3 mb-1 bg-[var(--bg-base)] rounded-xl">
                            <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest leading-none">Личный кабинет</p>
                            <p className="text-sm font-black text-[var(--text-primary)] mt-1 truncate">{user.name ?? user.email}</p>
                        </div>
                        <ul className="space-y-0.5">
                            <li>
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-base)] rounded-xl transition-all">
                                    <Package size={15} className="text-[var(--text-muted)]" />
                                    Мои заказы
                                </button>
                            </li>
                            <li>
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-base)] rounded-xl transition-all">
                                    <Heart size={15} className="text-[var(--text-muted)]" />
                                    Избранное
                                </button>
                            </li>
                            <li className="pt-1 border-t border-[var(--bg-elevated)]">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/5 rounded-xl transition-all"
                                >
                                    <LogOut size={15} />
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
                    className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-white/10 transition-all group"
                >
                    <User size={20} className="text-white/70 group-hover:text-white transition-colors" />
                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1.5 group-hover:text-white/80">Войти</span>
                </Link>
            )}
          </div>

          {/* Orders Link */}
          <Link 
            href="/orders" 
            className="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-white/10 transition-all group"
          >
            <Package size={20} className="text-white/70 group-hover:text-white transition-colors" />
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1.5 group-hover:text-white/80">Заказы</span>
          </Link>

          {/* Cart */}
          <Link 
            href="/cart" 
            className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-white/10 transition-all group relative bg-white/5"
          >
            <div className="relative">
                <ShoppingCart size={20} className="text-white/80 group-hover:text-white transition-colors" />
                {mounted && totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-black/40 shadow-lg shadow-primary/20 animate-in zoom-in h-[14px] flex items-center justify-center">
                        {totalItems}
                    </span>
                )}
            </div>
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1.5 group-hover:text-white/80">Корзина</span>
          </Link>

        </div>
      </div>
    </header>
  );
};
