import { Accessory } from './accesories';
import { Armor } from './armor';
import { Book } from './books';
import { otherItem } from './otherItems';
import { Potion } from './potions';
import { Scroll } from './scrolls';

export interface generalItem {
  repeatable?: boolean
  playerOwner?: boolean
}

export type Item =
  | Weapon
  | Armor
  | Scroll
  | Accessory
  | Potion
  | Book
  | otherItem;

export interface Items {
  weapons: Weapon[];
  armors: Armor[];
  accessories: Accessory[];
  potions: Potion[];
  books: Book[];
  scrolls: Scroll[];
  others: otherItem[];
}

export interface ItemsStore {
  items: Record<string, Items>; // El ID del inventario ahora es un número
  isInitialized: boolean; // Nuevo flag
  createItems: (id: number) => void;
  addItem: (
    id: number,
    type: keyof Items,
    item: Item,
  ) => void;
  removeItemFromStore: (id: number, type: keyof Items, itemId: string) => void;
  clearItems: (id: number) => void;
  removeItems: () => void;
}
