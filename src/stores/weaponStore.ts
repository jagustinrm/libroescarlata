import { create } from 'zustand';
import { WeaponStore } from './types/weapons';
export const useWeaponStore = create<WeaponStore>((set) => ({
  weapons: [],

  areWeaponsLoaded: false,
  setWeapons: (weapons) => {
    set({ weapons, areWeaponsLoaded: true });
  },
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
