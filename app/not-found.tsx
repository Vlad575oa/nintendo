import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative inline-block mb-8">
          <span className="text-[120px] font-black text-neutral-100 leading-none select-none">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
              <span className="text-white font-black text-3xl italic">N</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-black text-secondary mb-3">Страница не найдена</h1>
        <p className="text-neutral-400 font-medium mb-8 leading-relaxed">
          Возможно, ссылка устарела или страница была перемещена.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-8 py-3.5 bg-primary text-white rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            На главную
          </Link>
          <Link
            href="/catalog/all"
            className="px-8 py-3.5 bg-neutral-100 text-secondary rounded-2xl font-black hover:bg-neutral-200 transition-all"
          >
            В каталог
          </Link>
        </div>
      </div>
    </div>
  );
}
