import { create } from 'zustand';
import { Items, ItemsStore } from './types/items';

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
            accessories: [],
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
            accessories: [],
            others: [],
          },
        },
      };
    }),
    removeItems: () =>
      set((state) => {
        const updatedItems = Object.fromEntries(
          Object.entries(state.items).map(([id, itemSet]) => {
            const filteredItemSet: Items = {
              weapons: itemSet.weapons.filter((item) => !item.deleteable),
              armors: itemSet.armors.filter((item) => !item.deleteable),
              potions: itemSet.potions.filter((item) => !item.deleteable),
              books: itemSet.books.filter((item) => !item.deleteable),
              scrolls: itemSet.scrolls.filter((item) => !item.deleteable),
              others: itemSet.others.filter((item) => !item.deleteable),
              accessories: itemSet.accessories.filter((item) => !item.deleteable),
            };
            return [id, filteredItemSet];
          })
        );
    
        return {
          items: updatedItems,
        };
      }),
    
}));

export default useItemsStore;
