export interface Item {
  id: string;
  name: string;
  description?: string;
  armorValue?: number;
  damage?: string;
  img?: string;
  cost: number;
  levelRequirement?: number;
  deleteable?: boolean;
  color?: string;
}

export interface Items {
  weapons: Item[];
  armors: Item[];
  accessories: Item[];
  potions: Item[];
  books: Item[];
  scrolls: Item[];
  others: Item[];
}

export interface ItemsStore {
  items: Record<number, Items>; // El ID del inventario ahora es un número
  isInitialized: boolean; // Nuevo flag
  createItems: (id: number) => void;
  addItem: (id: number, type: keyof Items, item: Item) => void;
  removeItem: (id: number, type: keyof Items, itemId: string) => void;
  clearItems: (id: number) => void;
  removeItems: () => void;
}
