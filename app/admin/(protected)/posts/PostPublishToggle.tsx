"use client";

import { useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { togglePostPublishAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  postId: number;
  isPublished: boolean;
}

export function PostPublishToggle({ postId, isPublished }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await togglePostPublishAction(postId);
      if (result.success) {
        router.refresh();
      } else {
        alert("Ошибка: " + result.error);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={isPublished ? "Скрыть (в черновик)" : "Опубликовать"}
      className={cn(
        "w-8 h-8 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center",
        isPublished 
          ? "bg-green-50 border-green-100 text-green-600 hover:bg-green-100 hover:border-green-200" 
          : "bg-neutral-50 border-neutral-200 text-neutral-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50"
      )}
    >
      {isPending ? (
        <Loader2 size={13} className="animate-spin" />
      ) : isPublished ? (
        <Eye size={13} />
      ) : (
        <EyeOff size={13} />
      )}
    </button>
  );
}
