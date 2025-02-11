import './FightScene.css';
import '../UI/designRpg.css';
import { useLocation } from 'react-router-dom';
import usePostCombatActions from '../../customHooks/usePostCombatActions.ts';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnemyLoader } from '../../customHooks/useEnemyLoader.ts';
import { checkLevelUp } from '../../utils/checkLevelUp.ts';
import { handleCombatAction } from '../../utils/combatHandlers.ts';
import useExpTable from '../../customHooks/useExpTable.ts';
import MessageBox from '../UI/MessageBox.tsx';
import { useEnemyTurn } from '../../customHooks/useEnemyTurn.ts';
import { useSummonTurn } from '../../customHooks/useSummonTurn.ts';
import SoundPlayer from '../UI/soundPlayer/SoundPlayer.tsx';
import GameBoard from '../battlefield/GameBoard .tsx';
import KeyboardController from '../../utils/KeyboardController.ts';
import PlayerCharacter from '../battlefield/PlayerCharacter.tsx';
import EndBattleActions from '../battlefield/EndBattleActions.tsx';
import EnemyChar from '../battlefield/EnemyChar.tsx';
import { Creature } from '../../stores/types/creatures.ts';
import useAppStore from '../../stores/appStore.ts';
import useGlobalState from '../../customHooks/useGlobalState.ts';
import CombatUI from '../battlefield/combatMenu/CombatUI.tsx';
import { Weapon } from '../../stores/types/weapons.ts';
import { Spell } from '../../stores/types/spells';
import { usePetTurn } from '../../customHooks/usePetTurn.ts';
import { Scroll } from '../../stores/types/scrolls.ts';
import { initializeEffects } from './initializeEffects.ts';

