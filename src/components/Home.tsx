import {usePlayerStore} from '../stores/playerStore';
import { useNavigate } from "react-router-dom";
// @ts-expect-error Para que funcione 
import { usePlayerStats } from '../customHooks/usePlayerStats.js';
// @ts-expect-error Para que funcione 
import { useLoadWeapons } from "../customHooks/useLoadWeapons.js";
import './Home.css'
import openMissions from '../utils/openMissionsWindow.ts'


export default function Home ()  {
    const { player, setP_LeftHealth} = usePlayerStore();
    const navigate = useNavigate();
    const handleFight = (type: string) => {
        navigate("/fightScene?type="+ type);
    };
    const handleHealthRecover = () => {
        setP_LeftHealth(player.p_MaxHealth)
    }

    const {pet, charActualWeapon
    } = usePlayerStats();
    useLoadWeapons();
   

    return (
        <div className="container">
            <div className="player">
                <div className="stats" >
                <p>👤 {player.name} </p>
                <p>🛡️ {player.classes}</p>
                <p>⭐ Nivel: {player.level}</p>




                                {/* *****ACA******* */}
                <p>❤️ Vida: {player.p_LeftHealth} / {player.p_MaxHealth}</p>
 
                                    {/* *****ACA******* */}



                <p>✨ Exp: {player.playerExp} / {player.p_ExpToNextLevel}</p>
                <p>Arma actual: {charActualWeapon?.name || "Sin arma equipada"}</p>
                {pet? <p>🐶 Mascota: {pet} </p> : <></>} 
                </div>
                <a href="/inventary"><button>📜 Inventario</button></a>
            </div>
   
            {/* Botones en dos columnas a la derecha */}
            <div className="buttons">


                  {/* *****ACA******* */}

                 <button onClick={() => handleFight('normal')} disabled={player.p_LeftHealth === 0}>
                ⚔️ Pelear
                </button>
                <button onClick={() => handleFight('dungeon')} disabled={player.p_LeftHealth === 0} > 🏔️ Dungeon</button>
                  {/* *****ACA******* */}


                
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
