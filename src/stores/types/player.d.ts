import Pet from '../types/pets';
import Weapon from '../types/weapons';
// import { Spell } from './spells';
import { Stats } from './stats';
// Interfaz para el estado del player
export interface Player {
  name: string;
  level: number;
  playerExp: number;
  p_ExpToNextLevel: number;
  p_ExpPrevLevel: number;
  p_MaxHealth: number;
  p_LeftHealth: number;
  hitDie: string;
  armorClass: number;
  baseAttackBonus: number;
  saves: {
    fortitude: string;
    reflex: string;
    will: string;
  };
  classFeatures: string[];
  classes: string[];
  selectedPet: Pet;
  selectedWeapon: Weapon;
  inventoryId: string; 
  petsName: string[];
  playerMaterial: number;
  stats: Stats,
  statsIncrease: Stats;
  leftPoints: number;
  enemiesDeleted: { count: number, name: string}[];
  spells: string[]
}

// Interfaz para las acciones relacionadas con el jugador
export interface PlayerActions {
  setPlayerMaterial: (playerMaterial: number) => void;
  setPlayerExp: (playerExp: number) => void;
  setP_ExpToNextLevel: (p_ExpToNextLevel: number) => void;
  setP_ExpPrevLevel: (p_ExpPrevLevel: number) => void;
  setP_SelectedPet: (selectedPet: Pet) => void;
  setP_SelectedWeapon: (selectedWeapon: Weapon) => void;
  setPlayerLevel: (level: number) => void;
  setP_MaxHealth: (p_MaxHealth: number) => void;
  setP_LeftHealth: (p_LeftHealth: number) => void;
  addClasses: (classes: string) => void;
  setPlayerClass: (classes: string) => void;
  setPlayerName: (name: string) => void; 
  setArmorClass: (armorClass: number) => void; 
  setBaseAttackBonus: (baseAttackBonus: number) => void; 
  updateSaves: (saves: Partial<Player['saves']>) => void; 
  addClassFeature: (feature: string) => void; 
  setClassFeature: (classFeatures: Player['classFeatures']) => void; 
  addPetsName:(petsName: string) => void;
  setHitDie: (hitDie: string) => void;
  updateHitDie: (hitDie: string) => void; 
  setSaves: (saves: Player['saves']) => void;
  updateSaves: (saves: Partial<Player['saves']>) => void;
  setEnemiesDeleted: (enemiesDeleted: Player['enemiesDeleted']) => void;
  setStats: (stats: Player['stats']) => void;
  // updateStats: (stats: Partial<Player['stats']>) => void; 
  addStatsPoints: (points: number, type: keyof Player['stats']) => void; // REVISAR
  addStatsLeftPoints: (leftPoints: number) => void;
  setStatsLeftPoints: (leftPoints: number) => void;
  setStatsIncrease: (stats: Player['stats']) => void;
  addStatsIncrease: (points: number, type: keyof Player['stats']) => void;
  setSpell: (spells: string[]) => void
  addSpell: (spell: string) => void;
  setInventory: (inventory: string) => void;
}

// Interfaz para el store del player
export interface PlayerStore {
  player: Player;
  playerActions: PlayerActions;
  getInventoryFunctions: () => ReturnType<typeof useInventoryStore>;
}
