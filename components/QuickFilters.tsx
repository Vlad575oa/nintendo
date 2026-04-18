"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const pathname = usePathname();

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
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

  // Mouse Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeft(el.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    el.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({ 
      left: direction === "left" ? -scrollAmount : scrollAmount, 
      behavior: "smooth" 
    });
  };

  return (
    <div className="sticky top-[84px] z-40 glass border-b border-neutral-100 dark:border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all">
      <div className="relative group/nav">
        {/* Left Scroll Gradient & Button */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 z-10 w-24 pointer-events-none bg-gradient-to-r from-white via-white/80 to-transparent flex items-center pr-8">
            <button
              onClick={() => scroll("left")}
              className="pointer-events-auto ml-2 w-8 h-8 rounded-full bg-white border border-neutral-100 shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-all hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={16} className="text-secondary" />
            </button>
          </div>
        )}

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={cn(
            "container flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5 transition-all scroll-smooth px-4",
            isDragging ? "cursor-grabbing select-none scroll-auto" : "cursor-grab"
          )}
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch"
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Special colored pills - Elite Upgrade */}
          {SPECIAL_FILTERS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-full text-[11px] font-black whitespace-nowrap transition-all shrink-0 active:scale-95 hover:shadow-lg hover:-translate-y-0.5",
                item.color
              )}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}

          {/* Divider */}
          <div className="w-[1px] h-6 bg-neutral-100 dark:bg-white/10 shrink-0 mx-3" />

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
                  "text-[10px] font-bold uppercase tracking-widest whitespace-nowrap px-4 py-2 rounded-xl transition-all shrink-0 active:scale-95",
                  isActive
                    ? "bg-primary text-white shadow-xl shadow-primary/20"
                    : "text-neutral-500 hover:text-secondary dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Scroll Gradient & Button */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 z-10 w-24 pointer-events-none bg-gradient-to-l from-white via-white/80 to-transparent flex items-center justify-end pl-8">
            <button
              onClick={() => scroll("right")}
              className="pointer-events-auto mr-2 w-8 h-8 rounded-full bg-white border border-neutral-100 shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-all hover:scale-110 active:scale-95"
            >
              <ChevronRight size={16} className="text-secondary" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

