import { useEffect } from 'react';
import { usePetStore } from '../stores/petsStore';
const PetsLoader = () => {
  const { arePetsLoaded, setPets } = usePetStore();

  useEffect(() => {
    if (!arePetsLoaded) {
      const loadPets = async () => {
        try {
          const res = await fetch('/mocks/pets.json'); // Ruta del archivo books.json
          const data = await res.json();
          console.log(data)
          setPets(data.pets);
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
