import { generalItem } from "./items";

export interface otherItem extends generalItem {
  id: string;
  name: string;
  cost: number;
  color?: string;
  weight: number;
  deleteable?: boolean;
}

export interface otherItemsStore {
  otherItems: otherItem[];
  areOtherItemsLoaded: boolean;
  setotherItems: (otherItem: otherItem[]) => void;
  addNewOtherItem: (newItem: otherItem) => void;
}
