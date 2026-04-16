"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Thumbnails */}
      <div className="flex flex-col gap-3 w-20 overflow-y-auto no-scrollbar py-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all p-1 bg-white flex-shrink-0",
              activeIndex === i ? "border-primary shadow-md" : "border-neutral-100 hover:border-neutral-300"
            )}
          >
            <Image
              src={img}
              alt={`${name} thumb ${i}`}
              fill
              className="object-contain p-1"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative bg-white border border-neutral-100 rounded-[40px] overflow-hidden group">
        <Image
          src={images[activeIndex] || "/placeholder.jpg"}
          alt={name}
          fill
          className="object-contain p-10"
          priority
        />
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevImage}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 border border-neutral-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm transition-all active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 border border-neutral-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm transition-all active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>

        {/* Badge (Optional) */}
        <div className="absolute top-6 left-6 flex gap-2">
            <span className="px-3 py-1 bg-[#e60012] text-white text-[10px] font-black uppercase rounded-full shadow-lg">New</span>
        </div>
      </div>
    </div>
  );
}
