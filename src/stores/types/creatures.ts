import { Stats } from './stats';
export interface Creature {
  name: string;
  type?: string;
  role?: string; // "creature" o "boss"
  alignment: string;
  level: number;
  expertice?: number;
  dodge: number;
  hitRate: number;
  hitPoints: string; // Ejemplo: "1d8"
  armorClass: number;
  attacks: {
    name: string; // Ejemplo: "daga"
    type: string; // "melee" o "rango"
    bonus: number; // Ejemplo: +1
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
