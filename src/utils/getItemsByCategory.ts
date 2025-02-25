import { getCategoryMap } from "../components/inventory/categoryMap";
import { Inventory } from "../stores/types/inventory";


export const getItemsByCategory = (category: keyof Inventory, itemIds?: string[]) => {
  const categoryMap = getCategoryMap();

  if (!itemIds) return [];

  const items = categoryMap[category] ?? [];
 
  return itemIds.flatMap((id) => {
  
    const item = items.find((item) => item.id === id);

    return item ? [item] : [];
  });
};
