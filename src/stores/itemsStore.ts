import { create } from 'zustand';
import { ItemsStore } from './types/items';

const useItemsStore = create<ItemsStore>((set, get) => ({
  items: {},
  isInitialized: false,
  createItems: (id) =>
    set((state) => {
      if (get().isInitialized) return state;
      return {
        ...state,
        items: {
          ...state.items,
          [id]: {
            weapons: [],
            armors: [],
            potions: [],
            books: [],
            scrolls: [],
            others: [],
          },
        },
        isInitialized: true, // Marcamos como inicializado
      };
    }),

  addItem: (id, type, item) =>
    set((state) => {
      const itemSet = state.items[id];
      if (!itemSet) return state;
      return {
        items: {
          ...state.items,
          [id]: {
            ...itemSet,
            [type]: [...itemSet[type], item],
          },
        },
      };
    }),

  removeItem: (id, type, itemId) =>
    set((state) => {
      const itemSet = state.items[id];
      if (!itemSet) return state;
      return {
        items: {
          ...state.items,
          [id]: {
            ...itemSet,
            [type]: itemSet[type].filter((item) => item.id !== itemId),
          },
        },
      };
    }),

  clearItems: (id) =>
    set((state) => {
      if (!state.items[id]) return state;
      return {
        items: {
          ...state.items,
          [id]: {
            weapons: [],
            armors: [],
            potions: [],
            books: [],
            scrolls: [],
            others: [],
          },
        },
      };
    }),
}));

export default useItemsStore;
