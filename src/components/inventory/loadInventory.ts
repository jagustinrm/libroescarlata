import { Dispatch, SetStateAction } from "react";
import { getGlobalState } from "../../customHooks/useGlobalState";
import { Inventory } from "../../stores/types/inventory";

  export const handleLoadActualInventory = (
    category: keyof Inventory, 
    setActualInventory: Dispatch<SetStateAction<[any, number][] | null>>, 
    setActualCategory: React.Dispatch<React.SetStateAction<keyof Inventory>>
  ) => {
    const {player, inventories} = getGlobalState();
    const inventory = player.inventoryId ? inventories[player.inventoryId] : null;
    if (!inventory) {
      setActualInventory(null);
      return;
    }
    setActualCategory(category);
  };