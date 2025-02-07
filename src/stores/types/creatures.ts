import { Stats } from './stats';
export interface Creature {
  name: string;
  level: number;
  type?: string;
  role?: string; // "creature" o "boss"
  alignment: string;
  expertice?: number;
  dodge: number;
  hitRate: number;
  hitPoints: string;
  armorClass: number;
  mdef: number;
  attacks: {
    name: string;
    type: string; // "melee" o "rango"
    bonus: number;
    damage: number;
    damageMax: number;
    soundEffect: string;
    range: number;
  }[];
  specialAbilities: string[];
  img: string;
  health?: number;
  stats: Stats;
  readonly dodgePercentage: () => number;
  readonly hitRatePercentage: () => number;
  readonly totalDmgReduction: (enemyLevel: number) => number;
  readonly totalMDmgReduction: (enemyLevel: number) => number;
}

export interface CreatureStore {
  // LISTA DE TODAS LAS CRIATURAS (creatures y bosses separados)
  creatures: Creature[];
  bosses: Creature[]; // Lista de bosses (puedes filtrar por 'type' si quieres)
  areCreaturesLoaded: boolean;
  setCreatures: (creatures: Creature[]) => void;
  addNewCreature: (newCreature: Creature) => void;
  addNewBoss: (newBoss: Creature) => void; // Función para añadir nuevos bosses
  updateCreature: (updatedCreature: Creature) => void;
  updateBoss: (updatedBoss: Creature) => void; // Función para actualizar bosses
  // UNA SOLA CRIATURA (para el escenario de combate)
  creature: Creature;
  setCreature: (creature: Creature) => void;
  setCreatureHealth: (health: number) => void;
}
