"use client";

import { useCartStore } from "@/features/cart/store/useCartStore";
import { ShoppingCart, Search, Menu, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="container px-6 h-20 flex items-center justify-between">
        {/* Mobile Menu */}
        <button className="lg:hidden p-2 text-neutral-600">
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl italic">N</span>
          </div>
          <span className="text-xl font-black text-secondary tracking-tighter uppercase hidden sm:block">
            Nintendo <span className="text-primary">Shop</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 ml-12">
          <Link href="/catalog/playstation" className="text-sm font-bold text-neutral-600 hover:text-primary transition-colors">PlayStation</Link>
          <Link href="/catalog/xbox" className="text-sm font-bold text-neutral-600 hover:text-primary transition-colors">Xbox</Link>
          <Link href="/catalog/nintendo" className="text-sm font-bold text-neutral-600 hover:text-primary transition-colors">Nintendo</Link>
          <Link href="/catalog/accessories" className="text-sm font-bold text-neutral-600 hover:text-primary transition-colors">Аксессуары</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto lg:ml-0">
          <button className="p-2 text-neutral-600 hover:bg-neutral-50 rounded-full transition-colors hidden sm:block">
            <Search size={20} />
          </button>
          
          <Link href="/auth/login" className="p-2 text-neutral-600 hover:bg-neutral-50 rounded-full transition-colors">
            <User size={20} />
          </Link>

          <Link href="/cart" className="relative group p-2 bg-neutral-50 hover:bg-primary/5 rounded-full transition-all">
            <ShoppingCart size={20} className="text-secondary group-hover:text-primary transition-colors" />
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
