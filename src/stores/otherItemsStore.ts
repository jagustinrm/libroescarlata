import { create } from 'zustand';
import { otherItem, otherItemsStore } from './types/otherItems';

const useOtherItemsStore = create<otherItemsStore>((set) => ({
  otherItems: [],
  areOtherItemsLoaded: false,
  setotherItems: (newOtherItems: otherItem[]) => {
    set({
      otherItems: newOtherItems,
      areOtherItemsLoaded: true,
    });
  },
  addNewOtherItem: (newItem) => {
    set((state) => ({
      otherItems: [...state.otherItems, newItem],
    }))
  },
}));

export default useOtherItemsStore;
