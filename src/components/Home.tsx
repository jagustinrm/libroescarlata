import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// @ts-expect-error Para que funcione 
import { usePlayerStats } from '../customHooks/usePlayerStats.js';
// @ts-expect-error Para que funcione 
import { useLoadWeapons } from "../customHooks/useLoadWeapons.js";
import './Home.css'
import { Weapon } from './interfaces/Weapon'; 

export default function Home() {
    const [username, setUsername] = useState<string | null>('');
    const [classC, setClassC] = useState<string | null>('');
    const { setPlayerHealthLeft, playerHealthLeft, playerHealth, playerXp, playerLevel, xpToNextLevel} = usePlayerStats();
    useLoadWeapons();
    const [charActualWeapon, setCharActualWeapon] = useState<Weapon | null>(null);

    const [pet, setPet] = useState<string | null>('')

    const navigate = useNavigate();

    const handleFight = (type: string) => {
        navigate("/fightScene?type="+ type);
    };
  
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
    
        const storedclassC = localStorage.getItem('classC');
        setClassC(storedclassC);
    
        const pet = localStorage.getItem('pet');
        setPet(pet);
        
        const weapon = localStorage.getItem('charActualWeapon');
        setCharActualWeapon(weapon ? JSON.parse(weapon) : null);
    }, []); 

    const handleHealthRecover = () => {
        setPlayerHealthLeft(playerHealth)
        localStorage.setItem('playerHealthLeft', playerHealth);
    }

    const openMissions = () => {
        const windowFeatures = 'width=400,height=400,top=100,left=100';
            // Obtener la URL actual y agregar el segmento "/quests"
        const currentUrl = window.location.origin; 
        const newUrl = `${currentUrl}/quests`;

        // Abrir la ventana con la nueva URL
        window.open(newUrl, '_blank', windowFeatures);
        }

    return (
        <div className="container">
            {/* Estadísticas del personaje a la izquierda */}
            <div className="player">
                <div className="stats" >
                <p>👤 {username}</p>
                <p>🛡️ {classC}</p>
                <p>⭐ Nivel: {playerLevel}</p>
                <p>❤️ Vida: {playerHealthLeft} / {playerHealth}</p>
                <p>✨ Exp: {playerXp} / {xpToNextLevel}</p>
                <p>Arma actual: {charActualWeapon?.name || "Sin arma equipada"}</p>
                {pet? <p>🐶 Mascota: {pet} </p> : <></>} 
                </div>
                <a href="/inventary"><button>📜 Inventario</button></a>
            </div>
   
            {/* Botones en dos columnas a la derecha */}
            <div className="buttons">
                 <button onClick={() => handleFight('normal')} disabled={playerHealthLeft === 0}>
                ⚔️ Pelear
                </button>
                <button onClick={() => handleFight('dungeon')} disabled={playerHealthLeft === 0} > 🏔️ Dungeon</button>
                <a href="/townMap"><button>🏠 Hogar</button></a>
                <a href="#"><button onClick={() => handleHealthRecover()}>🏥 Hospital</button></a>
                <a href="#"><button>🛒 Tienda</button></a>
                <a href="#"><button>⚔️ Armería</button></a>
                <a href="/petStore"><button>🐾 Mascotas</button></a>
                <a href="#"><button>🐉 Bestiario</button></a>
                <button onClick={openMissions}>🗺️ Misiones</button>
            </div>
        </div>
    );
    
    
    
}