import { useSearchParams } from "react-router-dom";
import  usePostCombatActions  from "../customHooks/usePostCombatActions"; // Asegúrate de importar el hook
import {usePlayerStore} from '../stores/playerStore.js';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FightScene.css";
import './UI/designRpg.css'
// @ts-expect-error Para que funcione 
import { useEnemyLoader } from "../customHooks/useEnemyLoader.js";
// @ts-expect-error Para que funcione 
import {checkLevelUp} from '../utils/checkLevelUp.js'
// @ts-expect-error Para que funcione 
import {calculateInitialHealth} from '../utils/calculateInitialHealth.js'
import { handleAttack} from '../utils/combatHandlers';
import { EnemyDeleted } from "./interfaces/characterProperties";
import { useLoadQuests } from "../customHooks/useLoadQuests.js";
import { QuestData }from "./interfaces/QuestsInt.ts";
// @ts-expect-error Para que funcione 
import useExpTable from "../customHooks/useExpTable.js";
import useInventoryStore from "../stores/inventoryStore.ts";
import usePotionStore from "../stores/potionsStore.ts";
import {rollDice} from '../utils/rollDice.ts'
import MessageBox from './UI/MessageBox.tsx';

export default function FightScene() {
    const [messageState, setMessageState] = useState({
        show: false,
        content: '',
        type: '',
        redirectHome: false,
      });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fightType = searchParams.get("type") || "normal";
    const [triggerPostActions, setTriggerPostActions] = useState(false);
    const {player, playerActions } = usePlayerStore();
    const {inventories, removeItem} = useInventoryStore();
    const {potions} = usePotionStore();
    const {expTable, setExpTable}  = useExpTable()
    const [actionMessages, setActionMessages] = useState<string[]>([]);  // Estado para el mensaje de acción
    const {quests} = useLoadQuests();
    const [turn, setTurn] = useState<"player" | "enemy">("player");
    const switchTurn = () => {
        setTurn((prevTurn) => (prevTurn === "player" ? "enemy" : "player"));
    };
    const [pet, setPet] = useState<string | null>('')
        const [dungeonLevel, setDungeonLevel] = useState<number>(() => {
            const storedLevel = localStorage.getItem("dungeonLevel");
            return storedLevel ? parseInt(storedLevel, 10) : 1;
        });
        const [enemiesDeleted, setEnemiesDeleted] = useState<Array<EnemyDeleted>>(() => {
            const storageEnemiesDeleted = localStorage.getItem('deletedEnemies');
            return storageEnemiesDeleted? JSON.parse(storageEnemiesDeleted) as Array<EnemyDeleted> : []
        } )
        const [updateEnemy, setUpdateEnemy] = useState<boolean>(false)
        const { enemy, isLoading, error, typeEnemy } = useEnemyLoader(player.level, dungeonLevel, updateEnemy);
        const defaultQuests: QuestData = {
            questTree: {
                history: [],
                secondary: [],
                others: []
            }
        };

        //REVISAR ESTO, TENGO DOS HANDLEPOSTCOMBATACTIONS
        const { handlePostCombatActs } = usePostCombatActions(setDungeonLevel, 
            setEnemiesDeleted, enemiesDeleted, enemy, quests || 
            defaultQuests, playerActions, player
        );

    
        // Inicializamos los estados sin depender directamente de `enemy`
        const [enemyHealth, setEnemyHealth] = useState<number>(1);
    // const [playerMana, setPlayerMana] = useState<number>(100);
    const handleCheckLevelUp = () => {
        checkLevelUp({
            player,
            setActionMessages,
            calculateInitialHealth, playerActions,
            expTable, setExpTable
        });
    };
// ************************ATAQUE DE ENEMIGO *************************
    useEffect(() => {
        if (turn === "enemy" && enemyHealth > 0 && player.p_LeftHealth > 0 ) {
            const enemyAttackTimeout = setTimeout(() => {
                const damageDice = enemy["attacks"][0].damage
                const damage = rollDice(damageDice); 
                playerActions.setP_LeftHealth(Math.max(player.p_LeftHealth - damage, 0));
                setActionMessages((prev) => [...prev, `El enemigo te ha atacado con ${enemy["attacks"][0].name} y causó ${damage} puntos de daño.`]);
                switchTurn(); 
            }, 1000); 
    
            return () => clearTimeout(enemyAttackTimeout); 
        } 
    }, [turn]);

// ************************ATAQUE DE ENEMIGO *************************
    useEffect(() => {
        const pet = localStorage.getItem('pet')
        setPet(pet)
        handleCheckLevelUp(); // Verificar subida de nivel
    }, [player.playerExp]);
    
    useEffect(() => {
        if (triggerPostActions) {
            handlePostCombatActs(fightType, enemyHealth, typeEnemy);
            setTriggerPostActions(false); // Resetea el trigger
        }
    }, [triggerPostActions, enemyHealth]);



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

    if (isLoading) {
        return <p>Cargando enemigo...</p>;
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleNewEnemyClick = () => {

        handleMessage(`${player.name} busca un nuevo enemigo...`, "success", false);
        setTimeout(() => {
            setTurn("player")
            if (updateEnemy) {
                setUpdateEnemy(false);
            } else {
                setUpdateEnemy(true);
    
            }
        }, 1000);

    };

    const handleHealing = () => {
        const potionName = "Poción de Curación Menor";
        const currentHealth = player.p_LeftHealth;
        const maxHealth = player.p_MaxHealth;
    
        // Función para eliminar la poción
        const removePotion = () => {
            const potionIndex = inventories[player.inventoryId].potions.findIndex(p => p === potionName);
            if (potionIndex !== -1) {
                removeItem(player.inventoryId, "potions", inventories[player.inventoryId].potions[potionIndex]);
            } else {
                console.log("Poción no encontrada.");
            }
        };
    
        // Verificar si se necesita curación
        if (currentHealth < maxHealth) {
            const foundPotion  = potions.find(p => p.name === potionName)
            if (!foundPotion) return
            const amountHealingDice = foundPotion.effect?.amount
            if (amountHealingDice) {
                const amountHealing = rollDice(amountHealingDice)
                const totalLeftHealth = currentHealth + amountHealing
                // Establecer la nueva salud, sin exceder la salud máxima
                playerActions.setP_LeftHealth(Math.min(totalLeftHealth, maxHealth));
                // Eliminar la poción utilizada
                removePotion();
            }


        } else {
            handleMessage("Tu vida está completa", "success", false);
        }
    };
    
    
    const executeAttack = () => {
        if (turn !== "player") return;
        handleAttack({
            enemyHealth,setEnemyHealth,
            player, playerActions,
            navigate,
            setActionMessages,
            enemy,
            fightType,
            typeEnemy,
        });

        setTriggerPostActions(true);
        switchTurn(); 
    };


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

    return (
    <div className="fight-scene ">
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
                
                {/* <p>Maná: {playerMana}/100</p> */}
                            {/* Barra de experiencia */}
            <div className="experience-bar-container">
                <div className="experience-bar" style={{ width: `${xpPercentage}%` }}></div>
                <span className="experience-text">{player.playerExp} / {player.p_ExpToNextLevel}</span>
            </div>
                <div className="attackAndPotions">
                    <button className="rpgui-button newDesign"  onClick={executeAttack} disabled={enemyHealth === 0 || player.p_LeftHealth === 0 || turn === "enemy"}>
                        ⚔️ Atacar
                    </button>
                    {pocion && (
                         <button onClick={handleHealing} disabled={enemyHealth === 0 || player.p_LeftHealth === 0}>
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
                        <li key={index}>{message}</li>  // Cada mensaje es un li
                    ))}
                </ul>
                {player.p_LeftHealth === 0 && <p>¡Has sido derrotado!</p>}
                {enemyHealth === 0 && 
                <div>
                    <div  className="container-endBattle">
                    <button onClick={handleNewEnemyClick} className="rpgui-button"> ⚔️ Seguir</button>
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
                        <img className="imgEnemy" src={enemy.img} alt={enemy.name} />
                        <p>Nivel: {enemy.level}</p>
                        <p>Vida: {enemyHealth}</p>
                            
                        {/* <p>Maná: {currentEnemy.mana}</p> */}
                    </div>
                ) : (
                    <p>No hay enemigo seleccionado.</p>
                )}
            </div>

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

