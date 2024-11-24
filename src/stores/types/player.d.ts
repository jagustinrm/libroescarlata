import create from 'zustand';

// Interfaz para el estado del player
export interface Player {
  name: string;
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
}



// Interfaz para el store del player
export interface PlayerStore {
  player: Player; // Estado del jugador
  addClasses: (classes: string) => void;
  setPlayerName: (name: string) => void; // Acción para actualizar el nombre
  setArmorClass: (armorClass: string) => void; // Acción para actualizar la armor class
  setBaseAttackBonus: (baseAttackBonus: string) => void; // Acción para actualizar el bonus de ataque
  updateSaves: (saves: Partial<Player['saves']>) => void; // Acción para actualizar saves de forma parcial
  addClassFeature: (feature: string) => void; // Acción para agregar un feature
}


