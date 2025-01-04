import { create } from 'zustand';
import { InventoryStore } from './types/inventory';

const useInventoryStore = create<InventoryStore>((set) => ({
  inventories: {},
  createInventory: (id) =>
    set((state) => {
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
      if (!inventory) return state;
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
  removeItem: (id, type, itemId) =>
    set((state) => {
      const inventory = state.inventories[id];
      if (!inventory) return state;
      const itemIndex = inventory[type].findIndex((i) => i === itemId);
      if (itemIndex === -1) return state;
      const updatedItems = [...inventory[type]];
      updatedItems.splice(itemIndex, 1);

      return {
        inventories: {
          ...state.inventories,
          [id]: {
            ...inventory,
            [type]: updatedItems,
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
