// src/interfaces/Pet.ts

interface Attack {
    type: string;       // Tipo de ataque (e.g., "melee")
    bonus: string;      // Modificador del ataque (e.g., "+2")
    damage: string;     // Daño que inflige (e.g., "1d2 daño")
  }
  
  export interface PetInterface {
    name: string;                     // Nombre de la mascota
    type: string;                     // Tipo de criatura (e.g., "mamífero")
    alignment: string;                // Alineación (e.g., "neutral")
    level: number;                    // Nivel de la mascota
    hitPoints: string;                // Puntos de vida (e.g., "1d4")
    armorClass: number;               // Clase de armadura
    attack: Attack;                   // Ataque, definido por la subinterfaz `Attack`
    specialAbilities: string[];       // Lista de habilidades especiales
    img: string;                      // Ruta de la imagen
  }
  