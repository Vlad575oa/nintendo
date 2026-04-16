const KEY = "nintendo_recently_viewed";
const MAX_ITEMS = 12;

export function useRecentlyViewed() {
  const getIds = (): number[] => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {
      return [];
    }
  };

  const addId = (id: number) => {
    if (typeof window === "undefined") return;
    const ids = getIds().filter((v) => v !== id);
    ids.unshift(id);
    localStorage.setItem(KEY, JSON.stringify(ids.slice(0, MAX_ITEMS)));
  };

  return { getIds, addId };
}
