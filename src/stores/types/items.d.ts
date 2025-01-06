import { Accessory } from "./accesories";
import { Armor } from "./armor";

export interface Item {
  id: string;
  name: string;
  description?: string;
  armorValue?: number;
  damage?: string | number;
  img?: string;
  cost: number;
  levelRequirement?: number;
  deleteable?: boolean;
  color?: string;
}

export interface Items {
  weapons: Weapon[];
  armors: Armor[];
  accessories: Accessory[];
  potions: Potion[];
  books: Item[];
  scrolls: Item[];
  others: Item[];
}

export interface ItemsStore {
  items: Record<number, Items>; // El ID del inventario ahora es un número
  isInitialized: boolean; // Nuevo flag
  createItems: (id: number) => void;
  addItem: (id: number, type: keyof Items, item: Item | Weapons | Accessory | Armor) => void;
  removeItem: (id: number, type: keyof Items, itemId: string) => void;
  clearItems: (id: number) => void;
  removeItems: () => void;
}
