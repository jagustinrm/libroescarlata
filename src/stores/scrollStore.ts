import { create } from 'zustand';
import { ScrollStore } from './types/scrolls';

const useScrollStore = create<ScrollStore>((set) => ({
  scrolls: [],
  areScrollsLoaded: false,
  setScrolls: (scrolls) => {
    console.log(scrolls)
    set({ scrolls, areScrollsLoaded: true });
  },
  addNewScroll: (newScroll) =>
    set((state) => ({
      scrolls: [...state.scrolls, newScroll],
    })),
  removeScroll: (id) =>
    set((state) => {
      const scrollIndex = state.scrolls.findIndex((scroll) => scroll.id === id);
      if (scrollIndex !== -1) {
        const updatedScrolls = [...state.scrolls];
        updatedScrolls.splice(scrollIndex, 1); // Elimina solo un scroll
        return { scrolls: updatedScrolls };
      }
      return state; // Si no se encuentra el scroll, no se actualiza el estado
    }),
  updateScroll: (updatedScroll) =>
    set((state) => {
      const existingScrollIndex = state.scrolls.findIndex(
        (s) => s.id === updatedScroll.id,
      );

      if (existingScrollIndex >= 0) {
        const updatedScrolls = [...state.scrolls];
        updatedScrolls[existingScrollIndex] = updatedScroll;
        return { scrolls: updatedScrolls };
      }

      return { scrolls: [...state.scrolls, updatedScroll] };
    }),
}));

export default useScrollStore;
