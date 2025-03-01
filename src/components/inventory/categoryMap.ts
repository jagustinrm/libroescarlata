import { getGlobalState } from "../../customHooks/useGlobalState";
import { Inventory } from "../../stores/types/inventory";

export const getCategoryMap = (): Record<keyof Inventory, any[]> => {
    const {
      weapons,
      potions,
      armors,
      otherItems,
      accessories,
      books,
      scrolls,
      shields,
    } = getGlobalState();
  
    return {
      armors,
      weapons,
      potions,
      others: otherItems,
      accessories,
      books,
      scrolls,
      shields,
    };
  };