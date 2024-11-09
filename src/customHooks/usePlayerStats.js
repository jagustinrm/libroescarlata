// usePlayerStats.js
import { useState, useEffect } from "react";

export function usePlayerStats() {
    const [playerHealth, setPlayerHealth] = useState(100);
    const [xpTable, setXpTable] = useState({}); 
    const [prevLevelXp, setPrevLevelXp] = useState(() => {
        const xpPrevNextLevel = localStorage.getItem('prevLevelXp');
        return  Number(xpPrevNextLevel); 
    }); 
    const [xpToNextLevel, setXpToNextLevel] = useState(() => {
        const xpToNextLevel = localStorage.getItem('xpToNextLevel');
        return  Number(xpToNextLevel); 
    }); 




    const gainXpToNextLevel = (level) => {
        const levelSum = level + 1
        const nextLevelXp = xpTable[levelSum.toString()] || xpTable[20]; // Evitar que supere el nivel 20
        const prevLevelXp = level > 1 && xpTable[level.toString()] || xpTable[20]; 
        setXpToNextLevel(nextLevelXp);
        setPrevLevelXp(prevLevelXp)
    };

    // const [xpTable, setXpTable] = useState<number[]>([
    //   0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000
    // ]);
    const [playerLevel, setPlayerLevel] = useState(() => {
        const storedLevel = localStorage.getItem('level');
        return storedLevel ? Number(storedLevel) : 1;  // Usar el valor guardado o 0 si no existe
    });
    const [playerXp, setPlayerXp] = useState(() => {
        const storedXp = localStorage.getItem('playerExp');
        return storedXp ? Number(storedXp) : 0;  // Usar el valor guardado o 0 si no existe
    });
    useEffect(() => {
        // Cargar el JSON al montar el componente
        const loadXpTable = async () => {
            try {
                const response = await fetch('/mocks/levelDictionary.json');
                const data = await response.json();
                setXpTable(data); // Guardar el JSON en el estado
            } catch (error) {
                console.error("Error loading XP table:", error);
            }
        };

        loadXpTable();
    }, []);

    useEffect(() => {
        localStorage.setItem('playerExp', playerXp.toString());
        localStorage.setItem('level', playerLevel.toString());
        localStorage.setItem('xpToNextLevel', xpToNextLevel.toString());
        localStorage.setItem('prevLevelXp', prevLevelXp.toString())
    }, [playerXp, playerLevel, xpToNextLevel]);

    const gainXP = (amount) => {
        const newXp = playerXp + amount;
        setPlayerXp(newXp);
    };



    return {
        playerHealth,
        setPlayerHealth,
        playerXp,
        gainXP,
        playerLevel,
        setPlayerLevel,
        xpToNextLevel,
        gainXpToNextLevel,
        prevLevelXp
    };
}
