import { useEffect } from "react";
import { getItemsByCategory } from "../../utils/getItemsByCategory"; // Ajusta la ruta según tu proyecto
import { Item } from "../../stores/types/items";
import { Inventory } from "../../stores/types/inventory";

interface UseFilteredInventoryEffectProps {
  actualCategory: keyof Inventory;
  inventory: Inventory;
  setActualInventory: (items: [Item, number][]) => void; // Ahora maneja un array de tuplas [Item, cantidad]
  handleSelectItem: (item: Item, setSelectedItem: (item: Item) => void) => void;
  setSelectedItem: (item: Item) => void;
}

const useFilteredInventoryEffect = ({ 
  actualCategory, 
  inventory, 
  setActualInventory, 
  handleSelectItem, 
  setSelectedItem 
}: UseFilteredInventoryEffectProps) => {
  useEffect(() => {
    if (!actualCategory || !inventory[actualCategory]) return;

    const itemMap = new Map<string, { item: Item; count: number }>();
    
    getItemsByCategory(actualCategory, inventory[actualCategory] ?? []).forEach((item) => {
        // Si el item tiene repeatable como true, solo agregamos una instancia y contamos repeticiones
        if (item.repeatable) {
          if (itemMap.has(item.name)) {

            itemMap.get(item.name)!.count += 1; // Incrementa el contador si ya existe
          } else {
            itemMap.set(item.name, { item, count: 1 }); // Agrega el ítem con count = 1
          }
        } else {
          // Si no es repeatable, lo agregamos siempre sin incrementar el contador
          itemMap.set(item.id, { item, count: 1 }); // Siempre agrega el ítem con count = 1
        }
      });

    // Convertir el Map en un array de tuplas [Item, cantidad]
    const filteredItems: [Item, number][] = Array.from(itemMap.values()).map(({ item, count }) => [item, count]);

    setActualInventory(filteredItems);

    // Seleccionar automáticamente el primer ítem si hay cambios
    if (filteredItems.length > 0) {
      handleSelectItem(filteredItems[0][0], setSelectedItem);
    }
  }, [actualCategory, inventory]);
};

export default useFilteredInventoryEffect;
