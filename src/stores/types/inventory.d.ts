export interface Inventory {
  weapons: Array<string>;
  shields: Array<string>;
  armors: Array<string>;
  accessories: Array<string>;
  potions: Array<string>;
  books: Array<string>;
  scrolls: Array<string>;
  others: Array<string>;

}

export interface InventoryStore {
  inventories: Record<string, Inventory>; // Múltiples inventarios por ID
  checkIfIdExists: (playerInvId: string, category: keyof Inventory, id: string) => boolean;
  createInventory: (id: string) => void; // Crear un inventario nuevo
  addItemToInventory: (id: string, type: keyof Inventory, item: string) => void;
  removeItem: (id: string, type: keyof Inventory, item: string) => void;
  clearInventory: (id: string) => void;
}
