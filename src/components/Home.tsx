import {usePlayerStore} from '../stores/playerStore';
import { useNavigate } from "react-router-dom";
// @ts-expect-error Para que funcione 
import { usePlayerStats } from '../customHooks/usePlayerStats.js';
// @ts-expect-error Para que funcione 
import { useLoadWeapons } from "../customHooks/useLoadWeapons.js";
import './Home.css'
import openMissions from '../utils/openMissionsWindow.ts'


export default function Home ()  {
    const { player} = usePlayerStore();
    
    const { classC, pet, setPlayerHealthLeft, playerHealthLeft, 
        playerHealth, playerXp, playerLevel, 
        xpToNextLevel, username, charActualWeapon
    } = usePlayerStats();
    useLoadWeapons();
   
    const navigate = useNavigate();
    const handleFight = (type: string) => {
        navigate("/fightScene?type="+ type);
    };
  
    const handleHealthRecover = () => {
        setPlayerHealthLeft(playerHealth)
        localStorage.setItem('playerHealthLeft', playerHealth);
    }

    return (
        <div className="container">
            {/* Estadísticas del personaje a la izquierda */}
            <div className="player">
                
                <div className="stats" >
                <p>{player.name}</p>
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
