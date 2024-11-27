export interface Item {
    id: number;
    name: string;
    description?: string;
    cost: number;
}

export interface Items {
    weapons: Item[];
    armors: Item[];
    potions: Item[];
    books: Item[];
    scrolls: Item[];
    others: Item[];
}

export interface ItemsStore {
    items: Record<number, Items>; // El ID del inventario ahora es un número
    isInitialized: boolean, // Nuevo flag
    createItems: (id: number) => void;
    addItem: (id: number, type: keyof Items, item: Item) => void;
    removeItem: (id: number, type: keyof Items, itemId: number) => void;
    clearItems: (id: number) => void;
}
