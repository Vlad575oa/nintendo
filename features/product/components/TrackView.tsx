"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/features/product/hooks/useRecentlyViewed";

export function TrackView({ productId }: { productId: number }) {
  const { addId } = useRecentlyViewed();

  useEffect(() => {
    addId(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return null;
}
