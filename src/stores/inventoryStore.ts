import { create } from 'zustand';
import { InventoryStore } from './types/inventory';

const useInventoryStore = create<InventoryStore>((set) => ({
    inventories: {}, 
    createInventory: (id) => set((state) => {
        return {
            inventories: {
                ...state.inventories,
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

    // Agregar un ítem al inventario de un ID específico
    addItem: (id, type, item) =>
        set((state) => {
            const inventory = state.inventories[id];
            if (!inventory) return state; // Si no existe, no hacer nada
            return {
                inventories: {
                    ...state.inventories,
                    [id]: {
                        ...inventory,
                        [type]: [...inventory[type], item],
                    },
                },
            };
        }),

    // Eliminar un ítem del inventario de un ID específico
    removeItem: (id, type, item) =>
        set((state) => {
            const inventory = state.inventories[id];
            if (!inventory) return state; // Si no existe, no hacer nada
            return {
                inventories: {
                    ...state.inventories,
                    [id]: {
                        ...inventory,
                        [type]: inventory[type].filter((i) => i !== item),
                    },
                },
            };
        }),

    // Limpiar un inventario específico
    clearInventory: (id) =>
        set((state) => {
            if (!state.inventories[id]) return state; // Si no existe, no hacer nada
            return {
                inventories: {
                    ...state.inventories,
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

export default useInventoryStore;
