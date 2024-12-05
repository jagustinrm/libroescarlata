import { useSearchParams } from "react-router-dom";
import  usePostCombatActions  from "../customHooks/usePostCombatActions"; 
import { usePlayerStore } from '../stores/playerStore.js';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FightScene.css";
import './UI/designRpg.css'
import { useEnemyLoader } from "../customHooks/useEnemyLoader.ts";
// @ts-expect-error Para que funcione 
import { checkLevelUp } from '../utils/checkLevelUp.js'
// @ts-expect-error Para que funcione 
import {calculateInitialHealth} from '../utils/calculateInitialHealth.js'
import { handleAttack, handleSpell} from '../utils/combatHandlers';
import { useLoadQuests } from "../customHooks/useLoadQuests.js";
import { QuestData }from "./interfaces/QuestsInt.ts";
// @ts-expect-error Para que funcione 
import useExpTable from "../customHooks/useExpTable.js";
import useInventoryStore from "../stores/inventoryStore.ts";
import usePotionStore from "../stores/potionsStore.ts";
import MessageBox from './UI/MessageBox.tsx';
import { useEnemyTurn } from "../customHooks/useEnemyTurn.ts";
import { handleNewEnemyClick } from "../utils/handleNewEnemyClick.ts";
import { handleHealing } from "../utils/handleHealing.ts";
import SoundPlayer from "./UI/soundPlayer/SoundPlayer.tsx";
import GameBoard from "./battlefield/GameBoard .tsx";
import useSpellStore from "../stores/spellsStore.ts";
import Dropdown from "../utils/DropDown.tsx";
// import { Spell } from "../stores/types/spells";


