import { create } from 'zustand';
import { WeaponStore } from './types/weapons';
export const useWeaponStore = create<WeaponStore>((set) => ({
  weapons: [],

  areWeaponsLoaded: false,
  setWeapons: (weapons) =>
    set((state) => {
      if (state.weapons.length === 0 && weapons.length > 0) {
        return {
          weapons,
          areWeaponsLoaded: true,
        };
      }
      return state;
    }),
  addNewWeapon: (newWeapon) =>
    set((state) => ({
      weapons: [...state.weapons, newWeapon],
    })),
  updateWeapon: (updatedWeapon) =>
    set((state) => ({
      weapons: state.weapons.map((weapon) =>
        weapon.id === updatedWeapon.id ? updatedWeapon : weapon,
      ),
    })),
    clearWeapons: () => set({ weapons: [] }),
}));
