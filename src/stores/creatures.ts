import { create } from 'zustand';
import { CreatureStore, Creature } from './types/creatures';
import { calculateDodgePercentage, calculateHitRatePercentage } from '../utils/calculateDodgePercentage';
const useCreatureStore = create<CreatureStore>((set, get) => ({
  creatures: [],
  bosses: [],
  areCreaturesLoaded: false,
  creature: {
    name: '',
    type: '',
    alignment: '',
    level: 0,
    hitPoints: '',
    armorClass: 0,
    attacks: [],
    specialAbilities: [],
    img: '',
    health: 0,
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
    dodgePercentage: () => {
      return calculateDodgePercentage(get().creature.dodge); 
    },
    hitRatePercentage:() => {
      console.log(get().creature.stats.dex, get().creature.hitRate)
      return calculateHitRatePercentage(20); 
    },
  },

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

  setCreatureHealth: (health) =>
    set((state) => ({
      creature: { ...state.creature, health },
    })),
}));

export default useCreatureStore;
