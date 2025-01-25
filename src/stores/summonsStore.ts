import { create } from 'zustand';

import {
  calculateDmgReduction,
  calculateDodgePercentage,
  calculateHitRatePercentage,
} from '../utils/calculateDodgePercentage';
import { Summon, SummonsStore } from './types/summons';
const useSummonStore = create<SummonsStore>((set, get) => ({
  summons: [],
  areSummonsLoaded: false,
  summon: {
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
      return calculateDodgePercentage(get().summon.dodge);
    },
    hitRatePercentage: () => {
      console.log(get().summon.stats.dex, get().summon.hitRate);
      return calculateHitRatePercentage(20);
    },
    totalDmgReduction: (enemyLevel) => {
      return calculateDmgReduction(get().summon.armorClass, enemyLevel);
    },
  },
  setSummon: (creature: Summon) =>
    set(() => ({
      summon: creature,
    })),

  setSummonHealth: (health: number) =>
    set((state) => {
      if (state.summon) {
        return {
          summon: { ...state.summon, health },
        };
      }
      return state;
    }),

  setSummons: (summons: Summon[]) =>
    set(() => ({
      summons,
      areSummonsLoaded: true,
    })),

  addNewSummon: (newSummon: Summon) =>
    set((state) => ({
      summons: [...state.summons, newSummon],
    })),

  updateSummon: (updatedCreature: Summon) =>
    set((state) => ({
      summons: state.summons.map((summon) =>
        summon.name === updatedCreature.name ? updatedCreature : summon,
      ),
    })),
}));

export default useSummonStore;
