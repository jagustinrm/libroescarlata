import { useEffect } from 'react';
import { usePetStore } from '../stores/petsStore';
import useCreatureStore from '../stores/creatures';
import { Pet } from '../stores/types/pets';
const PetsLoader = () => {
  const { arePetsLoaded, setPets } = usePetStore();
  const {creature} = useCreatureStore();

  useEffect(() => {
    if (!arePetsLoaded) {
      const loadPets = async () => {
        try {
          const res = await fetch('/mocks/pets.json'); // Ruta del archivo books.json
          const data = await res.json();
          const basePet = creature;
          const petWithBase = data.pets.map((pet: Pet) => ({
            ...basePet,
            ...pet,
          }));
          setPets(petWithBase);
        } catch (error) {
          console.error('Error loading books:', error);
        }
      };

      loadPets();
    }
  }, [arePetsLoaded, setPets]);

  return null;
};

export default PetsLoader;
