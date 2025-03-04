import { getGlobalState } from "../../customHooks/useGlobalState";
import { Inventory } from "../../stores/types/inventory";

export const getCategoryMap = (): Record<keyof Inventory, any[]> => {
    const {
      weapons,
      shields,
      potions,
      armors,
      otherItems,
      accessories,
      books,
      scrolls,

    } = getGlobalState();
  
    return {
      armors,
      weapons,
      shields,
      potions,
      others: otherItems,
      accessories,
      books,
      scrolls,

    };
  };