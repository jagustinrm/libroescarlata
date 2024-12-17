import { PotionStore } from './types/potions';
import { create } from 'zustand';

const usePotionStore = create<PotionStore>((set) => ({
  potions: [],
  arePotionsLoaded: false,
  setPotions: (potions) =>
    set((state) => {
      // Solo actualiza si las pociones no están vacías y no han sido cargadas aún
      if (state.potions.length === 0 && potions.length > 0) {
        return {
          potions,
          arePotionsLoaded: true,
        };
      }
      return state; // Si las pociones ya están cargadas, no se actualiza
    }),
  addNewPotion: (newPotion) =>
    set((state) => ({
      potions: [...state.potions, newPotion],
    })),
  updatePotion: (updatedPotion) =>
    set((state) => {
      const updatedPotions = state.potions.map((potion) =>
        potion.id === updatedPotion.id ? updatedPotion : potion,
      );
      return { potions: updatedPotions };
    }),
}));

export default usePotionStore;
