"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ProductHideButton({ productId, isVisible }: { productId: number; isVisible: boolean }) {
  const [visible, setVisible] = useState(isVisible);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const toggle = () => {
    const next = !visible;
    setVisible(next);
    startTransition(async () => {
      await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: next }),
      });
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={pending}
      title={visible ? "Скрыть товар" : "Показать товар"}
      className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
        visible
          ? "bg-neutral-50 border-neutral-200 text-neutral-400 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50"
          : "bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100"
      }`}
    >
      {visible ? <Eye size={13} /> : <EyeOff size={13} />}
    </button>
  );
}
