import { usePlayerStore } from '../stores/playerStore';
import { useNavigate } from "react-router-dom";
import {  useState } from 'react';
import openMissions from '../utils/openMissionsWindow.ts';

import MessageBox from './UI/MessageBox.tsx';
import './Home.css';
import './Arrow.css';
import './UI/designRpg.css';
import Quests from './quests/Quests.tsx';
export default function Home() {
    const [showMessage, setShowMessage] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { player, playerActions } = usePlayerStore();
    const navigate = useNavigate();
    const [showMissions, setShowMissions] = useState(false);


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
            case 'itemShop':
                navigate("/itemShop");
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
                playerActions.setP_LeftHealth(player.p_MaxHealth);
                playerActions.setP_LeftMana(player.p_MaxMana)
                setShowMessage(true);
                break;
            case 'missions':
                openMissions();
                break;
            default:
                console.warn(`Acción no reconocida: ${action}`);
        }
    };

    const handleClose = () => {
        setShowMessage(false);
    };

    const handleStats = () => {
        navigate('/playerStats');
    };

    return (
        <div className={`home-container rpgui-container framed-golden-2`}>
            <div className={`sidebar ${isSidebarOpen ? "open" : "closed"} rpgui-container framed-golden-2`}>
                <button 
                    className="toggle-sidebar" 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? "◀️" : "📜"}
                </button>
                {isSidebarOpen && (
                    <div className="player">
                        <div className="stats">
                            <img className='playerAvatar' src={player.avatarImg} alt="avatar img" />
                            <p onClick={handleStats}>👤 {player.name}</p>
                            <p>🛡️ {player.classes}</p>
                            <p>⭐ Nivel: {player.level}</p>
                            <div className="p_leaftHealth">
                                <div className="heart">❤️</div>
                                <p> Vida: {player.p_LeftHealth} / {player.p_MaxHealth}</p>
                            </div>
                            <p>✨ Exp: {player.playerExp} / {player.p_ExpToNextLevel}</p>
                            <p>🛠️ Materiales: {player.playerMaterial}</p>
                            <p>🗡️ Arma actual: {player.selectedWeapon?.name || "Sin arma equipada"}</p>
                            {player.selectedPet && <p>🐶 Mascota: {player.selectedPet.name}</p>}
                        </div>
                        <button onClick={() => handleAction('inventory')} className="rpgui-button">📜 Inventario</button>
                    </div>
                )}
            </div>

            <div className="buttons ">
                <button 
                    onClick={() => 
                        handleAction('fight-normal')
                    } 
                    disabled={player.p_LeftHealth === 0}
                    className="rpgui-button">
                    ⚔️ Pelear
                </button>
                <button 
                    onClick={() => handleAction('fight-dungeon')} 
                    disabled={player.p_LeftHealth === 0}
                    className="rpgui-button">
                    🏔️ Dungeon
                </button>
                <div className="hospitalRecover">
                    <button 
                        onClick={() => handleAction('recoverHealth')} 
                        className="rpgui-button">
                        🏥 Hospital
                    </button>
                    {player.p_LeftHealth === 0 && <div className="arrows"></div>}
                </div>
                <button onClick={() => handleAction('townMap')} className="rpgui-button">🏠 Hogar</button>
                <button onClick={() => handleAction('itemShop')} className="rpgui-button">🛒 Tienda</button>
                <button onClick={() => handleAction('petStore')} className="rpgui-button">🐾 Mascotas</button>
                <button onClick={() => setShowMissions(true)} className="rpgui-button">🗺️ Misiones</button>
            </div>

            {showMessage && (
                <MessageBox
                    message="¡Te curaste toda la vida!"
                    type="success"
                    onClose={handleClose}
                />
            )}

            {showMissions && (
              <Quests onClose={() => setShowMissions(false)} />
            )}
            
        </div>
    );
}
