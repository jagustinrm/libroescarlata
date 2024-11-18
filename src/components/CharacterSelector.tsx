import './CharacterSelector.css'
import { useEffect, useState } from "react";
// @ts-expect-error Calcular vida inicial 
import {calculateInitialHealth} from '../utils/calculateInitialHealth.js'
// @ts-expect-error Armas por clase
import {assignWeaponByClass} from '../utils/assignWeaponByClass.js'
export default function CharacterSelector() {
    const [username, setUsername] = useState<string | null>('');
    const [charClasses, setCharClasses] = useState<Class[]>([]); // Cambiado a arreglo de Class
    const [initialWeapons, setInitialWeapons] = useState<Weapon[]>([]);
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
    interface Weapon {
        name: string;
        type: string; // Por ejemplo: melee, ranged
        damage: string; // Ejemplo: "1d6"
        critical: string; // Ejemplo: "19-20/x2"
        range?: string; // Opcional, para armas a distancia
        weight: string; // Ejemplo: "3 lb"
        cost: string; // Ejemplo: "15 gp"
        properties: string[]; // Propiedades especiales, como "ligera" o "versátil"
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
        const loadInitWeapon = async () => {
            try {
                const res = await fetch('/mocks/weapons.json');
                const data = await res.json();
                setInitialWeapons(data) 
            } catch (error) {
                console.error("Error loading weapon:", error);
            }
        }
        loadCharacters();
        loadInitWeapon();
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
        assignWeaponByClass(clase)
    };

    return (
        <div className='containerClases'>
            <h1>Hola, {username ? username : 'Invitado'}</h1>
            <p>Elige tu clase:</p>
            <div className='botones'>
                <a href="/home">
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
                </a>
            </div>
        </div>
    );
}
