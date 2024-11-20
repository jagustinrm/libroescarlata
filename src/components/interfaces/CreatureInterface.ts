// src/interfaces/Creature.ts

interface Attack {
    name: string;           // Nombre del ataque (e.g., "daga")
    type: string;           // Tipo de ataque (e.g., "melee", "rango")
    bonus: string;          // Modificador del ataque (e.g., "+1")
    damage: string;         // Daño que inflige (e.g., "1d4")
  }
  
  export interface CreatureInterface {
    name: string;                      // Nombre de la criatura (e.g., "Goblin")
    img: string;                       // Ruta de la imagen de la criatura
    type: string;                      // Tipo de criatura (e.g., "humanoide")
    alignment: string;                 // Alineación (e.g., "neutral maligno")
    level: number;                     // Nivel de la criatura
    hitPoints: string;                 // Puntos de vida (e.g., "1d8")
    armorClass: number;                // Clase de armadura
    attacks: Attack[];                 // Lista de ataques (usando la subinterfaz `Attack`)
    specialAbilities: string[];        // Lista de habilidades especiales
  }
  