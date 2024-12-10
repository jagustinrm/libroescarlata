import { useSearchParams } from "react-router-dom";
import  usePostCombatActions  from "../customHooks/usePostCombatActions"; 
import { usePlayerStore } from '../stores/playerStore.js';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./FightScene.css";
import './UI/designRpg.css'
import { useEnemyLoader } from "../customHooks/useEnemyLoader.ts";
// @ts-expect-error Para que funcione 
import { checkLevelUp } from '../utils/checkLevelUp.js'
// @ts-expect-error Para que funcione 
import {calculateInitialHealth} from '../utils/calculateInitialHealth.js'
// import { handleAttack, handleSpell} from '../utils/combatHandlers';
import { handleCombatAction } from '../utils/combatHandlers';
import { useLoadQuests } from "../customHooks/useLoadQuests.js";
import { QuestData }from "./interfaces/QuestsInt.ts";
// @ts-expect-error Para que funcione 
import useExpTable from "../customHooks/useExpTable.js";
import useInventoryStore from "../stores/inventoryStore.ts";
import usePotionStore from "../stores/potionsStore.ts";
import MessageBox from './UI/MessageBox.tsx';
import { useEnemyTurn } from "../customHooks/useEnemyTurn.ts";
import { useSummonTurn } from "../customHooks/useSummonTurn.ts";
import { handleHealing } from "../utils/handleHealing.ts";
import SoundPlayer from "./UI/soundPlayer/SoundPlayer.tsx";
import GameBoard from "./battlefield/GameBoard .tsx";
import useSpellStore from "../stores/spellsStore.ts";
import Dropdown from "../utils/DropDown.tsx";
// import { Spell } from "../stores/types/spells";
import KeyboardController from "../utils/KeyboardController.ts";
import PlayerCharacter from "./battlefield/PlayerCharacter.tsx";
import useCreatureStore from "../stores/creatures.ts";
import EndBattleActions from "./battlefield/EndBattleActions.tsx";
import EnemyChar from "./battlefield/EnemyChar.tsx";
import { Creature } from "../stores/types/creatures.ts";
export default function FightScene({setAmbientMusic, setMusicVolume, setIsMusicPlaying, isMusicPlaying}) {
    const [boardPosition, setBoardPosition] = useState({ top: 10, left: 23 });
    const [messageState, setMessageState] = useState({show: false,content: '',type: '',redirectHome: false});
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fightType = searchParams.get("type") || "normal";
    const logRef = useRef<HTMLUListElement>(null); // REFERENCIA DEL LOG PARA BAJAR CON SCROLL
    const {player, playerActions } = usePlayerStore();
    const {creature, setCreatureHealth} = useCreatureStore();
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
    const [summon, setSummon] = useState<Creature | null>(null);
    const [summonPosition, setSummonPosition] = useState(
        { // ENEMY
            x: playerPosition.x + 6,
            y: playerPosition.y + 4,
        }
    )
    const [soundType, setSoundType] = useState<string>('');
    const {expTable, setExpTable}  = useExpTable()
    const [actionMessages, setActionMessages] = useState<string[]>([]);  // Estado para el mensaje de acción
    const {quests} = useLoadQuests();
    const [turn, setTurn] = useState<"player" | "enemy" | "summon">("player");
    const switchTurn = () => {
        setTurn((prevTurn) => {
          if (prevTurn === "player") {
            // Si es el turno del jugador y existe un summon
            return summon ? "summon" : "enemy";
          } else if (prevTurn === "summon") {
            // Si es el turno del summon, pasa al enemigo
            return "enemy";
          } else if (prevTurn === "enemy") {
            // Si es el turno del enemigo, pasa al jugador
            return "player";
          }
          return prevTurn; // Fallback en caso de un estado no esperado
        });
      };

    const [dungeonLevel, setDungeonLevel] = useState<number>(() => {
        const storedLevel = localStorage.getItem("dungeonLevel");
        return storedLevel ? parseInt(storedLevel, 10) : 1;
    });

    const [updateEnemy, setUpdateEnemy] = useState<boolean>(false)
    const { 
        // enemy, 
        isLoading,  handleNewEnemyClick } = useEnemyLoader(player.level, dungeonLevel, updateEnemy);
    const defaultQuests: QuestData = {
        questTree: {
            history: [],
            secondary: [],
            others: []
        }
    };
    const { handlePostCombatActs } = usePostCombatActions(setDungeonLevel, quests || 
        defaultQuests, playerActions, player
    );
   
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
      setIsMusicPlaying(!isMusicPlaying)
      setIsMusicPlaying(!isMusicPlaying)
      setAmbientMusic("battleSong")
      setMusicVolume(0.1)
    }, []);
    useEffect(() => {
        if (player.p_LeftHealth === 0) {
            handleMessage("¡Has sido derrotado!", "warning",true)
        }}, [player.p_LeftHealth]);
    useEffect(() => {
        setSummonPosition({
            x: playerPosition.x + 6,
            y: playerPosition.y + 4, 
        })
    }, [summon])

    useEffect(() => {
        if (logRef.current) {
          // Desplaza hacia abajo
          logRef.current.scrollTop = logRef.current.scrollHeight;
        }
      }, [actionMessages]); // Ejecuta cada vez que la lista de mensajes cambia
    

