import { create } from 'zustand';
import { PlayerStore } from './types/player';

// Crear el store de Zustand
export const usePlayerStore = create<PlayerStore>((set) => ({
  player: {
    name: '',
    level: 0,
    playerExp: 0,
    p_ExpToNextLevel: 0,
    p_ExpPrevLevel: 0,
    p_MaxHealth: 1,
    p_LeftHealth: 1,
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
  
  // Función corregida para setear playerExp
  setPlayerExp: (playerExp) => set((state) => ({
    player: { ...state.player, playerExp }  // Actualiza la propiedad playerExp
  })),

  setP_ExpToNextLevel: (p_ExpToNextLevel) => set((state) => ({
    player: { ...state.player, p_ExpToNextLevel }  // Actualiza la propiedad playerExp
  })),

  setP_ExpPrevLevel: (p_ExpPrevLevel) => set((state) => ({
    player: { ...state.player, p_ExpPrevLevel }  // Actualiza la propiedad playerExp
  })),
  setPlayerName: (name) => set((state) => ({
    player: { ...state.player, name }
  })),

  setPlayerLevel: (level) => set((state) => ({
    player: { ...state.player, level }
  })),

  setP_MaxHealth: (p_MaxHealth) => set((state) => ({
    player: { ...state.player, p_MaxHealth }
  })),
  
  setP_LeftHealth: (p_LeftHealth) => set((state) => ({
    player: { ...state.player, p_LeftHealth }
  })),
  
  setArmorClass: (armorClass) => set((state) => ({
    player: { ...state.player, armorClass }
  })),

  setBaseAttackBonus: (baseAttackBonus) => set((state) => ({
    player: { ...state.player, baseAttackBonus }
  })),

  updateSaves: (saves) => set((state) => ({
    player: { ...state.player, saves: { ...state.player.saves, ...saves } }
  })),

  addClassFeature: (feature) => set((state) => ({
    player: {
      ...state.player,
      classFeatures: [...state.player.classFeatures, feature],
    },
  })),

  addClasses: (classes) => set((state) => ({
    player: {
      ...state.player,
      classes: [...state.player.classes, ...classes], // Asegúrate de expandir el array de clases
    },
  })),
}));

export default usePlayerStore;
