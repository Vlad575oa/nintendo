"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface SubLink {
  label: string;
  href: string;
  badge?: string;
}

interface PlatformGroup {
  title: string;
  href: string;
  emoji: string;
  color: string;
  links: SubLink[];
}

const PLATFORMS: PlatformGroup[][] = [
  // Column 1 — PlayStation
  [
    {
      title: "PlayStation 5",
      href: "/catalog/ps5",
      emoji: "🎮",
      color: "bg-blue-50 text-blue-600",
      links: [
        { label: "Консоли PS5", href: "/catalog/ps5" },
        { label: "PS5 Pro", href: "/catalog/ps5-pro" },
        { label: "PS5 Slim", href: "/catalog/ps5-slim" },
        { label: "Аксессуары PS5", href: "/catalog/accessories?q=ps5" },
      ],
    },
    {
      title: "PlayStation 4",
      href: "/catalog/playstation",
      emoji: "🕹️",
      color: "bg-blue-50 text-blue-500",
      links: [
        { label: "Консоли PS4", href: "/catalog/playstation" },
        { label: "Аксессуары PS4", href: "/catalog/accessories?q=ps4" },
      ],
    },
  ],
  // Column 2 — Nintendo (PRIORITY)
  [
    {
      title: "Nintendo Switch 2",
      href: "/catalog/nintendo-switch-2",
      emoji: "⚡",
      color: "bg-red-50 text-red-500",
      links: [
        { label: "Консоли Switch 2", href: "/catalog/nintendo-switch-2", badge: "NEW" },
        { label: "Аксессуары Switch 2", href: "/catalog/accessories?q=switch2" },
      ],
    },
    {
      title: "Nintendo Switch",
      href: "/catalog/nintendo-switch",
      emoji: "🔴",
      color: "bg-red-50 text-red-400",
      links: [
        { label: "Консоли Switch", href: "/catalog/nintendo-switch" },
        { label: "Switch OLED", href: "/catalog/nintendo-switch-oled" },
        { label: "Switch Lite", href: "/catalog/nintendo-switch-lite" },
        { label: "Аксессуары Switch", href: "/catalog/accessories?q=switch" },
      ],
    },
  ],
  // Column 3 — Xbox
  [
    {
      title: "Xbox Series X/S",
      href: "/catalog/xbox",
      emoji: "🎯",
      color: "bg-green-50 text-green-600",
      links: [
        { label: "Xbox Series X", href: "/catalog/xbox-series-x" },
        { label: "Xbox Series S", href: "/catalog/xbox-series-s" },
        { label: "Аксессуары Xbox", href: "/catalog/accessories?q=xbox" },
        { label: "Game Pass", href: "/catalog/accessories?q=gamepass" },
      ],
    },
    {
      title: "Xbox One",
      href: "/catalog/xbox",
      emoji: "🎲",
      color: "bg-green-50 text-green-500",
      links: [
        { label: "Консоли Xbox One", href: "/catalog/xbox" },
        { label: "Аксессуары Xbox One", href: "/catalog/accessories?q=xbox-one" },
      ],
    },
  ],
  // Column 4 — Other
  [
    {
      title: "Steam Deck",
      href: "/catalog/steam-deck",
      emoji: "💻",
      color: "bg-purple-50 text-purple-600",
      links: [
        { label: "Консоли Steam Deck", href: "/catalog/steam-deck" },
        { label: "Аксессуары Steam Deck", href: "/catalog/accessories?q=steamdeck" },
      ],
    },
    {
      title: "Аксессуары",
      href: "/catalog/accessories",
      emoji: "🛒",
      color: "bg-orange-50 text-orange-500",
      links: [
        { label: "Все аксессуары", href: "/catalog/accessories" },
        { label: "Геймпады", href: "/catalog/gamepads" },
        { label: "Подарочные карты", href: "/catalog/accessories?q=card" },
      ],
    },
  ],
];

interface CatalogMegaMenuProps {
  onClose: () => void;
}

export function CatalogMegaMenu({ onClose }: CatalogMegaMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 top-[68px] bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-150" onClick={onClose} />

      {/* Panel */}
      <div
        ref={ref}
        className="absolute left-0 right-0 top-full z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <div className="bg-white border-b border-neutral-100 shadow-2xl">
          <div className="container px-4 py-8">

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-6 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-400 transition-all"
            >
              <X size={14} />
            </button>

            <div className="grid grid-cols-4 gap-8">
              {PLATFORMS.map((column, colIdx) => (
                <div
                  key={colIdx}
                  className={`space-y-8 ${column.some((group) => group.href === "/catalog/nintendo") ? "bg-red-50/40 rounded-2xl p-4 -m-4 border border-red-100/60" : ""}`}
                >
                  {column.map((group) => (
                    <div key={group.title}>
                      {/* Platform Header */}
                      <Link
                        href={group.href}
                        onClick={onClose}
                        className="flex items-center gap-2.5 mb-3 group"
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${group.color}`}>
                          {group.emoji}
                        </div>
                        <span className="font-black text-[13px] text-secondary group-hover:text-primary transition-colors">
                          {group.title}
                        </span>
                      </Link>

                      {/* Subcategory links */}
                      <ul className="space-y-1.5 pl-1">
                        {group.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              onClick={onClose}
                              className="flex items-center gap-2 text-[12px] font-bold text-neutral-400 hover:text-primary transition-colors"
                            >
                              <span className="w-1 h-1 rounded-full bg-neutral-200 shrink-0" />
                              {link.label}
                              {link.badge && (
                                <span className="ml-1 px-1.5 py-0.5 bg-primary text-white text-[8px] font-black rounded-full uppercase tracking-wide">
                                  {link.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
