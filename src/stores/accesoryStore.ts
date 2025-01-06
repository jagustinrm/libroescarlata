import { create } from 'zustand';
import { Accessory, AccessoryStore } from './types/accesories';

const useAccessoryStore = create<AccessoryStore>((set) => ({
  accessories: [],
  
  areAccessoriesLoaded: false,

  setAccessories: (accessories: Accessory[]) => {
    set({ accessories, areAccessoriesLoaded: true });
  },

  addNewAccessory: (newAccessory: Accessory) => {
    set((state) => ({ accessories: [...state.accessories, newAccessory] }));
  },

  updateAccessory: (updatedAccessory: Accessory) => {
    set((state) => ({
      accessories: state.accessories.map((accessory) =>
        accessory.id === updatedAccessory.id ? updatedAccessory : accessory,
      ),
    }));
  },
}));

export default useAccessoryStore;
