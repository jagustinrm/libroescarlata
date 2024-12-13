import {create} from "zustand";
import { Armor, ArmorStore } from "./types/armor";

const useArmorStore = create<ArmorStore>((set) => ({
  armors: [],
  areArmorsLoaded: false,

  setArmors: (armors: Armor[]) => {
    set({ armors, areArmorsLoaded: true });
  },

  addNewsetArmors: (newArmor: Armor) => {
    set((state) => ({ armors: [...state.armors, newArmor] }));
  },

  updatesetArmors: (updatedArmor: Armor) => {
    set((state) => ({
      armors: state.armors.map((armor) =>
        armor.id === updatedArmor.id ? updatedArmor : armor
      ),
    }));
  },
}));

export default useArmorStore;