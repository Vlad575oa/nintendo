"use client";

import { useState, type ReactNode } from "react";
import {
  FileText, ListChecks, MessageSquare,
  Cpu, HardDrive, Monitor, Wifi, Volume2,
  Zap, Shield, Package, Star
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
  description: string | null;
  attributes: Record<string, string> | null;
  productName: string;
}

// Map keywords → icon for attribute rows
const ATTR_ICONS: Record<string, ReactNode> = {
  "процессор": <Cpu size={14} />,
  "видеокарта": <Monitor size={14} />,
  "графика": <Monitor size={14} />,
  "накопитель": <HardDrive size={14} />,
  "диск": <HardDrive size={14} />,
  "память": <HardDrive size={14} />,
  "wi-fi": <Wifi size={14} />,
  "подключение": <Wifi size={14} />,
  "звук": <Volume2 size={14} />,
  "разрешение": <Monitor size={14} />,
  "частота кадров": <Zap size={14} />,
  "гарантия": <Shield size={14} />,
  "платформа": <Package size={14} />,
};

function getAttrIcon(key: string): ReactNode {
  const lk = key.toLowerCase();
  for (const [kw, icon] of Object.entries(ATTR_ICONS)) {
    if (lk.includes(kw)) return icon;
  }
  return <Star size={14} />;
}

/* Groups attributes by leading category detected from common naming */
function groupAttributes(attrs: Record<string, string>) {
  const GROUPS: Record<string, string[]> = {
    "Производительность": ["Процессор", "Графика", "Оперативная память", "Частота кадров", "FPS"],
    "Хранение": ["Накопитель", "Диск", "SSD", "HDD"],
    "Дисплей & Звук": ["Разрешение", "HDR", "Звук", "Dolby"],
    "Подключение": ["Подключение", "Wi-Fi", "Bluetooth", "USB", "Ethernet", "HDMI"],
    "Прочее": [],
  };

  const result: Record<string, Array<[string, string]>> = {
    "Производительность": [],
    "Хранение": [],
    "Дисплей & Звук": [],
    "Подключение": [],
    "Прочее": [],
  };

  for (const [key, val] of Object.entries(attrs)) {
    let placed = false;
    for (const [group, keywords] of Object.entries(GROUPS)) {
      if (group === "Прочее") continue;
      if (keywords.some((kw) => key.toLowerCase().includes(kw.toLowerCase()))) {
        result[group].push([key, val]);
        placed = true;
        break;
      }
    }
    if (!placed) result["Прочее"].push([key, val]);
  }

  // Remove empty groups
  return Object.fromEntries(Object.entries(result).filter(([, v]) => v.length > 0));
}

const TABS = [
  { id: "description", label: "Описание", icon: <FileText size={15} /> },
  { id: "specs",       label: "Характеристики", icon: <ListChecks size={15} /> },
  { id: "reviews",     label: "Отзывы", icon: <MessageSquare size={15} /> },
] as const;

type TabId = typeof TABS[number]["id"];

export function ProductTabs({ description, attributes, productName }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  const groups = attributes ? groupAttributes(attributes) : {};
  const totalAttrs = Object.values(groups).flat().length;

  return (
    <div className="mt-12">
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 bg-neutral-100 p-1 rounded-2xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.id
                ? "bg-white text-secondary shadow-sm"
                : "text-neutral-400 hover:text-secondary"
            )}
          >
            <span className={activeTab === tab.id ? "text-primary" : "text-neutral-300"}>
              {tab.icon}
            </span>
            {tab.label}
            {tab.id === "specs" && totalAttrs > 0 && (
              <span className={cn(
                "text-[9px] font-black px-1.5 py-0.5 rounded-full",
                activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-neutral-200 text-neutral-400"
              )}>
                {totalAttrs}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Description ─────────────────────────────────────────────── */}
      {activeTab === "description" && (
        <div className="animate-in fade-in duration-200">
          {description ? (
            <div
              className="prose prose-neutral max-w-none
                prose-headings:font-black prose-headings:text-secondary
                prose-p:text-neutral-600 prose-p:leading-relaxed prose-p:text-sm
                prose-strong:text-secondary prose-strong:font-black
                prose-li:text-neutral-600 prose-li:text-sm
                prose-ul:space-y-1
              "
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <div className="bg-neutral-50 rounded-3xl p-10 text-center">
              <FileText size={32} className="text-neutral-200 mx-auto mb-3" />
              <p className="text-neutral-400 font-bold">Описание товара пока не добавлено</p>
            </div>
          )}
        </div>
      )}

      {/* ── Specifications ─────────────────────────────────────────── */}
      {activeTab === "specs" && (
        <div className="animate-in fade-in duration-200">
          {totalAttrs > 0 ? (
            <div className="space-y-6">
              {Object.entries(groups).map(([group, items]) => (
                <div key={group}>
                  {/* Group heading */}
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">{group}</h3>
                    <div className="flex-1 h-px bg-neutral-100" />
                  </div>

                  {/* Attribute rows */}
                  <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
                    {items.map(([key, val], idx) => (
                      <div
                        key={key}
                        className={cn(
                          "flex items-start gap-4 px-5 py-3.5",
                          idx !== items.length - 1 && "border-b border-neutral-50"
                        )}
                      >
                        {/* Icon + Key */}
                        <div className="flex items-center gap-2 w-[120px] sm:w-[200px] shrink-0">
                          <span className="text-neutral-300">{getAttrIcon(key)}</span>
                          <span className="text-[12px] font-bold text-neutral-400 leading-snug">{key}</span>
                        </div>
                        {/* Value */}
                        <span className="text-[13px] font-black text-secondary leading-snug flex-1">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-3xl p-10 text-center">
              <ListChecks size={32} className="text-neutral-200 mx-auto mb-3" />
              <p className="text-neutral-400 font-bold">Характеристики не указаны</p>
            </div>
          )}
        </div>
      )}

      {/* ── Reviews (placeholder) ──────────────────────────────────── */}
      {activeTab === "reviews" && (
        <div className="animate-in fade-in duration-200">
          <div className="bg-neutral-50 rounded-3xl p-12 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={24} className="text-orange-300 fill-orange-200" />
              ))}
            </div>
            <h3 className="text-lg font-black text-secondary mb-2">Отзывов пока нет</h3>
            <p className="text-neutral-400 font-medium text-sm mb-6">
              Будьте первым, кто оstavит отзыв о товаре
            </p>
            <button className="px-6 py-3 bg-primary text-white font-black rounded-2xl text-sm hover:bg-red-700 transition-all shadow-lg shadow-primary/20">
              Написать отзыв
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
