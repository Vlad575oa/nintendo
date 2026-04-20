"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? nextImage() : prevImage();
    touchStartX.current = null;
  };

  if (!images.length) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 h-auto md:h-[540px] lg:h-[600px]">

      {/* Thumbnails — horizontal on mobile, vertical on desktop */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto no-scrollbar py-1 md:w-20 shrink-0">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative aspect-square w-14 h-14 md:w-full md:h-auto md:aspect-square rounded-xl overflow-hidden border-2 transition-all p-1 bg-white flex-shrink-0",
              activeIndex === i ? "border-primary shadow-md" : "border-neutral-100 hover:border-neutral-300"
            )}
          >
            <Image src={img} alt={`${name} thumb ${i}`} fill className="object-contain p-1" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div
        className="flex-1 relative bg-white border border-neutral-100 rounded-[24px] md:rounded-[40px] overflow-hidden group h-[300px] sm:h-[380px] md:h-full"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={images[activeIndex] || "/placeholder.jpg"}
          alt={name}
          fill
          className="object-contain p-6 md:p-10"
          priority
        />

        {/* Navigation Arrows — always visible on mobile, hover on desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 border border-neutral-100 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all shadow-sm active:scale-95"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 border border-neutral-100 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all shadow-sm active:scale-95"
              aria-label="Следующее фото"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dot indicators — mobile only */}
        {images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 md:hidden pointer-events-none">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full transition-all",
                  i === activeIndex ? "w-4 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-neutral-300"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
