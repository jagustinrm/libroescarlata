import './FightScene.css';
import './UI/designRpg.css';
import { useLocation } from 'react-router-dom';
import usePostCombatActions from '../customHooks/usePostCombatActions';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnemyLoader } from '../customHooks/useEnemyLoader.ts';
import { checkLevelUp } from '../utils/checkLevelUp.ts';
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
import { Weapon } from '../stores/types/weapons.ts';
import { Spell } from '../stores/types/spells';
import useTurnStore from '../stores/turnStore.ts';

import { usePetTurn } from '../customHooks/usePetTurn.ts';
import { Scroll } from '../stores/types/scrolls.ts';

export default function FightScene() {
  const [messageState, setMessageState] = useState({
    show: false,
    content: '',
    type: '',
    redirectHome: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { enemy, fightType, event } = location.state;
  // const [floatingMessage, setFloatingMessage] =
  //   useState<FloatingMessageProps | null>(null);

  const logRef = useRef<HTMLUListElement>(null); // REFERENCIA DEL LOG PARA BAJAR CON SCROLL
  const {
    spells,
    weapons,
    player,
    playerActions,
    creature,
    setCreatureHealth,
    inventories,
    playerPosition,
    setSummonPosition,
    resetPositions,
  } = useGlobalState();
  const { addCharacter, currentCharacter } = useTurnStore();
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
      // calculateInitialHealth,
      playerActions,
      expTable,
      // setExpTable,
    });
  };
  const { setAmbientMusic, setMusicVolume, soundUrl, setSoundUrl } =
    useAppStore();
  const [pocion, setpocion] = useState<string>();
  const [opcionesArmas, setOpcionesArmas] = useState<Weapon[]>();
  const [opcionesSpells, setOpcionesSpells] = useState<Spell[]>();
  // ************************USEEFFECTS ******************************
  useEffect(() => {
    const pot = inventories[player.inventoryId].potions.find(
      (p) => p === 'Poción de Curación Menor',
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
    resetPositions();
    addCharacter({ id: 'player', name: player.name });
    addCharacter({ id: 'enemy', name: creature.name });
    player.selectedPet &&
      addCharacter({ id: 'pet', name: player.selectedPet.name });
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
    if (logRef.current) {
      // Desplaza hacia abajo
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [actionMessages]); // Ejecuta cada vez que la lista de mensajes cambia

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
    setMessageState((prevState) => ({
      ...prevState,
      show: false,
    }));
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
