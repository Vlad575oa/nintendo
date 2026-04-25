"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";

interface Props {
  currentCategory: string;
  totalCount: number;
  categoryTree: any;
  activeFilterCount: number;
}

export const MobileFilterDrawer = ({ currentCategory, totalCount, categoryTree, activeFilterCount }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-[11px] font-black uppercase tracking-widest text-neutral-600 hover:border-primary/30 hover:text-primary transition-all active:scale-95"
      >
        <SlidersHorizontal size={13} />
        Фильтры
        {activeFilterCount > 0 && (
          <span className="bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-[55] lg:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-x-0 bottom-0 z-[60] lg:hidden bg-white rounded-t-[28px] shadow-2xl max-h-[85dvh] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Handle + header */}
            <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-neutral-100 shrink-0">
              <div className="w-10 h-1 bg-neutral-200 rounded-full absolute top-3 left-1/2 -translate-x-1/2" />
              <p className="text-sm font-black text-[#111827] mt-2">Фильтры</p>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors mt-2">
                <X size={14} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-2 pb-6">
              <FilterSidebar
                currentCategory={currentCategory}
                totalCount={totalCount}
                categoryTree={categoryTree}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
