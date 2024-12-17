import { useState, useEffect } from 'react';
// @ts-expect-error Chequear quests
import checkQuestsFinished from '../utils/checkQuestFinished.js';
import { QuestData } from '../components/interfaces/QuestsInt.ts';

export function useLoadQuests() {
  const [quests, setQuests] = useState<QuestData | null>(null);

  useEffect(() => {
    // Comprobar si las quests ya están en localStorage

    // ****************ESTO NO EXISTE*************************
    const storedQuests = localStorage.getItem('quests');
    // *************************************************************

    if (storedQuests) {
      // Si existe en localStorage, lo usamos
      setQuests(JSON.parse(storedQuests));
    } else {
      // Si no, se hace el fetch para cargar desde el JSON
      fetch('/mocks/quests.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error loading the JSON file');
          }
          return response.json();
        })
        .then((data: QuestData) => {
          setQuests(checkQuestsFinished(data));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return { quests };
}
