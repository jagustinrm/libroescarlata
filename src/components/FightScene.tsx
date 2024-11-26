import { useSearchParams } from "react-router-dom";
import  usePostCombatActions  from "../customHooks/usePostCombatActions"; // Asegúrate de importar el hook
import {usePlayerStore} from '../stores/playerStore.js';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FightScene.css";
// @ts-expect-error Para que funcione 
import { usePlayerStats } from '../customHooks/usePlayerStats.js';
// @ts-expect-error Para que funcione 
import { useEnemyLoader } from "../customHooks/useEnemyLoader.js";
// @ts-expect-error Para que funcione 
import {checkLevelUp} from '../utils/checkLevelUp.js'
// @ts-expect-error Para que funcione 
import {calculateInitialHealth} from '../utils/calculateInitialHealth.js'
import { handleAttack, handleRun, handleBack, handleNewEnemy} from '../utils/combatHandlers';
import { Weapon } from "./interfaces/Weapon.js";
import { EnemyDeleted } from "./interfaces/characterProperties";
import { useLoadQuests } from "../customHooks/useLoadQuests.js";
import { QuestData }from "./interfaces/QuestsInt.ts";
// @ts-expect-error Para que funcione 
import useExpTable from "../customHooks/useExpTable.js";
import useInventoryStore from "../stores/inventoryStore.ts";

export default function FightScene() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fightType = searchParams.get("type") || "normal";
    const [triggerPostActions, setTriggerPostActions] = useState(false);
    const {player, playerActions } = usePlayerStore();
    const {inventories} = useInventoryStore();
    console.log(inventories[player.inventoryId])
    const {expTable, setExpTable}  = useExpTable()
    const [actionMessages, setActionMessages] = useState<string[]>([]);  // Estado para el mensaje de acción
    const {hitDie } = usePlayerStats();
    const {quests} = useLoadQuests();
    const [charActualWeapon, setCharActualWeapon] = useState<Weapon | null>(null);
    const [pet, setPet] = useState<string | null>('')
        // Estados para el enemigo
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
        const { handlePostCombatActs } = usePostCombatActions(setDungeonLevel, setEnemiesDeleted, enemiesDeleted, enemy, quests || defaultQuests);

    
        // Inicializamos los estados sin depender directamente de `enemy`
        const [enemyHealth, setEnemyHealth] = useState<number>(1);
        const [enemyLevel, setenemyLevel] = useState<number>(1);
    // const [playerMana, setPlayerMana] = useState<number>(100);
    const handleCheckLevelUp = () => {
        checkLevelUp({
            player,
            setActionMessages,
            hitDie,
            calculateInitialHealth, playerActions,
            expTable, setExpTable
        });
    };

    useEffect(() => {
        const pet = localStorage.getItem('pet')
        setPet(pet)
        const weapon = localStorage.getItem('charActualWeapon');
        setCharActualWeapon(weapon ? JSON.parse(weapon) : null);

        handleCheckLevelUp(); // Verificar subida de nivel
        
    }, [player.playerExp]);
    
    useEffect(() => {
        if (triggerPostActions) {
            handlePostCombatActs(fightType, enemyHealth, typeEnemy);
            setTriggerPostActions(false); // Resetea el trigger
        }
    }, [triggerPostActions, enemyHealth, handlePostCombatActs]);





    
    // Efecto para actualizar los estados cuando `enemy` esté disponible
    useEffect(() => {
        if (enemy) {
            setEnemyHealth(enemy.health);
            setenemyLevel(enemy.level);

        }
    }, [enemy]);

    if (isLoading) {
        return <p>Cargando enemigo...</p>;
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleNewEnemyClick = () => {
        handleNewEnemy(player.name);
        updateEnemy? setUpdateEnemy(false) : setUpdateEnemy(true) 
    };

 
    
    const executeAttack = () => {
        handleAttack({
            player,
            navigate,
            enemyHealth,
            setEnemyHealth,
            enemyLevel,
            setActionMessages,
            charActualWeapon,
            enemy,
            fightType,
            typeEnemy,
            playerActions
        });

        setTriggerPostActions(true);
    };




    const xpPercentage = ((player.playerExp - player.p_ExpPrevLevel) / (player.p_ExpToNextLevel - player.p_ExpPrevLevel)) * 100;
    const healthPercentage = (player.p_LeftHealth / player.p_MaxHealth) * 100;
   
    return (
        <div className="fight-scene">
            
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
                <button  onClick={executeAttack} disabled={enemyHealth === 0 || player.p_LeftHealth === 0}>
                    ⚔️ Atacar
                </button>
                {pet? <p>Mascota: {pet}</p> : <></>}

                {fightType === 'normal' || player.p_LeftHealth === 0 ?  <button onClick={() => handleRun({ player, navigate })}> 😨 Huir</button> : <></>}
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
                    <p>¡Has derrotado al enemigo!</p>
                    <button onClick={handleNewEnemyClick}> ⚔️ Buscar otro enemigo</button>
                    {fightType === 'normal'?  <button onClick={() => handleBack({ player, navigate })}> Volver</button> : <></>}
                    

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
        </div>
    );
}

