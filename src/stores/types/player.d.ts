import Pet from '../types/pets';
import Weapon from '../types/weapons';

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
  armorClass: string;
  baseAttackBonus: string;
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
  playerMaterial: number;
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
  setPlayerName: (name: string) => void; 
  setArmorClass: (armorClass: string) => void; 
  setBaseAttackBonus: (baseAttackBonus: string) => void; 
  updateSaves: (saves: Partial<Player['saves']>) => void; 
  addClassFeature: (feature: string) => void; 
}

// Interfaz para el store del player
export interface PlayerStore {
  player: Player;
  playerActions: PlayerActions;
  getInventoryFunctions: () => ReturnType<typeof useInventoryStore>;
}
