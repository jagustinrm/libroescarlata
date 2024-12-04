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
// import { Spell } from "../stores/types/spells";
export default function FightScene() {
    const [messageState, setMessageState] = useState({show: false,content: '',type: '',redirectHome: false});
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fightType = searchParams.get("type") || "normal";
    const [triggerPostActions, setTriggerPostActions] = useState(false);
    const {player, playerActions } = usePlayerStore();
    const {spells} = useSpellStore();
    const {inventories, removeItem} = useInventoryStore();
    const {potions} = usePotionStore();
    const [charPositions, setCharPositions] = useState(null)
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

    const executeSpell = (spell: string) => {
        handleSpell({
            enemyHealth,setEnemyHealth,
            player, playerActions,
            setActionMessages,
            fightType, enemy, spell, spells, charPositions
        });
    }

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
                <p>{player.name}</p>
                <p>🛡️ {player.classes}</p>
                <p>Nivel {player.level}</p>


            {/* Barra de vida */}
            <div className="health-bar-container">
                <div className="health-bar" style={{ width: `${healthPercentage}%` }}></div>
                <span className="health-text">{player.p_LeftHealth} / {player.p_MaxHealth}</span>
            </div>
                
                            {/* Barra de experiencia */}
            <div className="experience-bar-container">
                <div className="experience-bar" style={{ width: `${xpPercentage}%` }}></div>
                <span className="experience-text">{player.playerExp} / {player.p_ExpToNextLevel}</span>
            </div>
                <div className="attackAndPotions">
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
                </div>
                <div>
                    <select         
                    name="spells" 
                    defaultValue=""
                    id="spells" 
                    onChange={(e) => executeSpell(e.target.value)}>
                        <option value="" disabled>
                            Elegí un hechizo
                        </option>
                        {player.spells.map((spell) => (
                            <option key={spell} value={spell}>
                                {spell}
                            </option>
                        ))}
                    </select>
                </div>
                {pet? <p>Mascota: {pet}</p> : <></>}

                {fightType === 'normal' || player.p_LeftHealth === 0 ?  
                <button onClick={() => handleMessage(
                    "¡Has huido del combate!",
                    "warning",
                    true
                    )} className="rpgui-button newDesign">
                😨 Huir</button> : <></>}
            </div>

            <div >
            {fightType=== 'dungeon'? <h1>Dungeon {dungeonLevel}</h1> : <></> }
                <ul className="action-log">
                    {actionMessages.map((message, index) => (
                        <li key={index}>{message}</li>  
                    ))}
                </ul>
                <div className="gameBoard"><GameBoard 
                setCanAttack={setCanAttack} 
                setCharPositions = {setCharPositions}  
                enemy= {enemy}  
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
                })} className="rpgui-button"> ⚔️ Seguir</button>
                    {fightType === 'normal'?  <button className="rpgui-button" onClick={() => handleMessage(
                    "¡Has vuelto sano y salvo!",
                    "warning",
                    true
                    )}> Volver</button> : <></>}
                    </div>

                </div>
                }
            </div>
            <div className="EnemyChar">
                {typeEnemy === 'boss'? <h1 className="bossSign">BOSS</h1> : <></>}
                {enemy ? (
                    <div>
                        <h3>{enemy.name}</h3>
                        {/* <img className="imgEnemy" src={enemy.img} alt={enemy.name} /> */}
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