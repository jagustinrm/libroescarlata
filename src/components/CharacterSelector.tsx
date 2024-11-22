import './CharacterSelector.css'
import { useEffect, useState } from "react";
// @ts-expect-error Calcular vida inicial 
import {calculateInitialHealth} from '../utils/calculateInitialHealth.js'
// @ts-expect-error Armas por clase
import {assignIdWeaponByClass} from '../utils/assignWeaponByClass.js'
// @ts-expect-error Inventario
import {createInitialInventory} from '../utils/inventoryUtils.js'

export default function CharacterSelector() {
    const [username, setUsername] = useState<string | null>('');
    const [charClasses, setCharClasses] = useState<Class[]>([]); // Cambiado a arreglo de Class
     interface Class {
        name: string;
        hitDie: string;
        armorClass: string;
        baseAttackBonus: string;
        saves: {
            fortitude: string;
            reflex: string;
            will: string;
        };
        classFeatures: string[];
    }
    
    
    

    useEffect(() => {
        const loadCharacters = async () => {
            try {
                const res = await fetch('/mocks/clases.json');
                const data = await res.json();
                setCharClasses(data); 
            } catch (error) {
                console.error("Error loading XP table:", error);
            }
        };
        loadCharacters();
     
    }, []);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
    }, []);

    const handleButtonClick = (
        clase: string,
        hitDie: string,
        armorClass: string,
        baseAttackBonus: string,
        saves: { fortitude: string; reflex: string; will: string },
        classFeatures: string[]
    ) => {
        localStorage.setItem('classC', clase);
        localStorage.setItem('level', '1');
        localStorage.setItem('playerExp', '0');
        localStorage.setItem('xpToNextLevel', '1000');
        localStorage.setItem('prevLevelXp', '0');
        localStorage.setItem('dungeonLevel', '1') // NIVEL INICIAL DEL DUNGEON
        const additionalData = {
            hitDie,
            armorClass,
            baseAttackBonus,
            saves,
            classFeatures
        };
        const InitialHealth = calculateInitialHealth(hitDie).toString()
        localStorage.setItem('playerHealth', InitialHealth)
        localStorage.setItem('playerHealthLeft', InitialHealth)
        localStorage.setItem('additionalData', JSON.stringify(additionalData));
        createInitialInventory()
        assignIdWeaponByClass(clase)
        type enemyCounter = {
            id: number;
            name: string;
            count: number;
        }
        const deletedEnemies: enemyCounter[] = [];
        localStorage.setItem('deletedEnemies', JSON.stringify(deletedEnemies))
        type typeCompletedMQuests = {
            id: number;
            name: string;
            completed: boolean;
        }
        const completedQuests: typeCompletedMQuests[] = [
            {
                id: 1,
                name: "Derrotar al Esqueleto Humanoide",
                completed: true
            }

        ];
        localStorage.setItem('completedQuests', JSON.stringify(completedQuests))



        window.location.href = "/home"; 

    };

    return (
        <div className='containerClases'>
            <h1>Hola, {username ? username : 'Invitado'}</h1>
            <p>Elige tu clase:</p>
            <div className='buttonsClasses'>
               
                    {charClasses? 
                    charClasses.map((clase: Class) => (
                        <button
                            className='botonesClases'
                            key={clase.name}
                            onClick={() =>
                                handleButtonClick(
                                    clase.name,
                                    clase.hitDie,
                                    clase.armorClass,
                                    clase.baseAttackBonus,
                                    clase.saves,
                                    clase.classFeatures
                                )
                            }
                        >
                            {clase.name}
                        </button>

                    ))
                    :
                    <p>Error</p>
                    }

            </div>
        </div>
    );
}
