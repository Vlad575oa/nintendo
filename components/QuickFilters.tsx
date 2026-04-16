"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SPECIAL_FILTERS = [
  {
    label: "Скидки",
    icon: "🔥",
    href: "/catalog/all?sale=true",
    color: "bg-orange-100 text-orange-600 hover:bg-orange-200",
  },
  {
    label: "Подарочные сертификаты",
    icon: "🎁",
    href: "/catalog/accessories",
    color: "bg-sky-100 text-sky-600 hover:bg-sky-200",
  },
  {
    label: "Новинки",
    icon: "✨",
    href: "/catalog/all?sort=newest",
    color: "bg-pink-100 text-pink-600 hover:bg-pink-200",
  },
];

const QUICK_LINKS = [
  { label: "Игровые приставки", href: "/catalog/all" },
  { label: "PS5", href: "/catalog/playstation" },
  { label: "PS5 Pro", href: "/catalog/playstation?q=PS5+Pro" },
  { label: "PS5 Slim", href: "/catalog/playstation?q=PS5+Slim" },
  { label: "Xbox Series X", href: "/catalog/xbox?q=Series+X" },
  { label: "Xbox Series S", href: "/catalog/xbox?q=Series+S" },
  { label: "Nintendo Switch", href: "/catalog/nintendo" },
  { label: "Steam Deck", href: "/catalog/all?q=Steam+Deck" },
  { label: "Стационарные консоли", href: "/catalog/all" },
  { label: "Портативные консоли", href: "/catalog/nintendo" },
  { label: "Геймпады", href: "/catalog/accessories" },
  { label: "Гарнитуры", href: "/catalog/accessories" },
];

export const QuickFilters = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="sticky top-[84px] z-40 bg-white border-b border-neutral-100 shadow-sm">
      <div className="relative">
        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="container flex items-center gap-2 overflow-x-auto scrollbar-none py-2.5 pr-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Special colored pills */}
          {SPECIAL_FILTERS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all shrink-0",
                item.color
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-neutral-200 shrink-0 mx-1" />

          {/* Regular text links */}
          {QUICK_LINKS.map((item) => {
            const isActive =
              pathname === new URL(item.href, "http://x").pathname &&
              (item.href.includes("?") ? false : true);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-[13px] font-bold whitespace-nowrap px-2 py-1.5 rounded-lg transition-all shrink-0",
                  isActive
                    ? "text-primary"
                    : "text-neutral-600 hover:text-secondary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Scroll right button */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center bg-gradient-to-l from-white via-white/90 to-transparent"
          >
            <ChevronRight size={18} className="text-neutral-400" />
          </button>
        )}
      </div>
    </div>
  );
};
