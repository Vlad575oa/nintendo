"use client";

import { useCartStore } from "@/features/cart/store/useCartStore";
import { useWishlistStore } from "@/features/product/store/useWishlistStore";
import { useCompareStore } from "@/features/product/store/useCompareStore";
import { ShoppingCart, Menu, User, LogOut, Package, Heart, Scale } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search } from "@/features/search/components/Search";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CatalogMegaMenu } from "./CatalogMegaMenu";

interface CurrentUser {
  id: number;
  name?: string | null;
  email?: string | null;
}

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const totalItems = useCartStore((state) => state.totalItems());
  const clearCart = useCartStore((s) => s.clearCart);
  const wishlistCount = useWishlistStore((s) => s.count());
  const clearWishlist = useWishlistStore((s) => s.clear);
  const compareCount = useCompareStore((s) => s.count());
  const clearCompare = useCompareStore((s) => s.clear);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me").then((r) => r.json()).then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserMenuOpen(false);
    clearCart();
    clearWishlist();
    clearCompare();
    router.refresh();
  };

  const iconBtn = "flex flex-col items-center justify-center w-12 h-12 rounded-xl hover:bg-white/[0.07] transition-all group relative";
  const iconLabel = "text-[7.5px] font-black text-white/30 uppercase tracking-wide mt-1 group-hover:text-white/60 transition-colors text-center";

  return (
    <header className="sticky top-0 z-50 h-[68px] flex items-center bg-[#2c2c30] border-b border-white/[0.07] relative" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.25)" }}>
      <div className="container px-4 flex items-center gap-2 xl:gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-[0_4px_14px_rgba(230,0,18,0.35)] transition-all group-hover:scale-105 active:scale-95 overflow-hidden relative">
            <span className="text-white font-black text-lg italic leading-none z-10 select-none">N</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/25 to-white/10" />
          </div>
          <div className="hidden lg:flex flex-col leading-none">
            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Premium Store</span>
            <span className="text-[15px] font-black text-white tracking-tighter uppercase leading-tight">
              Nintendo<span className="text-primary italic">.</span>Shop
            </span>
          </div>
        </Link>

        {/* Catalog */}
        <button
          onClick={() => setMegaMenuOpen((v) => !v)}
          className={cn(
            "hidden lg:flex items-center gap-2 px-4 h-9 border rounded-xl font-black text-[12px] uppercase tracking-tight transition-all group shrink-0",
            megaMenuOpen
              ? "bg-white/15 border-white/20 text-white"
              : "bg-white/[0.06] border-white/[0.08] text-white/70 hover:bg-white/10 hover:text-white hover:border-white/15"
          )}
        >
          <Menu size={14} className={cn("transition-transform duration-200", megaMenuOpen && "rotate-90")} />
          <span>Каталог</span>
        </button>
        {megaMenuOpen && <CatalogMegaMenu onClose={() => setMegaMenuOpen(false)} />}



        {/* Search */}
        <div className="flex-1 min-w-[150px] max-w-2xl">
          <Search />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Auth */}
          <div className="relative" ref={menuRef}>
            {mounted && user ? (
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className={iconBtn}>
                <div className="relative">
                  <User size={18} className="text-white/50 group-hover:text-white transition-colors" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full ring-2 ring-[#2c2c30]" />
                </div>
                <span className={iconLabel}>{user.name?.split(" ")[0] ?? "Профиль"}</span>
                {userMenuOpen && (
                  <div className="absolute top-[calc(100%+6px)] right-0 w-56 rounded-2xl shadow-2xl p-1.5 z-[60] animate-in fade-in slide-in-from-top-2 bg-[#242428] border border-white/[0.08]">
                    <div className="px-4 py-3 mb-1 rounded-xl bg-white/[0.04]">
                      <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Личный кабинет</p>
                      <p className="text-sm font-black text-white mt-1 truncate">{user.name ?? user.email}</p>
                    </div>
                    <ul className="space-y-0.5">
                      <li>
                        <Link href="/account/orders" className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                          <Package size={14} className="text-white/25" /> Мои заказы
                        </Link>
                      </li>
                      <li>
                        <Link href="/wishlist" className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                          <Heart size={14} className="text-white/25" /> Избранное
                        </Link>
                      </li>
                      <li className="pt-1 border-t border-white/[0.06]">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-xl transition-all">
                          <LogOut size={14} /> Выход
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </button>
            ) : (
              <Link href="/auth/login" className={iconBtn}>
                <User size={18} className="text-white/50 group-hover:text-white transition-colors" />
                <span className={iconLabel}>Войти</span>
              </Link>
            )}
          </div>

          {/* Wishlist */}
          <Link href="/wishlist" className={cn(iconBtn, "hidden sm:flex")}>
            <div className="relative">
              <Heart size={18} className={cn("transition-colors", mounted && wishlistCount > 0 ? "text-red-400 fill-red-400" : "text-white/50 group-hover:text-white")} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] font-black min-w-[14px] h-[14px] px-1 rounded-full ring-2 ring-[#2c2c30] flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className={iconLabel}>Избранное</span>
          </Link>

          {/* Compare */}
          <Link href="/compare" className={cn(iconBtn, "hidden sm:flex")}>
            <div className="relative">
              <Scale size={18} className={cn("transition-colors", mounted && compareCount > 0 ? "text-blue-400" : "text-white/50 group-hover:text-white")} />
              {mounted && compareCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-blue-500 text-white text-[8px] font-black min-w-[14px] h-[14px] px-1 rounded-full ring-2 ring-[#2c2c30] flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </div>
            <span className={iconLabel}>Сравнить</span>
          </Link>

          {/* Cart */}
          <Link href="/cart" className={cn(iconBtn, "ml-1 bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:border-primary/35")}>
            <div className="relative">
              <ShoppingCart size={18} className={cn("transition-colors", mounted && totalItems > 0 ? "text-primary" : "text-white/50 group-hover:text-primary")} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[8px] font-black min-w-[14px] h-[14px] px-1 rounded-full ring-2 ring-[#2c2c30] shadow-lg shadow-primary/30 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className={cn(iconLabel, "group-hover:text-primary")}>Корзина</span>
          </Link>

        </div>
      </div>
    </header>
  );
};
