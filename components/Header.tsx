"use client";

import { useCartStore } from "@/features/cart/store/useCartStore";
import { ShoppingCart, Menu, User, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search } from "@/features/search/components/Search";
import { useRouter } from "next/navigation";

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
    // Fetch current auth state
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data))
      .catch(() => {});
  }, []);

  // Close menu on outside click
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="container px-6 h-20 flex items-center">
        {/* Mobile Menu */}
        <button className="lg:hidden p-2 text-neutral-600 mr-4">
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl italic">N</span>
          </div>
          <span className="text-xl font-black text-secondary tracking-tighter uppercase hidden xl:block">
            Nintendo <span className="text-primary">Shop</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 ml-8 mr-4 shrink-0">
          <Link
            href="/catalog/playstation"
            className="text-sm font-bold text-neutral-600 hover:text-primary transition-colors"
          >
            PlayStation
          </Link>
          <Link
            href="/catalog/xbox"
            className="text-sm font-bold text-neutral-600 hover:text-primary transition-colors"
          >
            Xbox
          </Link>
          <Link
            href="/catalog/nintendo"
            className="text-sm font-bold text-neutral-600 hover:text-primary transition-colors"
          >
            Nintendo
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 justify-center">
          <Search />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-4">
          {/* Auth area */}
          {mounted && user ? (
            <div className="relative hidden sm:block" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={14} className="text-primary" />
                </div>
                <span className="text-sm font-bold text-secondary max-w-[100px] truncate">
                  {user.name ?? user.email ?? "Профиль"}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-neutral-300 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-neutral-100 shadow-xl shadow-neutral-100/50 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-neutral-50">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Аккаунт
                    </p>
                    <p className="text-sm font-black text-secondary mt-0.5 truncate">
                      {user.name ?? user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-neutral-500 hover:bg-neutral-50 hover:text-secondary transition-colors"
                  >
                    <LogOut size={16} />
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="p-2 text-neutral-600 hover:bg-neutral-50 rounded-full transition-colors hidden sm:flex items-center gap-2"
            >
              <User size={20} />
              <span className="text-sm font-bold hidden lg:block">Войти</span>
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative group p-2 bg-neutral-50 hover:bg-primary/5 rounded-full transition-all"
          >
            <ShoppingCart
              size={20}
              className="text-secondary group-hover:text-primary transition-colors"
            />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-white text-[10px] font-black rounded-full ring-4 ring-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
