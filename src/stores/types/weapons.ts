export interface Weapon {
  id: string; // Identificador único del arma
  name: string; // Nombre del arma
  type: string; // Tipo de arma (Cuerpo a cuerpo, Distancia)
  damage: string; // Daño del arma (por ejemplo, "1d8")
  critical: string; // Crítico del arma (por ejemplo, "19-20/x2")
  weight: number; 
  cost: number;
  description: string; // Descripción del arma
  range?: number;
  img?: string;
  color: string;
  material: 'Metal' | 'Madera' | string; // Otros materiales
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
  equipLevel?: number;
  prefixes?: string[];
  suffixes?: string[];
  bonusEffects?: [
    {
      category: string; // Resist, Stats, AttackBonus...
      type?: string; // Fire, Water... AGI, DEX...
      cant: number; // 10, 15, 42...
    },
  ];
  levelRequirement?: number;
  statRequirements?: {
    [stat: string]: number;
  };
  durability?: {
    current: number;
    max: number;
    repairable: boolean;
  };
  sockets?: number; // Número de ranuras para gemas o mejoras
  uniqueEffects?: string[]; // Ej: ["Revives al morir", "Aura de fuego"]
  setBonuses?: {
    setName: string; // Nombre del conjunto
    bonuses: string[]; // Lista de bonificaciones por piezas equipadas
  };
  scaling?: {
    levelUpgrades: number[]; // Mejora de estadísticas por nivel
    newFeatures?: string[]; // Nuevas características al subir nivel
  };
  questReward?: boolean; // Indica si proviene de una misión
  deleteable?: boolean;
}

export interface WeaponStore {
  weapons: Weapon[]; // Lista de armas
  areWeaponsLoaded: boolean; // Indica si las armas están cargadas
  setWeapons: (weapons: Weapon[]) => void; // Función para establecer las armas en el estado
  addNewWeapon: (newWeapon: Weapon) => void; // Función para agregar una nueva arma
  updateWeapon: (updatedWeapon: Weapon) => void; // Función para actualizar una arma existente
}