export default function FightScene() {
  const [redirectHome, setRedirectHome] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { enemy, fightType, event } = location.state;
  const logRef = useRef<HTMLUListElement>(null); // REFERENCIA DEL LOG PARA BAJAR CON SCROLL
  const {
    spells,
    weapons,
    player,
    playerActions,
    creature,
   currentCharacter, 
    setCreatureHealth,
  } = useGlobalState();
  const [summon, setSummon] = useState<Creature | null>(null);
  const [activateImage, setActivateImage] = useState<boolean>(false);
  const { expTable } = useExpTable();
  const [actionMessages, setActionMessages] = useState<string[]>([]); // Estado para el mensaje de acción
  const [updateEnemy, setUpdateEnemy] = useState<boolean>(false);
  const { isLoading, handleNewEnemyClick } = useEnemyLoader(
    player.level,
    player.dungeonLevel,
    updateEnemy,
    enemy,
    fightType,
  );
  const { handlePostCombatActs } = usePostCombatActions();
  const handleCheckLevelUp = () => {
    checkLevelUp({
      player,
      setActionMessages,
      playerActions,
      expTable,
    });
  };
  const { soundUrl, setSoundUrl, setMessage, message, clearMessage  } =
    useAppStore();
  const [pocion, setpocion] = useState<string>();
  const [opcionesArmas, setOpcionesArmas] = useState<Weapon[]>();
  const [opcionesSpells, setOpcionesSpells] = useState<Spell[]>();
  // ************************USEEFFECTS ******************************

  const handleMessage = (
    message: string,
    type: string,
    shouldClose: boolean,
  ) => {
    setRedirectHome(shouldClose);
    setMessage(message,type)
  };

  initializeEffects({
    setpocion,
    setOpcionesArmas,
    setOpcionesSpells,
    handleCheckLevelUp,
    handleMessage,
    logRef,
    actionMessages
  });
  // ************************USEEFFECTS ******************************
    // ************************COMBATE *************************
  const handleAction = (
    actionType: 'attack' | 'spell' | 'move' | 'scroll',
    additionalData?: any,
  ) => {
    const res = handleCombatAction(
      actionType,
      {
        setActionMessages,
        setActivateImage,
        setSummon,
        handlePostCombatActs,
        fightType,
        handleMessage,
      },
      additionalData,
    );
    return res;
  };

  useEnemyTurn({
    setActionMessages,
  });

  useSummonTurn({
    setActionMessages,
    summon,
    setCreatureHealth,
  });

  usePetTurn({
    setActionMessages,
    fightType,
    handleMessage,
    handlePostCombatActs,
  });
  const executeAttack = () => {
    if (currentCharacter && currentCharacter.id !== 'player') return;
    const weapon = weapons.find(
      (s) => player.bodyParts.manoDerecha?.name === s.name,
    );
    const url = weapon?.soundEffect || null;
    setSoundUrl(url);
    handleAction('attack');
    setTimeout(() => {
      setSoundUrl(null);
    }, 300);
  };
  const executeSpell = () => {
    if (
      (currentCharacter && currentCharacter.id !== 'player') ||
      !player.selectedSpell
    )
      return;
    const spell = spells.find((s) => player.selectedSpell?.name === s.name);
    const url = spell?.soundEffect || null;
    setSoundUrl(url);
    handleAction('spell');
    setTimeout(() => {
      setSoundUrl(null);
    }, 1000);
  };

  const executeScroll = (scroll: Scroll): boolean => {
    const selectedAttack = scroll;
    const url = selectedAttack?.soundEffect || null;
    setSoundUrl(url);
    const res = handleAction('scroll', selectedAttack);
    console.log(res);
    setTimeout(() => {
      setSoundUrl(null);
    }, 1000);
    return res;
  };
  
  // ************************COMBATE *************************

  const handleClose = (shouldClose: boolean) => {
    clearMessage()
    if (shouldClose) {
      if (event) {
        const key = fightType === 'travel' ? 'updateTravel' : 'updatedEvent';
        const data =
          fightType === 'travel' ? event : { ...event, status: 'completed' };

        localStorage.setItem(key, JSON.stringify(data));
      }
      playerActions.resetBuffs();
      navigate(-1);
    }
  };

  const xpPercentage =
    player.p_ExpToNextLevel - player.p_ExpPrevLevel !== 0
      ? ((player.playerExp - player.p_ExpPrevLevel) /
          (player.p_ExpToNextLevel - player.p_ExpPrevLevel)) *
        100
      : 0;
  const healthPercentage =
    (player.p_LeftHealth / player.totalMaxHealth()) * 100;
  const manaPercentage = (player.p_LeftMana / player.totalMaxMana()) * 100;

  if (isLoading) return <p>Cargando enemigo...</p>;
  // if (error)  return <p>Error: {error}</p>;
  return (
    <div className="fight-scene">
      {fightType === 'dungeon' ? (
        <h1 className="dungeonLevel">Dungeon {player.dungeonLevel}</h1>
      ) : (
        <></>
      )}
      <div className="turn-indicator fixedUI ">
        {currentCharacter && currentCharacter.id === 'player' ? (
          <h2>Tu turno</h2>
        ) : (
          <h2>Turno del enemigo</h2>
        )}
      </div>
      <CombatUI
        opcionesArmas={opcionesArmas ?? []}
        opcionesSpells={opcionesSpells ?? []}
        executeAttack={executeAttack}
        handleMessage={handleMessage}
        pocion={pocion}
        executeSpell={executeSpell}
        executeScroll={executeScroll}
        fightType={fightType}
      />
      <div>
        <ul className="action-log fixedUI " ref={logRef}>
          {actionMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <GameBoard
          activateImage={activateImage}
          SoundPlayer={SoundPlayer}
          summon={summon}
          setSummon={setSummon}
          setActivateImage={setActivateImage}
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
      {soundUrl && <SoundPlayer volume={0.3} soundUrl={soundUrl} />}
      {message.showMessage && (
        <MessageBox
          message={message.content}
          type={message.type as 'error' | 'warning' | 'success'}
          onClose={() => handleClose(redirectHome)}
        />
      )}
      <KeyboardController />
    </div>
  );
}
