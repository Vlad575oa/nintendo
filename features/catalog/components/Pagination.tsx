"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span
            key={`ellipsis-${index}`}
            className="w-10 h-10 flex items-center justify-center text-neutral-400 font-bold"
          >
            ...
          </span>
        );
      }

      const isActive = currentPage === page;

      return (
        <Link
          key={page}
          href={createPageURL(page)}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-xl font-black transition-all duration-300",
            isActive
              ? "bg-primary text-white shadow-xl shadow-primary/30"
              : "text-neutral-500 hover:bg-neutral-100"
          )}
        >
          {page}
        </Link>
      );
    });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      {currentPage > 1 && (
        <Link
          href={createPageURL(currentPage - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft size={20} />
        </Link>
      )}

      <div className="flex items-center gap-1">{renderPageNumbers()}</div>

      {currentPage < totalPages && (
        <Link
          href={createPageURL(currentPage + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-95 shadow-sm"
        >
          <ChevronRight size={20} />
        </Link>
      )}
    </div>
  );
}
