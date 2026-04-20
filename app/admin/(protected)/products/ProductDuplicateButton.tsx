"use client";

import { useTransition } from "react";
import { Copy, Loader2 } from "lucide-react";
import { duplicateProductAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Props {
  productId: number;
}

export function ProductDuplicateButton({ productId }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDuplicate = () => {
    if (confirm("Вы уверены, что хотите создать копию этого товара?")) {
      startTransition(async () => {
        const result = await duplicateProductAction(productId);
        if (result.success) {
          router.refresh();
        } else {
          alert("Ошибка: " + result.error);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDuplicate}
      disabled={isPending}
      title="Дублировать"
      className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-green-600 hover:border-green-200 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      {isPending ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Copy size={13} className="group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
}
