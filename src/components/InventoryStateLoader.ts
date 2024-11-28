import { useEffect } from 'react';
import { Inventory } from '../stores/types/inventory';
import useInventoryStore from '../stores/inventoryStore';

const InventoryStateLoader = () => {
  const { createInventory, addItem } = useInventoryStore()

  useEffect(() => {
    const storedInventoryState = localStorage.getItem('inventoryState');
    
    if (storedInventoryState) {
      const parsedInventoryState = JSON.parse(storedInventoryState);
      
      console.log(parsedInventoryState['player1_inventory'])
      // Crea el inventario si no existe
      createInventory('player1_inventory');

      if (typeof parsedInventoryState['player1_inventory'] === 'object' &&
          parsedInventoryState['player1_inventory'] !== null) { 

           // Recorre cada categoría del inventario (weapons, potions, etc.)
      Object.keys(parsedInventoryState['player1_inventory']).forEach((category) => {
        const items = parsedInventoryState['player1_inventory'][category]; // Obtiene el array de items
        if (Array.isArray(items)) {
          items.forEach((item) => {

            addItem('player1_inventory',  category as keyof Inventory, item); // Agrega cada ítem
          });
        }
      });

      } 
      
  
    }
  }, []);

  return null; 
};

export default InventoryStateLoader;
