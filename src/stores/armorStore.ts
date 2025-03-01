import { create } from 'zustand';
import { Armor, ArmorStore } from './types/armor';

const useArmorStore = create<ArmorStore>((set) => ({
  armors: [],
  shields: [],
  areArmorsLoaded: false,
  areShieldsLoaded: false,
  setArmors: (armors: Armor[]) => {
    set({ armors, areArmorsLoaded: true });
  },
  setShields: (shields: Armor[]) => {
    set({ shields, areShieldsLoaded: true });
  },
  addNewsetArmors: (newArmor: Armor) => {
    set((state) => ({ armors: [...state.armors, newArmor] }));
  },
  addNewArmor: (newArmor: Armor) =>
    set((state) => {
      const armorExists = state.armors.some((armor) => armor.id === newArmor.id);
      
      if (armorExists) {
        return state;
      }
  
      return {
        armors: [...state.armors, newArmor],
      };
    }),
  addNewShield: (newShield: Armor) =>
    set((state) => {
      const shieldExists = state.shields.some((shield) => shield.id === newShield.id);
      if (shieldExists) {
        return state;
      }
      return {
        shields: [...state.shields, newShield],
      };
    }),
  updatesetArmors: (updatedArmor: Armor) => {
    set((state) => ({
      armors: state.armors.map((armor) =>
        armor.id === updatedArmor.id ? updatedArmor : armor,
      ),
    }));
  },
}));

export default useArmorStore;
