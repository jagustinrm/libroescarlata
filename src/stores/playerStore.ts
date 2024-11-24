import { create } from 'zustand';
import { PlayerStore } from './types/player';

// Crear el store de Zustand
// Implementación del store con Zustand
export const usePlayerStore = create<PlayerStore>((set) => ({
  player: {
    name: '',
    classes: [],
    hitDie: '',
    armorClass: '',
    baseAttackBonus: '',
    saves: {
      fortitude: '',
      reflex: '',
      will: '',
    },
    classFeatures: [],
  },
  setPlayerName: (name) => set((state) => ({ player: { ...state.player, name } })),
  setArmorClass: (armorClass) =>
    set((state) => ({ player: { ...state.player, armorClass } })),
  setBaseAttackBonus: (baseAttackBonus) =>
    set((state) => ({ player: { ...state.player, baseAttackBonus } })),
  updateSaves: (saves) =>
    set((state) => ({
      player: { ...state.player, saves: { ...state.player.saves, ...saves } },
    })),
  addClassFeature: (feature) =>
    set((state) => ({
      player: {
        ...state.player,
        classFeatures: [...state.player.classFeatures, feature],
      },
    })),
    addClasses: (classes) =>
      set((state) => ({
        player: {
          ...state.player,
          classes: [...state.player.classes, classes],
        },
      })),
}));

export default usePlayerStore;