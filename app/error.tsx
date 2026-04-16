"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-32 text-center">
      <h2 className="text-4xl font-black text-secondary mb-4">Упс! Что-то пошло не так.</h2>
      <p className="text-neutral-500 mb-8 max-w-md mx-auto">
        Произошла ошибка при загрузке страницы. Попробуйте обновить её или вернуться позже.
      </p>
      <div className="flex justify-center gap-4">
        <Button variant="primary" onClick={() => reset()}>
          Попробовать снова
        </Button>
        <Button variant="secondary" onClick={() => window.location.href = "/"}>
          На главную
        </Button>
      </div>
    </div>
  );
}
