import { useEffect } from 'react';
import usePotionStore from '../stores/potionsStore';

const PotionsLoader = () => {
  const { arePotionsLoaded, setPotions } = usePotionStore();

  useEffect(() => {
    if (!arePotionsLoaded) {
      const loadClasses = async () => {
        try {
          const res = await fetch('/mocks/potions.json');
          const data = await res.json();
          setPotions(data); // Actualiza el estado global solo si no se ha cargado antes
        } catch (error) {
          console.error('Error loading classes:', error);
        }
      };

      loadClasses();
    }
  }, [arePotionsLoaded, setPotions]);

  return null;
};
export default PotionsLoader;
