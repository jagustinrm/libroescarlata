// usePlayerStats.js
import { useState, useEffect } from "react";
import { calculateInitialHealth } from "../utils/calculateInitialHealth";
export function usePlayerStats() {
    const additionalData = localStorage.getItem('additionalData');
    const [xpTable, setXpTable] = useState({}); 
    const [prevLevelXp, setPrevLevelXp] = useState(() => {
        const xpPrevNextLevel = localStorage.getItem('prevLevelXp');
        return  Number(xpPrevNextLevel); 
    }); 
    const [xpToNextLevel, setXpToNextLevel] = useState(() => {
        const xpToNextLevel = localStorage.getItem('xpToNextLevel');
        return  Number(xpToNextLevel); 
    }); 
    
// Estados para additionalData

    const [hitDie, setHitDie] = useState(() => {
        return additionalData ? JSON.parse(additionalData).hitDie || 'd4' : 'd4'; // Usa 'd4' como valor predeterminado si no está presente
    });
    const [playerHealth, setPlayerHealth] = useState(() => 
        {
            const playerHealth = localStorage.getItem('playerHealth') 
            return  Number(playerHealth);
        });
    const [playerHealthLeft, setPlayerHealthLeft] = useState(() =>
        {
            const playerHealthLeft = localStorage.getItem('playerHealthLeft') 
            return  Number(playerHealthLeft);
        });


    const [armorClass, setArmorClass] = useState(() => localStorage.getItem('armorClass') || '');
    const [baseAttackBonus, setBaseAttackBonus] = useState(() => localStorage.getItem('baseAttackBonus') || '');
    const [saves, setSaves] = useState(() => {
        const savedSaves = localStorage.getItem('saves');
        return savedSaves ? JSON.parse(savedSaves) : { fortitude: '', reflex: '', will: '' };
    });
    const [classFeatures, setClassFeatures] = useState(() => {
        const savedFeatures = localStorage.getItem('classFeatures');
        return savedFeatures ? JSON.parse(savedFeatures) : [];
    });

    const gainXpToNextLevel = (level) => {
        const levelSum = level + 1
        const nextLevelXp = xpTable[levelSum.toString()] || xpTable[20]; // Evitar que supere el nivel 20
        const prevLevelXp = level > 1 && xpTable[level.toString()] || xpTable[20]; 
        setXpToNextLevel(nextLevelXp);
        setPrevLevelXp(prevLevelXp)
    };

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
        localStorage.setItem('playerHealth', playerHealth.toString())
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
        prevLevelXp,
        hitDie,
        playerHealthLeft, 
        setPlayerHealthLeft
    };
}
