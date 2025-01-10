import useCreatureStore from '../stores/creatures';
import { useEffect } from 'react';
import { Creature } from '../stores/types/creatures';

const CreatureLoader = () => {
  const { areCreaturesLoaded, setCreatures, creature } = useCreatureStore();

  useEffect(() => {
    // Solo cargar las criaturas si no han sido cargadas previamente
    if (!areCreaturesLoaded) {
      const loadCreaturesAndBosses = async () => {
        
        try {
          // Cargar las criaturas normales
          const resCreatures = await fetch('/mocks/creatures.json'); // Ruta del archivo JSON de criaturas normales
          const creaturesData = await resCreatures.json();
          const baseCreature = creature
          // Asignarles el rol "creature"
          const creaturesWithRole = creaturesData.map((creature: Creature) => ({
            ...baseCreature,
            ...creature,
            role: 'creature', // Asignar rol normal
          }));

          // Cargar los jefes
          const resBosses = await fetch('/mocks/bosses.json'); // Ruta del archivo JSON de jefes
          const bossesData = await resBosses.json();
          // Asignarles el rol "boss"
          const bossesWithRole = bossesData.map((boss: Creature) => ({
            ...baseCreature,
            ...boss,
            role: 'boss', // Asignar rol jefe
          }));

          // Unir ambas listas y actualizar el estado global
          const allCreatures = [...creaturesWithRole, ...bossesWithRole];
          setCreatures(allCreatures);
        } catch (error) {
          console.error('Error loading creatures and bosses:', error);
        }
      };

      loadCreaturesAndBosses();
    }
  }, [areCreaturesLoaded, setCreatures]);

  return null;
};

export default CreatureLoader;
