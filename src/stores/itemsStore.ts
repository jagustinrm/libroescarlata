import { create } from 'zustand';
import { ItemsStore } from './types/items';

const useItemsStore = create<ItemsStore>((set) => ({
    items: {},

    createItems: (id) =>
        set((state) => ({
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
        })),

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
