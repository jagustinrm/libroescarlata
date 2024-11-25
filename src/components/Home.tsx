import { usePlayerStore } from '../stores/playerStore';
import { useNavigate } from "react-router-dom";
import './Home.css';
import openMissions from '../utils/openMissionsWindow.ts';

export default function Home() {
    const { player, setP_LeftHealth } = usePlayerStore();
    const navigate = useNavigate();
    console.log(player)
    // Handler genérico para manejar acciones
    const handleAction = (action: string) => {
        switch (action) {
            case 'fight-normal':
                navigate("/fightScene?type=normal");
                break;
            case 'fight-dungeon':
                navigate("/fightScene?type=dungeon");
                break;
            case 'townMap':
                navigate("/townMap");
                break;
            case 'store':
                navigate("/store");
                break;
            case 'armory':
                navigate("/armory");
                break;
            case 'petStore':
                navigate("/petStore");
                break;
            case 'bestiary':
                navigate("/bestiary");
                break;
            case 'inventory':
                navigate("/inventory");
                break;
            case 'recoverHealth':
                setP_LeftHealth(player.p_MaxHealth);
                break;
            case 'missions':
                openMissions();
                break;
            default:
                console.warn(`Acción no reconocida: ${action}`);
        }
    };

    return (
        <div className="container">
            <div className="player">
                <div className="stats">
                    <p>👤 {player.name}</p>
                    <p>🛡️ {player.classes}</p>
                    <p>⭐ Nivel: {player.level}</p>
                    <p>❤️ Vida: {player.p_LeftHealth} / {player.p_MaxHealth}</p>
                    <p>✨ Exp: {player.playerExp} / {player.p_ExpToNextLevel}</p>
                    <p>Arma actual: {player.selectedWeapon?.name || "Sin arma equipada"}</p>
                    {player.selectedPet && <p>🐶 Mascota: {player.selectedPet.name}</p>}
                </div>
                <button onClick={() => handleAction('inventory')}>📜 Inventario</button>
            </div>

            {/* Botones en dos columnas a la derecha */}
            <div className="buttons">
                <button 
                    onClick={() => handleAction('fight-normal')} 
                    disabled={player.p_LeftHealth === 0}>
                    ⚔️ Pelear
                </button>
                <button 
                    onClick={() => handleAction('fight-dungeon')} 
                    disabled={player.p_LeftHealth === 0}>
                    🏔️ Dungeon
                </button>
                <button onClick={() => handleAction('townMap')}>🏠 Hogar</button>
                <button onClick={() => handleAction('recoverHealth')}>🏥 Hospital</button>
                <button onClick={() => handleAction('store')}>🛒 Tienda</button>
                <button onClick={() => handleAction('armory')}>⚔️ Armería</button>
                <button onClick={() => handleAction('petStore')}>🐾 Mascotas</button>
                <button onClick={() => handleAction('bestiary')}>🐉 Bestiario</button>
                <button onClick={() => handleAction('missions')}>🗺️ Misiones</button>
            </div>
        </div>
    );
}
