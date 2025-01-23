export interface Pet {
  name: string;
  type: string;
  alignment: string;
  level: number;
  hitPoints: string; // Ejemplo: "1d4"
  armorClass: number;
  attack: {
    melee: number; 
  };
  specialAbilities: string[]; // Lista de habilidades especiales
  img: string; // URL o ruta de la imagen
  cost?: number;
}

interface PetStore {
  pets: Pet[];
  arePetsLoaded: boolean;
  setPets: (pets: Pet[]) => void;
  addNewPet: (newPet: Pet) => void;
  updatePet: (updatedPet: Pet) => void;
}
