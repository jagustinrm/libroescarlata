import { useEffect } from 'react';
import useQuestStore from '../stores/questStore'; // Asegúrate de crear este store si no existe

const QuestLoader = () => {
  const { areQuestsLoaded, setQuestTree } = useQuestStore(); // Variables y funciones del store

  useEffect(() => {
    if (!areQuestsLoaded) {
      const loadQuests = async () => {
        try {
          const res = await fetch('/mocks/quests.json');
          if (!res.ok) {
            throw new Error('Error loading the quests JSON file');
          }

          const data = await res.json();
          setQuestTree(data); // Actualiza el estado global solo si no se ha cargado antes
        } catch (error) {
          console.error('Error loading quests:', error);
        }
      };

      loadQuests();
    }
  }, [areQuestsLoaded, setQuestTree]);

  return null;
};

export default QuestLoader;
