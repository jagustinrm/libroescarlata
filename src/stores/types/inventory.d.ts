
export interface Inventory {
    weapons: Array<string>;
    armors: Array<string>;
    potions: Array<string>;
    books: Array<string>;
    scrolls: Array<string>;
    others: Array<string>;
}

export interface InventoryStore {
    inventories: Record<string, Inventory>; // Múltiples inventarios por ID
    
    createInventory: (id: string) => void; // Crear un inventario nuevo
    addItem: (id: string, type: keyof Inventory, item: string) => void;
    removeItem: (id: string, type: keyof Inventory, item: string) => void;
    clearInventory: (id: string) => void;
}
