"use client";

import { useEffect, useState } from "react";
import { Eye, TrendingUp } from "lucide-react";

export function SocialProof({ productId }: { productId: number }) {
  const [viewers, setViewers] = useState(0);
  const [sold, setSold] = useState(0);

  useEffect(() => {
    // Deterministic but "random-looking" values based on productId
    const base = (productId * 17 + 3) % 19;
    setViewers(base + 4);
    setSold((productId * 7 + 11) % 40 + 12);
  }, [productId]);

  if (!viewers) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-full">
        <Eye size={12} className="text-orange-500" />
        <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">
          {viewers} смотрят сейчас
        </span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full">
        <TrendingUp size={12} className="text-green-600" />
        <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">
          Продано {sold}+ шт
        </span>
      </div>
    </div>
  );
}
