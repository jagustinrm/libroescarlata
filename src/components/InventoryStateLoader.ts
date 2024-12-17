import { useEffect } from 'react';
import { Inventory } from '../stores/types/inventory';
import useInventoryStore from '../stores/inventoryStore';
import usePlayerStore from '../stores/playerStore';
const InventoryStateLoader = () => {
  const { createInventory, addItem } = useInventoryStore();
  const { player } = usePlayerStore();
  useEffect(() => {
    const storedInventoryState = localStorage.getItem('inventoryState');

    if (storedInventoryState) {
      const parsedInventoryState = JSON.parse(storedInventoryState);

      // Crea el inventario si no existe
      createInventory(`${player.name}_inventory`);
      if (
        typeof parsedInventoryState[`${player.name}_inventory`] === 'object' &&
        parsedInventoryState[`${player.name}_inventory`] !== null
      ) {
        // Recorre cada categoría del inventario (weapons, potions, etc.)
        Object.keys(parsedInventoryState[`${player.name}_inventory`]).forEach(
          (category) => {
            const items =
              parsedInventoryState[`${player.name}_inventory`][category];

            if (Array.isArray(items)) {
              items.forEach((item) => {
                addItem(
                  `${player.name}_inventory`,
                  category as keyof Inventory,
                  item,
                ); // Agrega cada ítem
              });
            }
          },
        );
      }
    }
  }, [player]);

  return null;
};

export default InventoryStateLoader;