// ************************USEEFFECTS ******************************
// ************************COMBATE *************************
   
  const handleAction = (actionType: "attack" | "spell" | "move", additionalData?: any) => {

    handleCombatAction(actionType, {
      player,
      creature,
      spells,
      setActionMessages,
      playerPosition,
      enemyPosition,
      setPlayerPosition,
      setTurn,
      turn,
      selectedSpell,
      setSummon, switchTurn,
      handlePostCombatActs, fightType,
      handleMessage
    }, additionalData);
  };

    useEnemyTurn({
        // enemy
        creature,
        turn ,player,playerActions,setActionMessages,switchTurn,
        playerPosition,enemyPosition,setEnemyPosition,

    });

    useSummonTurn({
        creature,
        turn,
        player,
        setActionMessages,
        switchTurn,
        enemyPosition, 
        summonPosition,
        setSummonPosition,
        summon,
        setCreatureHealth,
    })

    const executeAttack = () => {
        if (turn !== "player") return;
        setSoundType("attack")
        handleAction("attack")
        setTimeout(() => {
            setSoundType("")
          }, 300);
    };
    
    const executeSpell = () => {
        if (turn !== "player" || !selectedSpell) return;  
        handleAction("spell")
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
    const manaPercentage = (player.p_LeftMana / player.p_MaxMana) * 100;
    const pocion = inventories[player.inventoryId].potions.find(p => p === "Poción de Curación Menor");
    
    if (isLoading) return <p>Cargando enemigo...</p>;
    // if (error)  return <p>Error: {error}</p>;
    return (
    <div className="fight-scene">
        <div className="turn-indicator">
        {turn === "player" ? <h2>Tu turno</h2> : <h2>Turno del enemigo</h2>}
        </div>
        <PlayerCharacter 
                player={player} 
                healthPercentage={healthPercentage} 
                xpPercentage={xpPercentage} 
                pet={player.selectedPet} 
                manaPercentage = {manaPercentage}
        />
        <div className="rpgui-container framed attacks ">
            {/* <div className="blackScreenAttacks "></div> */}
            <div className="attackAndPotions">
                <button className="rpgui-button newDesign espada" id="newDesign" onClick={executeAttack} disabled={!canAttack || creature.health === 0 || player.p_LeftHealth === 0 || turn === "enemy"}>
                    ⚔️
                </button>
                {pocion && (
                <button className="rpgui-button newDesign potionsButton" id="newDesign" onClick={() => handleHealing({        player,
                    inventories,
                    potions,
                    removeItem,
                    playerActions,
                    handleMessage,
                    })} disabled={creature.health === 0 || player.p_LeftHealth === 0}>
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
            <div className="rpgui-container rpgui-draggable">
                <div>
                <Dropdown
                    id="spell-dropdown"
                    options={player.spells || []}
                    value={selectedSpell}
                    onChange={(value) => setSelectedSpell(value)}
                    disabled={turn !== "player" || creature.health === 0}
                />
                </div>
                <button
                    onClick={executeSpell}
                    disabled={turn !== "player" || !selectedSpell || creature.health === 0}
                >
                    Lanzar hechizo
                </button>
            </div>
            {fightType === 'normal' || player.p_LeftHealth === 0 ?  
            <button onClick={() => handleMessage(
                "¡Has huido del combate!",
                "warning",
                true
                )} className="rpgui-button newDesign huir">
            😨 Huir</button> : <></>}        
        </div>   
        <div>
        {fightType=== 'dungeon'? <h1>Dungeon {dungeonLevel}</h1> : <></> }
            <ul className="action-log" ref={logRef}>
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
            creature= {creature}  
            setTurn = {setTurn}
            turn = {turn}
            playerPosition = {playerPosition}
            setPlayerPosition = {setPlayerPosition}
            enemyPosition = {enemyPosition}
            setEnemyPosition = {setEnemyPosition}
            SoundPlayer = {SoundPlayer}
            playerImg = {player.classImg}
            summon = {summon}
            setSummon = {setSummon}
            summonPosition =  {summonPosition}
            switchTurn = {switchTurn}
            // setSummonPosition = {setSummonPosition}
            />
            </div>
            <EndBattleActions
                creature = {creature}
                creatureHealth={creature.health}
                handleNewEnemyClick={handleNewEnemyClick}
                fightType={fightType}
                player={player}
                handleMessage={handleMessage}
                setTurn={setTurn}
                updateEnemy={updateEnemy}
                setUpdateEnemy={setUpdateEnemy}
                setPlayerPosition={setPlayerPosition}
                setEnemyPosition={setEnemyPosition}
            />
        </div>
        <EnemyChar creature={creature} />
            {soundType &&<SoundPlayer soundType={soundType} category="action" volume={0.2} />}
            {messageState.show && (
                <MessageBox
                    message={messageState.content}
                    type={messageState.type as 'error' | 'warning' | 'success'}
                    onClose={() => handleClose(messageState.redirectHome)}
                />
            )}
            <KeyboardController setBoardPosition={setBoardPosition} />
            
        </div>
    );
}