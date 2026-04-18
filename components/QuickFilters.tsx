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
    <div className="sticky top-[72px] z-40 bg-[var(--bg-base)] border-b border-[var(--bg-elevated)]">
      <div className="relative group/nav">
        {/* Left Scroll Gradient & Button */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 z-10 w-24 pointer-events-none bg-gradient-to-r from-[var(--bg-base)] via-[var(--bg-base)]/80 to-transparent flex items-center pr-8">
            <button
              onClick={() => scroll("left")}
              className="pointer-events-auto ml-2 w-8 h-8 rounded-full neu-btn flex items-center justify-center hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={16} className="text-[var(--text-primary)]" />
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

          {/* Special colored pills */}
          {SPECIAL_FILTERS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all shrink-0 active:scale-95 hover:brightness-95",
                item.color
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-neutral-100 shrink-0 mx-1" />

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
                  "text-[12px] font-bold whitespace-nowrap px-3 py-1.5 rounded-lg transition-all shrink-0 active:scale-95",
                  isActive
                    ? "bg-primary text-white"
                    : "text-neutral-500 hover:text-secondary hover:bg-neutral-50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Scroll Gradient & Button */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 z-10 w-24 pointer-events-none bg-gradient-to-l from-[var(--bg-base)] via-[var(--bg-base)]/80 to-transparent flex items-center justify-end pl-8">
            <button
              onClick={() => scroll("right")}
              className="pointer-events-auto mr-2 w-8 h-8 rounded-full neu-btn flex items-center justify-center hover:scale-110 active:scale-95"
            >
              <ChevronRight size={16} className="text-[var(--text-primary)]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

