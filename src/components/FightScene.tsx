import './FightScene.css';
import './UI/designRpg.css';
import { useLocation } from 'react-router-dom';
import usePostCombatActions from '../customHooks/usePostCombatActions';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnemyLoader } from '../customHooks/useEnemyLoader.ts';
import { checkLevelUp } from '../utils/checkLevelUp.ts';
// import { calculateInitialHealth } from '../utils/calculateInitialHealth.ts';
import { handleCombatAction } from '../utils/combatHandlers';
import useExpTable from '../customHooks/useExpTable.ts';
import MessageBox from './UI/MessageBox.tsx';
import { useEnemyTurn } from '../customHooks/useEnemyTurn.ts';
import { useSummonTurn } from '../customHooks/useSummonTurn.ts';
import SoundPlayer from './UI/soundPlayer/SoundPlayer.tsx';
import GameBoard from './battlefield/GameBoard .tsx';
import KeyboardController from '../utils/KeyboardController.ts';
import PlayerCharacter from './battlefield/PlayerCharacter.tsx';
import EndBattleActions from './battlefield/EndBattleActions.tsx';
import EnemyChar from './battlefield/EnemyChar.tsx';
import { Creature } from '../stores/types/creatures.ts';
import useAppStore from '../stores/appStore.ts';
import useGlobalState from '../customHooks/useGlobalState.ts';
import CombatUI from './battlefield/combatMenu/CombatUI.tsx';
import { FloatingMessageProps } from '../stores/types/others';
import { Weapon } from '../stores/types/weapons.ts';
import { Spell } from '../stores/types/spells';
// import { createTurnHandler } from './battlefield/TurnSystem.ts';
import useTurnStore from '../stores/turnStore.ts';
import useQuestStore from '../stores/questStore.ts';
import { QuestTree } from '../stores/types/quests.ts';

