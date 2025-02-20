import { Inventory } from "../../stores/types/inventory";
import { getCategoryMap } from "./categoryMap";

  export const handleSelectItem = (itemId: string | number, setSelectedItem: React.Dispatch<React.SetStateAction<any>>) => {
    const categoryMap = getCategoryMap();
    for (const category in categoryMap) {
      const foundItem = categoryMap[category as keyof Inventory].find(
        (item) => item.id === itemId
      );
      if (foundItem) {
        
        setSelectedItem(foundItem);
        return;
      }
    }
    setSelectedItem(null);
  };