import { useState, useEffect } from "react";

export function usePlayerStats() {

    const [pet, setPet] = useState( () => {
        const storedPet = localStorage.getItem('pet');
        return  String(storedPet); 
    })

    const [charActualWeapon, setCharActualWeapon] = useState( () => {
        const storedWeapon = localStorage.getItem('charActualWeapon');
        return  (storedWeapon ? JSON.parse(storedWeapon) : null); 
    })
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
const additionalData = localStorage.getItem('additionalData');
    const [hitDie, setHitDie] = useState(() => {
        return additionalData ? JSON.parse(additionalData).hitDie || 'd4' : 'd4'; // Usa 'd4' como valor predeterminado si no está presente
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
        localStorage.setItem('xpToNextLevel', xpToNextLevel.toString());
        localStorage.setItem('prevLevelXp', prevLevelXp.toString())

        
    }, []);




    return {
        hitDie,
        pet, setPet,
        charActualWeapon, setCharActualWeapon
    };
}
