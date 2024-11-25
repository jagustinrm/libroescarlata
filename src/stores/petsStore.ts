import {create} from 'zustand';
import { PetStore } from './types/pets';

export const usePetStore = create<PetStore>((set) => ({
    pets: [],
    arePetsLoaded: false,
    setPets: (pets) =>
        set((state) => {
            // Solo actualiza si las clases no están vacías
            if (state.pets.length === 0 && pets.length > 0) {
                return {
                    pets,
                    arePetsLoaded: true,
                };
            }
            return state; // Si las clases ya están cargadas, no se actualiza
        }),
    addNewPet: (newPet) =>
        set((state) => ({ pets: [...state.pets, newPet] })),
    updatePet: (updatedPet) =>
        set((state) => ({
            pets: state.pets.map((pet) =>
                pet.name === updatedPet.name ? updatedPet : pet
            ),
        })),
}));
