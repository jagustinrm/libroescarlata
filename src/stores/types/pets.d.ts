import { Creature } from "./creatures";

export interface Pet extends Creature {
  cost?: number;
}

interface PetStore {
  pets: Pet[];
  arePetsLoaded: boolean;
  setPets: (pets: Pet[]) => void;
  addNewPet: (newPet: Pet) => void;
  updatePet: (updatedPet: Pet) => void;
}
