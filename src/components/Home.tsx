import {usePlayerStore} from '../stores/playerStore';
import { useNavigate } from "react-router-dom";
import './Home.css'
import openMissions from '../utils/openMissionsWindow.ts'
import useInventoryStore from '../stores/inventoryStore.ts';


export default function Home ()  {
    const { player, setP_LeftHealth} = usePlayerStore();
    const {inventories} = useInventoryStore();

    const navigate = useNavigate();

    const handleFight = (type: string) => {
        navigate("/fightScene?type="+ type);
    };
    const handlePetButton = () => {
        navigate("/petStore");
    }
    const handleInventoryButton = () => {
        navigate("/inventory");
    }

    const handleHealthRecover = () => {
        setP_LeftHealth(player.p_MaxHealth)
    }

    console.log(inventories[player.inventoryId])
    return (
        <div className="container">
            <div className="player">
                <div className="stats" >
                <p>👤 {player.name} </p>
                <p>🛡️ {player.classes}</p>
                <p>⭐ Nivel: {player.level}</p>
                <p>❤️ Vida: {player.p_LeftHealth} / {player.p_MaxHealth}</p>
                <p>✨ Exp: {player.playerExp} / {player.p_ExpToNextLevel}</p>
                <p>Arma actual: {player.selectedWeapon?.name || "Sin arma equipada"}</p>
                {player.selectedPet? <p>🐶 Mascota: {player.selectedPet.name} </p> : <></>} 
                </div>
               <button onClick={() => handleInventoryButton()}>📜 Inventario</button>
            </div>

            {/* Botones en dos columnas a la derecha */}
            <div className="buttons">
                 <button onClick={() => handleFight('normal')} disabled={player.p_LeftHealth === 0}>
                ⚔️ Pelear
                </button>
                <button onClick={() => handleFight('dungeon')} disabled={player.p_LeftHealth === 0} > 🏔️ Dungeon</button>   
                <a href="/townMap"><button>🏠 Hogar</button></a>
                <a href="#"><button onClick={() => handleHealthRecover()}>🏥 Hospital</button></a>
                <a href="#"><button>🛒 Tienda</button></a>
                <a href="#"><button>⚔️ Armería</button></a>
                <button onClick={() => handlePetButton()}>🐾 Mascotas</button>
                <a href="#"><button>🐉 Bestiario</button></a>
                <button onClick={openMissions}>🗺️ Misiones</button>
            </div>
        </div>
    );
}
