"use client";

import { useEffect, useState, useRef } from "react";
import { useRecentlyViewed } from "@/features/product/hooks/useRecentlyViewed";
import { ProductCard } from "@/features/product/components/ProductCard";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  priceOld?: number | null;
  images: string[];
  isNew?: boolean;
  isSale?: boolean;
  inStock?: boolean;
  category?: { slug: string; name: string };
}

export function RecentlyViewed() {
  const { getIds } = useRecentlyViewed();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Scroll logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const ids = getIds();
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    fetch(`/api/products/recent?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading || products.length === 0) return null;

  const categorySet = new Map<string, string>();
  products.forEach((p) => {
    if (p.category) categorySet.set(p.category.slug, p.category.name);
  });
  const tabs = [
    { label: "Все категории", slug: null },
    ...Array.from(categorySet.entries()).map(([slug, name]) => ({ label: name, slug })),
  ];

  const filtered = activeSlug ? products.filter((p) => p.category?.slug === activeSlug) : products;

  return (
    <section className="mt-28 relative group/section">
      <div className="flex items-end justify-between mb-8 px-4">
        <div>
          <h2 className="text-3xl font-black text-neutral-900 leading-tight">Вы просматривали</h2>
          <p className="text-neutral-500 mt-2">Товары, которые вас заинтересовали</p>
        </div>
        
        {/* Navigation Arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center text-secondary hover:bg-neutral-50 active:scale-95 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center text-secondary hover:bg-neutral-50 active:scale-95 transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {tabs.length > 2 && (
        <div className="flex items-center gap-2 mb-6 px-4 overflow-x-auto no-scrollbar">
          {tabs.map(({ label, slug }) => (
            <button
              key={String(slug)}
              onClick={() => setActiveSlug(slug)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                activeSlug === slug
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="px-4 overflow-hidden">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={cn(
            "flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar cursor-grab active:cursor-grabbing select-none",
            isDragging && "snap-none"
          )}
        >
          {filtered.map((product) => (
            <div key={product.id} className="min-w-[240px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
