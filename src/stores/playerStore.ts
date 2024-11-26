import { create } from 'zustand';
import { PlayerStore } from './types/player';
import useInventoryStore from './inventoryStore';

export const usePlayerStore = create<PlayerStore>((set) => ({
  player: {
    name: '',
    level: 1,
    playerExp: 0,
    p_ExpToNextLevel: 1000,
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
    selectedPet: '',
    selectedWeapon: null,
    inventoryId: 'player1_inventory',
    playerMaterial: 0,
  },

  // Agrupamos las acciones relacionadas con el jugador
  playerActions: {
    setPlayerMaterial: (playerMaterial) =>
      set((state) => ({
        player: { ...state.player, playerMaterial },
      })),
    setPlayerExp: (playerExp) =>
      set((state) => ({
        player: { ...state.player, playerExp },
      })),
    setP_ExpToNextLevel: (p_ExpToNextLevel) =>
      set((state) => ({
        player: { ...state.player, p_ExpToNextLevel },
      })),
    setP_ExpPrevLevel: (p_ExpPrevLevel) =>
      set((state) => ({
        player: { ...state.player, p_ExpPrevLevel },
      })),
    setPlayerName: (name) =>
      set((state) => ({
        player: { ...state.player, name },
      })),
    setPlayerLevel: (level) =>
      set((state) => ({
        player: { ...state.player, level },
      })),
    setP_MaxHealth: (p_MaxHealth) =>
      set((state) => ({
        player: { ...state.player, p_MaxHealth },
      })),
    setP_LeftHealth: (p_LeftHealth) =>
      set((state) => ({
        player: { ...state.player, p_LeftHealth },
      })),
    setArmorClass: (armorClass) =>
      set((state) => ({
        player: { ...state.player, armorClass },
      })),
    setBaseAttackBonus: (baseAttackBonus) =>
      set((state) => ({
        player: { ...state.player, baseAttackBonus },
      })),
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
      addClasses: (newClass) =>
        set((state) => {
          // Verificar si la clase ya existe
          if (!state.player.classes.includes(newClass)) {
            console.log(newClass)
            return {
              player: {
                ...state.player,
                classes: [...state.player.classes, newClass], // Agregar solo si no existe
              },
            };
          }
          // Si ya existe, no modificar el estado
          return state;
        }),
        setPlayerClass: (classes) =>
          set((state) => ({
            player: {...state.player, classes: [classes]}
          })),
    setP_SelectedPet: (selectedPet) =>
      set((state) => ({
        player: { ...state.player, selectedPet },
      })),
    setP_SelectedWeapon: (selectedWeapon) =>
      set((state) => ({
        player: { ...state.player, selectedWeapon },
      })),
  },

  // Mantén la función de inventario separada
  getInventoryFunctions: () => useInventoryStore.getState(),
}));

export default usePlayerStore;
