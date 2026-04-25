"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";



const QUICK_LINKS = [
  { label: "Все товары",        href: "/catalog/all",                  slug: "all" },
  { label: "Nintendo",          href: "/catalog/nintendo",             slug: "nintendo" },
  { label: "Nintendo Switch 2", href: "/catalog/nintendo-switch-2",    slug: "nintendo-switch-2" },
  { label: "Nintendo Switch",   href: "/catalog/nintendo-switch",      slug: "nintendo-switch" },
  { label: "PlayStation",       href: "/catalog/playstation",          slug: "playstation" },
  { label: "Xbox",              href: "/catalog/xbox",                 slug: "xbox" },
  { label: "Геймпады",          href: "/catalog/gamepads",             slug: "gamepads" },
  { label: "Аксессуары",        href: "/catalog/accessories",          slug: "accessories" },
];

export const QuickFilters = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [isDragging, setIsDragging]         = useState(false);
  const [startX, setStartX]                 = useState(0);
  const [scrollLeft, setScrollLeft]         = useState(0);
  const pathname     = usePathname();
  const searchParams = useSearchParams();

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
    return () => { el.removeEventListener("scroll", checkScroll); window.removeEventListener("resize", checkScroll); };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current; if (!el) return;
    setIsDragging(true); setStartX(e.pageX - el.offsetLeft); setScrollLeft(el.scrollLeft);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return; e.preventDefault();
    const el = scrollRef.current; if (!el) return;
    el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 2;
  };

  const scroll = (dir: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });



  // Active detection for regular links — match slug only (no query confusion)
  const isLinkActive = (item: typeof QUICK_LINKS[0]) => {
    return pathname === `/catalog/${item.slug}`;
  };

  const fadeCls = "absolute top-0 bottom-0 z-10 w-16 pointer-events-none flex items-center";

  return (
    <div className="sticky top-[68px] z-40 bg-[var(--bg-base)] border-b border-[var(--border)]">
      <div className="relative">
        {canScrollLeft && (
          <div className={cn(fadeCls, "left-0 bg-gradient-to-r from-[var(--bg-base)] to-transparent")}>
            <button onClick={() => scroll("left")} className="pointer-events-auto ml-2 w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center hover:shadow-md transition-all">
              <ChevronLeft size={13} className="text-neutral-500" />
            </button>
          </div>
        )}

        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={() => setIsDragging(false)}
          onMouseUp={() => setIsDragging(false)}
          onMouseMove={onMouseMove}
          className={cn("container flex items-center gap-1 overflow-x-auto no-scrollbar py-2 px-4 scroll-smooth", isDragging ? "cursor-grabbing select-none" : "cursor-default")}
        >


          {/* Category links — active = bold + underline dot, NOT red */}
          {QUICK_LINKS.map((item) => {
            const active = isLinkActive(item);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative text-[12px] whitespace-nowrap px-2.5 py-1.5 rounded-lg transition-all shrink-0 active:scale-95",
                  active
                    ? "font-black text-[var(--text-primary)]"
                    : "font-bold text-neutral-400 hover:text-[var(--text-secondary)] hover:bg-neutral-100"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {canScrollRight && (
          <div className={cn(fadeCls, "right-0 bg-gradient-to-l from-[var(--bg-base)] to-transparent justify-end")}>
            <button onClick={() => scroll("right")} className="pointer-events-auto mr-2 w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center hover:shadow-md transition-all">
              <ChevronRight size={13} className="text-neutral-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
