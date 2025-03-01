import { generalItem } from "./items";

export interface Armor extends generalItem{
  id: string;
  name: string;
  img: string;
  weight: number;
  cost: number;
  description: string;
  bodyPart: string;
  armorValue: number;
  equipLevel: number;
  rarity:
    | 'Chatarra'
    | 'Común'
    | 'Poco común'
    | 'Raro'
    | 'Épico'
    | 'Legendario'
    | 'Mítico'
    | 'Artefacto'
    | 'Corrupto'
    | 'Antiguo'
    | 'Prototipo'
    | 'Irónicas';
  prefixes?: string[]; // Ej: ["Fiery", "Quick", "Stalwart"]
  suffixes?: string[]; // Ej: ["of Flames", "of the Bear", "of Speed"]
  material: 'Metal' | 'Madera' | 'Cuero' | string; // Otros materiales
  // classRestriction?: string; // Ej: "Guerrero", "Mago"
  bonusEffects?: [
    {
      category: string; // Resist, Stats, AttackBonus...
      type?: string; // Fire, Water... AGI, DEX...
      cant: number; // 10, 15, 42...
    },
  ];
  levelRequirement: number;
  statRequirements?: {
    [stat: string]: number;
  };
  durability: {
    current: number;
    max: number;
    repairable: boolean;
  };
  sockets: number; // Número de ranuras para gemas o mejoras
  uniqueEffects?: string[]; // Ej: ["Revives al morir", "Aura de fuego"]
  setBonuses?: {
    setName: string; // Nombre del conjunto
    bonuses: string[]; // Lista de bonificaciones por piezas equipadas
  };
  scaling?: {
    levelUpgrades: number[]; // Mejora de estadísticas por nivel
    newFeatures?: string[]; // Nuevas características al subir nivel
  };
  questReward?: boolean; 
  deleteable?: boolean;
  color: string;
  actions: {
    equippable: boolean;
  };
}

export interface ArmorStore {
  armors: Armor[]; 
  shields: Armor[]
  areArmorsLoaded: boolean; 
  areShieldsLoaded: boolean;
  setArmors: (armor: Armor[]) => void;
  setShields: (shield: Armor[]) => void;
  addNewArmor: (armor: Armor) => void;
  addNewShield: (shield: Armor) => void;
  addNewsetArmors: (newArmor: Armor) => void;
  updatesetArmors: (updatedArmor: Armor) => void; 
}
