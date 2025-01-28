import { Creature } from './creatures';
// import { Stats } from './stats';
export interface Summon extends Creature {

}

export interface SummonsStore {
  summons: Summon[];
  summon: Summon;
  setSummon: (creature: Summon) => void;
  setSummonHealth: (health: number) => void;
  areSummonsLoaded: boolean;
  setSummons: (summons: Summon[]) => void;
  addNewSummon: (newSummon: Summon) => void;
  updateSummon: (updatedCreature: Summon) => void;
}
