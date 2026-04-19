import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 4;

interface CompareStore {
  ids: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  has: (id: number) => boolean;
  clear: () => void;
  count: () => number;
  isFull: () => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) =>
        set((s) => {
          if (s.ids.includes(id) || s.ids.length >= MAX_COMPARE) return s;
          return { ids: [...s.ids, id] };
        }),
      remove: (id) => set((s) => ({ ids: s.ids.filter((i) => i !== id) })),
      toggle: (id) => {
        const { ids } = get();
        if (ids.includes(id)) {
          set({ ids: ids.filter((i) => i !== id) });
        } else if (ids.length < MAX_COMPARE) {
          set({ ids: [...ids, id] });
        }
      },
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
      count: () => get().ids.length,
      isFull: () => get().ids.length >= MAX_COMPARE,
    }),
    { name: "nintendo-compare" }
  )
);
