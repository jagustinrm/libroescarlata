import { useState, useEffect } from "react";
// @ts-expect-error Chequear quests
import checkQuestsFinished from '../utils/checkQuestFinished.js'

interface Quest {
    name: string;
    description: string;
    counter: number;
    objective: string;
    reward: number;
    type: string;
    finished: boolean;
}

interface QuestsData {
    questTree: {
        history: Quest[];
        secondary: Quest[];
        others: Quest[];
    };
}

export function useLoadQuests() {
    const [quests, setQuests] = useState<QuestsData | null>(null);


    useEffect(() => {
        // Comprobar si las quests ya están en localStorage
        const storedQuests = localStorage.getItem('quests');
        
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
                .then((data: QuestsData) => {
                    
                    setQuests(checkQuestsFinished(data));

                })
                .catch((err) => {
                    console.log(err)
                });
        }
    }, []);

    return { quests};
}