export default function FightScene() {
    const [boardPosition, setBoardPosition] = useState({ top: 10, left: 23 });
    const [messageState, setMessageState] = useState({show: false,content: '',type: '',redirectHome: false});
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fightType = searchParams.get("type") || "normal";
    const [triggerPostActions, setTriggerPostActions] = useState(false);
    const {player, playerActions } = usePlayerStore();
    const {spells} = useSpellStore();
    const {inventories, removeItem} = useInventoryStore();
    const {potions} = usePotionStore();

    const initialX = 0;
    const initialY = 45;
    // Compensar el ancho y alto de la imagen
    const offsetX = 10 / 1.2;
    const offsetY = 20 / 1.5;
    const [playerPosition, setPlayerPosition] = useState(
        { // PLAYER
            x: initialX - offsetX,
            y: initialY - offsetY,
        },
    )
    const [enemyPosition, setEnemyPosition] = useState(
        { // ENEMY
            x: 45 - offsetX,
            y: 0 - offsetY,
        }
    )
    const [soundType, setSoundType] = useState<string>('');
    const {expTable, setExpTable}  = useExpTable()
    const [actionMessages, setActionMessages] = useState<string[]>([]);  // Estado para el mensaje de acción
    const {quests} = useLoadQuests();
    const [turn, setTurn] = useState<"player" | "enemy">("player");
    const switchTurn = () => {setTurn((prevTurn) => (prevTurn === "player" ? "enemy" : "player"))};
    const [pet, setPet] = useState<string | null>('')
    const [dungeonLevel, setDungeonLevel] = useState<number>(() => {
        const storedLevel = localStorage.getItem("dungeonLevel");
        return storedLevel ? parseInt(storedLevel, 10) : 1;
    });

    const [updateEnemy, setUpdateEnemy] = useState<boolean>(false)
    const { enemy, isLoading, error, typeEnemy } = useEnemyLoader(player.level, dungeonLevel, updateEnemy);
    const defaultQuests: QuestData = {
        questTree: {
            history: [],
            secondary: [],
            others: []
        }
    };
    const { handlePostCombatActs } = usePostCombatActions(setDungeonLevel, enemy, quests || 
        defaultQuests, playerActions, player
    );
    const [enemyHealth, setEnemyHealth] = useState<number>(1);
    const handleCheckLevelUp = () => {
        checkLevelUp({
            player,
            setActionMessages,
            calculateInitialHealth, playerActions,
            expTable, setExpTable
        });
    };
    const [canAttack, setCanAttack] = useState(false)
    const [selectedSpell, setSelectedSpell] = useState<string>(''); 
// ************************USEEFFECTS ******************************
    useEffect(() => {
        handleCheckLevelUp(); // Verificar subida de nivel

    }, [player.playerExp]);

    useEffect(() => {
        const pet = localStorage.getItem('pet')
        setPet(pet)

    }, [])

    useEffect(() => {
        if (triggerPostActions) {
            handlePostCombatActs(fightType, enemyHealth, typeEnemy);
            setTriggerPostActions(false); // Resetea el trigger
        }

    }, [triggerPostActions]);

    useEffect(() => {
        
        if (enemyHealth === 0) {
            handleMessage("¡Has ganado el combate!", "success", false);
        }

    }, [enemyHealth]);

    // Efecto para actualizar los estados cuando `enemy` esté disponible
    useEffect(() => {

        if (enemy) {
            setEnemyHealth(enemy.health);
        }

    }, [enemy]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setBoardPosition((prevPosition) => {
                switch (event.key) {
                    case "ArrowUp":
                        return { ...prevPosition, top: Math.max(prevPosition.top - 1, 0) }; // Evitar valores negativos
                    case "ArrowDown":
                        return { ...prevPosition, top: Math.min(prevPosition.top + 1, 90) }; // Ajustar el límite inferior
                    case "ArrowLeft":
                        return { ...prevPosition, left: Math.max(prevPosition.left - 1, 0) }; // Evitar valores negativos
                    case "ArrowRight":
                        return { ...prevPosition, left: Math.min(prevPosition.left + 1, 90) }; // Ajustar el límite derecho
                    default:
                        return prevPosition;
                }
            });
        };
    
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
// ************************USEEFFECTS ******************************
// ************************COMBATE *************************
   
    useEnemyTurn({
        enemy,
        turn,
        enemyHealth,
        player,
        playerActions,
        setActionMessages,
        switchTurn,
        playerPosition,
        enemyPosition,
        setEnemyPosition,

    });

    const executeAttack = () => {
        if (turn !== "player") return;
        setSoundType("attack")
        handleAttack({
            enemyHealth,setEnemyHealth,
            player, playerActions,
            setActionMessages,
            fightType, enemy
        });
        setTriggerPostActions(true);
        switchTurn(); 
        setTimeout(() => {
            setSoundType("")
          }, 1000);
     
    };

    const executeSpell = () => {
        if (turn !== "player" || !selectedSpell) return;  
        handleSpell({
            enemyHealth, setEnemyHealth,
            player, playerActions,
            setActionMessages,
            fightType, enemy, selectedSpell, spells, playerPosition, enemyPosition
        });
        setTriggerPostActions(true);
        switchTurn();
    };

// ************************COMBATE *************************


    const handleMessage = (message: string, type: string, shouldClose: boolean) => {
        setMessageState({
          show: true,
          content: message,
          type,
          redirectHome: shouldClose,
        });
      };
    
      const handleClose = (shouldClose: boolean) => {
        setMessageState((prevState) => ({
          ...prevState,
          show: false,
        }));
        if (shouldClose) {
          navigate('/home');
        }
      };

    const xpPercentage = 
    player.p_ExpToNextLevel - player.p_ExpPrevLevel !== 0 
    ? ((player.playerExp - player.p_ExpPrevLevel) / (player.p_ExpToNextLevel - player.p_ExpPrevLevel)) * 100 
    : 0; 
    const healthPercentage = (player.p_LeftHealth / player.p_MaxHealth) * 100;
    const pocion = inventories[player.inventoryId].potions.find(p => p === "Poción de Curación Menor");
    
    if (isLoading) return <p>Cargando enemigo...</p>;
    if (error)  return <p>Error: {error}</p>;
    return (
    <div className="fight-scene">
        <div className="turn-indicator">
        {turn === "player" ? <h2>Tu turno</h2> : <h2>Turno del enemigo</h2>}
        </div>
            <div className="PlayerChar">
                <div>
                <p>{player.name}</p>
                <p>🛡️ {player.classes}</p>
                <p>Nivel {player.level}</p>
                </div>
            {/* Barra de vida */}
            <div className="bars">
                <div className="health-bar-container">
                    <div className="health-bar" style={{ width: `${healthPercentage}%` }}></div>
                    <span className="health-text">{player.p_LeftHealth} / {player.p_MaxHealth}</span>
                </div>
                    
                            {/* Barra de experiencia */}
                <div className="experience-bar-container">
                    <div className="experience-bar" style={{ width: `${xpPercentage}%` }}></div>
                    <span className="experience-text">{player.playerExp} / {player.p_ExpToNextLevel}</span>
                </div>
            </div>
                
                {pet? <p>Mascota: {pet}</p> : <></>}
                

            </div>
            <div className="attacks">
                    <button className="rpgui-button newDesign" id="newDesign" onClick={executeAttack} disabled={!canAttack || enemyHealth === 0 || player.p_LeftHealth === 0 || turn === "enemy"}>
                        ⚔️
                    </button>
                    {pocion && (
                         <button className="rpgui-button newDesign" id="newDesign" onClick={() => handleHealing({        player,
                            inventories,
                            potions,
                            removeItem,
                            playerActions,
                            handleMessage,
                            })} disabled={enemyHealth === 0 || player.p_LeftHealth === 0}>
                           {
                             // Buscar la poción en la lista de potions y mostrar la imagen
                             (() => {
                               const foundPotion = potions.find(p => p.name === "Poción de Curación Menor");
                               return foundPotion ? <img className="potionImg" src={foundPotion.img} alt={foundPotion.name} /> : null;
                             })()
                           }
                         </button>
                      )}
                
                    <div className="rpgui-container framed rpgui-draggable">
                    <Dropdown
                        id="spell-dropdown"
                        options={player.spells || []}
                        value={selectedSpell}
                        onChange={(value) => setSelectedSpell(value)}
                        disabled={turn !== "player" || enemyHealth === 0}
                    />
                        <button
                            onClick={executeSpell}
                            disabled={turn !== "player" || !selectedSpell || enemyHealth === 0}
                        >
                            Lanzar hechizo
                        </button>
                    </div>
                    {fightType === 'normal' || player.p_LeftHealth === 0 ?  
                    <button onClick={() => handleMessage(
                        "¡Has huido del combate!",
                        "warning",
                        true
                        )} className="rpgui-button newDesign">
                    😨 Huir</button> : <></>}  
            </div>      
            <div>
            {fightType=== 'dungeon'? <h1>Dungeon {dungeonLevel}</h1> : <></> }
                <ul className="action-log">
                    {actionMessages.map((message, index) => (
                        <li key={index}>{message}</li>  
                    ))}
                </ul>
                <div
                    className="gameBoard"
                    style={{
                        position: "absolute",
                        top: `${boardPosition.top}%`,
                        left: `${boardPosition.left}%`,
                    }}
                ><GameBoard 
                setCanAttack={setCanAttack} 
                enemy= {enemy}  
                setTurn = {setTurn}

                //************************************************ */
                playerPosition = {playerPosition}
                setPlayerPosition = {setPlayerPosition}
                enemyPosition = {enemyPosition}
                setEnemyPosition = {setEnemyPosition}
                />
                </div>
                <div className="defetedMessage">{player.p_LeftHealth === 0 && <p>¡Has sido derrotado!</p>}</div>

                {enemyHealth === 0 && 
                <div>
                    <div  className="container-endBattle">

                    <button onClick={() => handleNewEnemyClick({
                        player,
                        handleMessage,
                        setTurn,
                        updateEnemy,
                        setUpdateEnemy,
                        setPlayerPosition,
                        setEnemyPosition,
                    })} 
                        className="rpgui-button endBattleButton"> 
                        ⚔️ Seguir
                    </button>
                    {fightType === 'normal'?  <button className="rpgui-button endBattleButton" onClick={() => handleMessage(
                    "¡Has vuelto sano y salvo!",
                    "warning",
                    true
                    )}> Volver</button> : <></>}
                    </div>
                    <div className="blackScreen"></div>
                </div>
                }
            </div>
            <div className="EnemyChar">
                {typeEnemy === 'boss'? <h1 className="bossSign">BOSS</h1> : <></>}
                {enemy ? (
                    <div>
                        <h3>{enemy.name}</h3>
                        <p>Nivel: {enemy.level}</p>
                        <p>Vida: {enemyHealth}</p>
                            
                    </div>
                ) : (
                    <p>No hay enemigo seleccionado.</p>
                )}
            </div>
            {soundType &&
            <SoundPlayer soundType={soundType} volume={0.2} />
            }
            
            {messageState.show && (
                <MessageBox
                    message={messageState.content}
                    type={messageState.type as 'error' | 'warning' | 'success'}
                    onClose={() => handleClose(messageState.redirectHome)}
                />
            )}
        </div>
    );
}