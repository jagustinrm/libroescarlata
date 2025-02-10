import { getGlobalState } from "../../customHooks/useGlobalState";
import { Inventory } from "../../stores/types/inventory";
import { getCategoryMap } from "./categoryMap";

  const getItemsByCategory = (category: keyof Inventory, itemIds?: string[]) => {
    const categoryMap = getCategoryMap();
    return categoryMap[category]?.filter((item) => itemIds?.includes(item.id)) ?? [];
  };
  
  export const handleLoadActualInventory = (
    category: keyof Inventory, 
    setActualInventory: React.Dispatch<React.SetStateAction<any[] | null>>, 
    setActualCategory: React.Dispatch<React.SetStateAction<keyof Inventory>>
  ) => {
    const {player, inventories} = getGlobalState();
    const inventory = player.inventoryId ? inventories[player.inventoryId] : null;
    if (!inventory) {
      setActualInventory(null);
      return;
    }
  
    setActualCategory(category);
    setActualInventory(getItemsByCategory(category, inventory[category] ?? []));
  };