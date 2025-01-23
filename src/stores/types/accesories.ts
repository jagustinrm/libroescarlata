export interface Accessory {
    id: string;
    name: string;
    img: string;
    weight: number;
    cost: number;
    description: string;
    type: 'Amuleto' | 'Anillo' | 'Aro' | string; 
    bodypart: string;
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
    bonusEffects?: [
      {
        category: string; // Resist, Stats, AttackBonus...
        type?: string; // Fire, Water... AGI, DEX...
        cant: number; // 10, 15, 42...
      },
    ];
    uniqueEffects?: string[]; // Ej: ["Aura de curación", "Inmunidad a veneno"]
    levelRequirement: number;
    statRequirements?: {
      [stat: string]: number;
    };
    durability?: {
      current: number;
      max: number;
      repairable: boolean;
    };
    questReward?: boolean; // Indica si proviene de una misión
    deleteable?: boolean;
    color: string; // Color asociado al accesorio (según rareza o estética)
    scaling?: {
      levelUpgrades: number[]; // Mejora de estadísticas por nivel
      newFeatures?: string[]; // Nuevas características al subir nivel
    };
    setBonuses?: {
      setName: string; // Nombre del conjunto
      bonuses: string[]; // Lista de bonificaciones por piezas equipadas
    };
    playerOwner: boolean;
    actions: {
      equippable: boolean;
    }
  }

  export interface AccessoryStore {
    accessories: Accessory[]; 
    areAccessoriesLoaded: boolean; 
    setAccessories: (accessories: Accessory[]) => void; 
    addNewAccessory: (newAccessory: Accessory) => void; 
    updateAccessory: (updatedAccessory: Accessory) => void;
  }
  