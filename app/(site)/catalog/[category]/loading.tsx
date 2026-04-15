export default function Loading() {
  return (
    <div className="container py-12 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-64 space-y-8">
          <div className="h-8 bg-neutral-100 rounded-full w-32" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-neutral-50 rounded-full w-full" />
            ))}
          </div>
        </aside>
        <div className="flex-1">
          <div className="flex justify-between mb-8">
            <div className="space-y-2">
              <div className="h-10 bg-neutral-100 rounded-xl w-64" />
              <div className="h-4 bg-neutral-50 rounded-full w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-50 rounded-[32px]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
