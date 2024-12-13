export interface Armor {
    // Categorías principales de armadura
    id: string;
    name: string;
    img: string;
    weight: number;
    cost: number;
    description: string;
    type: {
      head?: string; // Ej: "Máscara de Acero"
      face?: string; // Ej: "Visor Protector"
      shoulders?: string;
      chest?: string; // Cuerpo completo o pechera
      gloves?: string;
      back?: string;
      waist?: string;
      legs?: string;
    };
    armorValue: number;
    equipLevel: number;
    // Rareza
    rarity: 
      | "Chatarra"
      | "Común"
      | "Poco común"
      | "Raro"
      | "Épico"
      | "Legendario"
      | "Mítico"
      | "Artefacto"
      | "Corrupto"
      | "Antiguo"
      | "Prototipo"
      | "Irónicas";
  
    // Prefijos y sufijos
    prefixes?: string[]; // Ej: ["Fiery", "Quick", "Stalwart"]
    suffixes?: string[]; // Ej: ["of Flames", "of the Bear", "of Speed"]
  
    // Material y restricciones
    material: "Metal" | "Madera" | "Cuero" | string; // Otros materiales
    classRestriction?: string; // Ej: "Guerrero", "Mago"
  
    // Requisitos
    levelRequirement: number; // Nivel mínimo para usarla
    statRequirements?: {
      [stat: string]: number; // Ej: { fuerza: 10, agilidad: 5 }
    };
  
    // Durabilidad y reparación
    durability: {
      current: number; // Durabilidad actual
      max: number; // Durabilidad máxima
      repairable: boolean; // Indica si puede repararse
    };
  
    // Sockets
    sockets: number; // Número de ranuras para gemas o mejoras
  
    // Efectos únicos
    uniqueEffects?: string[]; // Ej: ["Revives al morir", "Aura de fuego"]
  
    // Bonificaciones de conjunto
    setBonuses?: {
      setName: string; // Nombre del conjunto
      bonuses: string[]; // Lista de bonificaciones por piezas equipadas
    };
  
    // Escalado de poder
    scaling?: {
      levelUpgrades: number[]; // Mejora de estadísticas por nivel
      newFeatures?: string[]; // Nuevas características al subir nivel
    };
  
    // Origen
    questReward?: boolean; // Indica si proviene de una misión
  }


  export interface ArmorStore {
      armors: Armor[];                        // Lista de armas
      areArmorsLoaded: boolean;                // Indica si las armas están cargadas
      setArmors: (weapons: Armor[]) => void;   // Función para establecer las armas en el estado
      addNewsetArmors: (newWeapon: Armor) => void; // Función para agregar una nueva arma
      updatesetArmors: (updatedWeapon: Armor) => void; // Función para actualizar una arma existente
  }