export default function FightScene() {
  const [messageState, setMessageState] = useState({
    show: false,
    content: '',
    type: '',
    redirectHome: false,
  });
  const navigate = useNavigate();
  const location = useLocation()
  const {enemy, fightType, event} = location.state
  const [floatingMessage, setFloatingMessage] = useState<FloatingMessageProps | null>(null);
  const logRef = useRef<HTMLUListElement>(null); // REFERENCIA DEL LOG PARA BAJAR CON SCROLL
  const {spells, weapons, player, playerActions, creature, setCreatureHealth, inventories,
    playerPosition, setPlayerPosition, setEnemyPosition, setSummonPosition, setPetPosition
   } = useGlobalState();
   const {addCharacter, currentCharacter, characters} = useTurnStore();
  const [summon, setSummon] = useState<Creature | null>(null);
  const [soundType] = useState<string>('');
  const [activateImage, setActivateImage] = useState<boolean>(false)
  const [soundUrl, setSoundUrl] = useState<string | undefined>('');
  const { expTable} = useExpTable();
  const [actionMessages, setActionMessages] = useState<string[]>([]); // Estado para el mensaje de acción
  const { questTree } = useQuestStore();

   console.log(characters)
  const [dungeonLevel, setDungeonLevel] = useState<number>(() => {
    const storedLevel = localStorage.getItem('dungeonLevel');
    return storedLevel ? parseInt(storedLevel, 10) : 1;
  });
  const [updateEnemy, setUpdateEnemy] = useState<boolean>(false);
  const {
    // cargar enemy
    isLoading,
    handleNewEnemyClick,
  } = useEnemyLoader(player.level, dungeonLevel, updateEnemy, enemy, fightType);
  const defaultQuests: QuestTree = {
      history: [],
      secondary: [],
      others: [],
  };
  const { handlePostCombatActs } = usePostCombatActions(
    setDungeonLevel,
    defaultQuests,
    playerActions,
    player,
  );
  const handleCheckLevelUp = () => {
    checkLevelUp({
      player,
      setActionMessages,
      // calculateInitialHealth,
      playerActions,
      expTable,
      // setExpTable,
    });
  };
  const { setAmbientMusic, setMusicVolume } = useAppStore();
  const [pocion, setpocion] = useState<string>();
  const [opcionesArmas, setOpcionesArmas] = useState<(Weapon)[]>();
  const [opcionesSpells, setOpcionesSpells] = useState<Spell[]>(); 
  // ************************USEEFFECTS ******************************
  useEffect(() => {
    const pot = inventories[player.inventoryId].potions.find(
      (p) => p === 'Poción de Curación Menor'
    );
    setpocion(pot);
  
    const opctArm = inventories[player.inventoryId].weapons
      .map((w) => weapons.find((ws) => ws.id === w))
      .filter((w): w is Weapon => w !== undefined);
    setOpcionesArmas(opctArm);
  
    const opctSpells = player.spells
      .map((s) => spells.find((sp) => sp.id === s))
      .filter((s): s is Spell => s !== undefined);
    setOpcionesSpells(opctSpells);
  }, [inventories]);
  

  useEffect(() => {
    handleCheckLevelUp(); // Verificar subida de nivel
  }, [player.playerExp]);
  useEffect(() => {
    setPlayerPosition({ x: 0 - 10 / 1.2, y: 45 - 20 / 1.5 });
    setEnemyPosition({ x: 45 - 10 / 1.2, y: 0 - 20 / 1.5 });
    player.selectedPet && setPetPosition({x: playerPosition.x + 8, y: playerPosition.y + 12})
    addCharacter({id: "player", name: player.name})
    addCharacter({id: "enemy", name: creature.name})
    setAmbientMusic('battleSong');
    setMusicVolume(0.1);
  }, []);
  useEffect(() => {
    if (player.p_LeftHealth === 0) {
      handleMessage('¡Has sido derrotado!', 'warning', true);
    }
  }, [player.p_LeftHealth]);
  useEffect(() => {
    setSummonPosition({
      x: playerPosition.x + 6,
      y: playerPosition.y + 4,
    });
  }, [summon]);

  useEffect(() => {
    if (logRef.current) {    // Desplaza hacia abajo
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [actionMessages]); // Ejecuta cada vez que la lista de mensajes cambia


  // ************************USEEFFECTS ******************************
  // ************************COMBATE *************************

  const handleAction = (
    actionType: 'attack' | 'spell' | 'move',
    additionalData?: any,
  ) => {
    handleCombatAction(
      actionType,
      {
        setActionMessages,
        setActivateImage,
        // turn,
        setSummon,
        // switchTurn,
        handlePostCombatActs,
        fightType,
        handleMessage,
        setFloatingMessage,
      },
      additionalData,
    );
  };

  useEnemyTurn({
    // turn,
    setActionMessages,
    // switchTurn,
    setFloatingMessage,
    setSoundUrl,
  });

  useSummonTurn({
    // turn,
    setActionMessages,
    // switchTurn,
    summon,
    setCreatureHealth,
  });
  const executeAttack = () => {
    if (currentCharacter && currentCharacter.id  !== 'player') return;
    const weapon = weapons.find((s) => player.bodyParts.manoDerecha?.name === s.name);
    const url = weapon?.soundEffect;
    
    setSoundUrl(url);
    handleAction('attack');
    setTimeout(() => {
      setSoundUrl('');
    }, 300);
  };
  const executeSpell = () => {
    if (currentCharacter && currentCharacter.id  !== 'player' || !player.selectedSpell) return;
    const spell = spells.find((s) => player.selectedSpell?.name === s.name);
    const url = spell?.soundEffect; // ESTO PERMITE UTILIZAR LA URL DEL SONIDO DEL FUEGO
    setSoundUrl(url);
    handleAction('spell');
    setTimeout(() => {
      setSoundUrl('');
    }, 1000);
  };
  // ************************COMBATE *************************

  const handleMessage = (
    message: string,
    type: string,
    shouldClose: boolean,
  ) => {
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
    if (shouldClose && event) {
      if (fightType === "travel") {
        
        localStorage.setItem("updateTravel", JSON.stringify(event))
        navigate(-1);
      } else {
        const updatedEvent = { ...event, status: "completed" };
        localStorage.setItem("updatedEvent", JSON.stringify(updatedEvent));
        navigate(-1);
      }

    } else if (shouldClose) {
      navigate(-1);
    }
  };

  const xpPercentage =
    player.p_ExpToNextLevel - player.p_ExpPrevLevel !== 0
    ? ((player.playerExp - player.p_ExpPrevLevel) /
          (player.p_ExpToNextLevel - player.p_ExpPrevLevel)) * 100
    : 0;
  const healthPercentage = (player.p_LeftHealth / player.totalMaxHealth()) * 100;
  const manaPercentage = (player.p_LeftMana / player.totalMaxMana()) * 100;

  if (isLoading) return <p>Cargando enemigo...</p>;
  // if (error)  return <p>Error: {error}</p>;
  return (
    <div className="fight-scene">

      <div className="turn-indicator fixedUI ">
        {fightType === 'dungeon' ? <h1>Dungeon {dungeonLevel}</h1> : <></>}
        {currentCharacter && currentCharacter.id  === 'player' ? <h2>Tu turno</h2> : <h2>Turno del enemigo</h2>}
      </div>
      <CombatUI
        opcionesArmas={opcionesArmas ?? []} 
        opcionesSpells = {opcionesSpells ?? []}
        // turn={turn}
        executeAttack={executeAttack}
        handleMessage={handleMessage}
        pocion={pocion}
        executeSpell={executeSpell}
        fightType={fightType}
      
      />
      <div>
        <ul className="action-log fixedUI " ref={logRef}>
          {actionMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <GameBoard
          activateImage = {activateImage}
          // turn={turn}
          SoundPlayer={SoundPlayer}
          summon={summon}
          setSummon={setSummon}
          // switchTurn={switchTurn}
          setActivateImage = {setActivateImage}
          setFloatingMessage={setFloatingMessage}
          floatingMessage = {floatingMessage}
        />
        <EndBattleActions
          creature={creature}
          creatureHealth={creature.health}
          handleNewEnemyClick={handleNewEnemyClick}
          fightType={fightType}
          player={player}
          handleMessage={handleMessage}
          // setTurn={setTurn}
          updateEnemy={updateEnemy}
          setUpdateEnemy={setUpdateEnemy}
        />
      </div>
      <PlayerCharacter
        player={player}
        healthPercentage={healthPercentage}
        xpPercentage={xpPercentage}
        pet={player.selectedPet}
        manaPercentage={manaPercentage}
      />
      <EnemyChar creature={creature} />
      {soundType || soundUrl && <SoundPlayer soundType={soundType} volume={0.3} soundUrl={soundUrl} />}
      {messageState.show && (
        <MessageBox
          message={messageState.content}
          type={messageState.type as 'error' | 'warning' | 'success'}
          onClose={() => handleClose(messageState.redirectHome)}
        />
      )}

      <KeyboardController />
    </div>
  );
}
