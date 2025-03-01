import './FightScene.css';
import '../UI/designRpg.css';
import { useLocation } from 'react-router-dom';
import usePostCombatActions from '../../customHooks/usePostCombatActions.ts';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnemyLoader } from '../../customHooks/useEnemyLoader.ts';
import { checkLevelUp } from '../../utils/checkLevelUp.ts';
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
import useAppStore from '../../stores/appStore.ts';
import useGlobalState from '../../customHooks/useGlobalState.ts';
import CombatUI from '../battlefield/combatMenu/CombatUI.tsx';
import { Weapon } from '../../stores/types/weapons.ts';
import { Spell } from '../../stores/types/spells';
import { usePetTurn } from '../../customHooks/usePetTurn.ts';
import { initializeEffects } from './initializeEffects.ts';
import { handleClose } from './handleClose.ts';

export default function FightScene() {
  const {soundUrl, fightType, setMessage, message, clearMessage, actionMessages, setActionMessages  } =
  useAppStore();
  const [redirectHome, setRedirectHome] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { enemy} = location.state || {};
  const logRef = useRef<HTMLUListElement>(null); // REFERENCIA DEL LOG PARA BAJAR CON SCROLL
  const {
    player,
    playerActions,
    creature,
   currentCharacter, 
    summon, setSummon,
    creatureLoaded
  } = useGlobalState();
  const [activateImage, setActivateImage] = useState<boolean>(false);
  const { expTable } = useExpTable();
  const { handleNewEnemyClick } = useEnemyLoader(enemy);
  const { handlePostCombatActs } = usePostCombatActions();
  const handleCheckLevelUp = () => {
    checkLevelUp({
      player,
      setActionMessages,
      playerActions,
      expTable,
    });
  };

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
    setOpcionesArmas,
    setOpcionesSpells,
    handleCheckLevelUp,
    handleMessage,
    logRef,
    handlePostCombatActs,
    enemy
  });
  // ************************USEEFFECTS ******************************
    // ************************TURNOS *************************
  useEnemyTurn();
  useSummonTurn();
  usePetTurn();
  // ************************TURNOS *************************

  console.log(player)
  const xpPercentage =
    player.p_ExpToNextLevel - player.p_ExpPrevLevel !== 0
      ? ((player.playerExp - player.p_ExpPrevLevel) /
          (player.p_ExpToNextLevel - player.p_ExpPrevLevel)) *
        100
      : 0;
  const healthPercentage =
    (player.c_LeftHealth / player.totalMaxHealth()) * 100;
  const manaPercentage = (player.c_LeftMana / player.totalMaxMana()) * 100;

  if (!creatureLoaded) return <p>Cargando enemigo...</p>;
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
        setActivateImage= {setActivateImage}
        handleMessage={handleMessage}
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
          handleNewEnemyClick={handleNewEnemyClick}
          handleMessage={handleMessage}
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
          onClose={() => handleClose(redirectHome, clearMessage, navigate)}
        />
      )}
      <KeyboardController />
    </div>
  );
}
