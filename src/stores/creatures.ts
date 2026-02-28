import { create } from 'zustand';
import { CreatureStore, Creature } from './types/creatures';
const useCreatureStore = create<CreatureStore>((set) => ({
  creatures: [],
  bosses: [],
  areCreaturesLoaded: false,
  creatureLoaded: false,

  creature: {
    name: '',
    type: '',
    controlResist: [],
    alignment: '',
    level: 0,
    mdef: 0,
    hitPoints: 0,
    armorClass: 0,
    attacks: [],
    specialAbilities: [],
    img: '',
    health: 1,
    c_MaxHealth: 1,
    c_MaxMana: 1,
    c_LeftMana: 1,
    c_LeftHealth: 1,
    c_Conditions: [],
    stats: {
      str: 0,
      dex: 0,
      con: 0,
      int: 0,
      agi: 0,
      cha: 0,
    },
    dodge: 0,
    hitRate: 0,
  },
  // ESTO quizás podría hacerlo directamente cuando cargo una criatura.
  setCreatureLoaded: (loaded) => set({ creatureLoaded: loaded }),

  setCreatures: (creatures: Creature[]) =>
    set((state) => {
      if (state.creatures.length === 0 && creatures.length > 0) {
        const creaturesFiltered = creatures.filter(
          (creature) => creature.role !== 'boss',
        );
        const bossesFiltered = creatures.filter(
          (creature) => creature.role === 'boss',
        );

        return {
          creatures: creaturesFiltered,
          bosses: bossesFiltered,
          areCreaturesLoaded: true,
        };
      }
      return state;
    }),

  addNewCreature: (newCreature) =>
    set((state) => ({
      creatures: [...state.creatures, newCreature],
    })),

  addNewBoss: (newBoss) =>
    set((state) => ({
      bosses: [...state.bosses, newBoss],
    })),
  updateC_Conditions: (newCondition) => {

    set((state) => ({
      creature: {
        ...state.creature,
        c_Conditions: [...state.creature.c_Conditions, newCondition], // Agrega la nueva condición al array
      },
    }))
  },
  setC_Conditions: (newConditions) => {

    set((state) => ({
      creature: {
        ...state.creature,
        c_Conditions: newConditions,
      },
    }))
  },
  updateCreature: (updatedCreature) =>
    set((state) => {
      const existingCreatureIndex = state.creatures.findIndex(
        (c) => c.name === updatedCreature.name,
      );

      if (existingCreatureIndex >= 0) {
        const updatedCreatures = [...state.creatures];
        updatedCreatures[existingCreatureIndex] = updatedCreature;
        return { creatures: updatedCreatures };
      }

      return { creatures: [...state.creatures, updatedCreature] };
    }),

  updateBoss: (updatedBoss) =>
    set((state) => {
      const existingBossIndex = state.bosses.findIndex(
        (b) => b.name === updatedBoss.name,
      );

      if (existingBossIndex >= 0) {
        const updatedBosses = [...state.bosses];
        updatedBosses[existingBossIndex] = updatedBoss;
        return { bosses: updatedBosses };
      }

      return { bosses: [...state.bosses, updatedBoss] };
    }),

  setCreature: (creature) =>
    set(() => ({
      creature,
    })),
  // este hay que borrarlo  
  setCreatureHealth: (health) =>
    set((state) => ({
      creature: { ...state.creature, health },
    })),
  setc_MaxHealth: (c_MaxHealth) =>
    set((state) => ({
      creature: { ...state.creature, c_MaxHealth },
    })),
  setc_LeftHealth: (c_LeftHealth) =>
    set((state) => ({
      creature: { ...state.creature, c_LeftHealth },
    })),
  setc_MaxMana: (c_MaxMana) =>
    set((state) => ({
      creature: { ...state.creature, c_MaxMana },
    })),

  setc_LeftMana: (c_LeftMana) =>
    set((state) => ({
      creature: { ...state.creature, c_LeftMana },
    })),

}));

export default useCreatureStore;
