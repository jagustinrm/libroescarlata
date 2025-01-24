import { Stats } from './stats';
export interface Summon {
  name: string;
  type?: string;
  role?: string; 
  alignment: string;
  level: number;
  expertice?: number;
  dodge: number;
  hitRate: number;
  hitPoints: string; 
  armorClass: number;
  attacks: {
    name: string; 
    type: string;
    bonus: number; 
    damage: number; 
    damageMax: number;
    soundEffect: string;
  }[];
  specialAbilities: string[]; // Lista de habilidades especiales
  img: string; // URL o ruta de la imagen
  health?: number;
  stats: Stats;
  readonly dodgePercentage: () => number;
  readonly hitRatePercentage: () => number;
  readonly totalDmgReduction: (enemyLevel: number) => number;
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
