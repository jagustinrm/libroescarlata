import './Home.css';
import './UI/details/Arrow.css';
import './UI/designRpg.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import openMissions from '../utils/openMissionsWindow.ts';
import MessageBox from './UI/MessageBox.tsx';
import Quests from './quests/Quests.tsx';
import ButtonEdited from './UI/ButtonEdited.tsx';
import PrincipalSign from './UI/PrincipalSign.tsx';
import useGlobalState from '../customHooks/useGlobalState.ts';
import useAppStore from '../stores/appStore.ts';
// import HomeOptionsSign from './UI/HomeOptionsSign.tsx';

export default function Home() {
  const [showMessage, setShowMessage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { player, playerActions } = useGlobalState();
  const { setAmbientMusic, setMusicVolume } = useAppStore();
  const navigate = useNavigate();
  const [showMissions, setShowMissions] = useState(false);
  useEffect(() => {
    setAmbientMusic('medievalAmbient');
    setMusicVolume(0.1);
  }, []);
  const handleAction = (action: string) => {
    switch (action) {
      case 'fight-normal':
        navigate('/fightScene', {
          state: {
            fightType: 'normal',
          },
        });
        break;
      case 'fight-dungeon':
        navigate('/fightScene', {
          state: {
            fightType: 'dungeon',
          },
        });
        break;
      case 'townMap':
        navigate('/townMap');
        break;
      case 'itemShop':
        navigate('/itemShop');
        break;
      case 'armory':
        navigate('/armory');
        break;
      case 'petStore':
        navigate('/petStore');
        break;
      case 'bestiary':
        navigate('/bestiary');
        break;
      case 'inventory':
        navigate('/inventory');
        break;
      case 'recoverHealth':
        playerActions.setP_LeftHealth(player.totalMaxHealth());
        playerActions.setP_LeftMana(player.totalMaxMana());
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
    <div>
      {showMissions && <Quests onClose={() => setShowMissions(false)} />}
      <PrincipalSign />
      {/* <HomeOptionsSign/> */}
      <div className={`home-container rpgui-container framed-golden-2`}>
        <div
          className={`sidebar ${isSidebarOpen ? 'open' : 'closed'} rpgui-container framed-golden-2`}
        >
          <button
            className="toggle-sidebar"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '◀️' : '📜'}
          </button>
          {isSidebarOpen && (
            <div className="player">
              <div className="stats">
                <img
                  onClick={handleStats}
                  className="playerAvatar rpgui-cursor-point"
                  src={player.avatarImg}
                  alt="avatar img"
                />
                <div className="centerStats">
                  <p>👤 {player.name}</p>
                  <p>🛡️ {player.classes}</p>
                  <p>⭐ Nivel: {player.level}</p>
                  <div className="p_leaftHealth">
                    <div className="heart">❤️</div>
                    <p>
                      {' '}
                      Vida: {player.p_LeftHealth} / {player.totalMaxHealth()}
                    </p>
                  </div>
                  <p>
                    🌀 Espíritu: {player.p_LeftMana} / {player.totalMaxMana()}
                  </p>
                  <p>
                    ✨ Exp: {player.playerExp} / {player.p_ExpToNextLevel}
                  </p>
                  <p>🛠️ Materiales: {player.playerMaterial}</p>

                  {player.selectedPet && (
                    <p>🐶 Mascota: {player.selectedPet.name}</p>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '5px' }}>
                <ButtonEdited
                  label="Inventario"
                  width="130px"
                  height="33px"
                  onClick={() => handleAction('inventory')}
                />
              </div>
            </div>
          )}
        </div>

        <div className="buttonsHome ">
          {/* 
                <button onClick={() => handleAction('townMap')} className="rpgui-button">🏠 Hogar</button>
              */}

          {player.p_LeftHealth > 0 && (
            <img
              onClick={() => handleAction('fight-normal')}
              className="buttonPrueba"
              src="/img/UI/training.png"
              alt=""
            />
          )}
          {player.p_LeftHealth > 0 && (
            <img
              onClick={() => handleAction('fight-dungeon')}
              className="buttonPrueba"
              src="/img/UI/dungeonButton.png"
              alt=""
            />
          )}
          <div className="hospitalRecover">
            <img
              onClick={() => handleAction('recoverHealth')}
              className="buttonPrueba"
              src="/img/UI/innButton.png"
              alt=""
            />
            {player.p_LeftHealth === 0 && <div className="arrows"></div>}
          </div>
          <img
            onClick={() => handleAction('petStore')}
            className="buttonPrueba"
            src="/img/UI/petsButton.png"
            alt=""
          />
          <img
            onClick={() => setShowMissions(true)}
            className="buttonPrueba"
            src="/img/UI/questsButton.png"
            alt=""
          />
          <img
            onClick={() => handleAction('itemShop')}
            className="buttonPrueba"
            src="/img/UI/shopButton.png"
            alt=""
          />
          <img
            onClick={() => handleAction('bestiary')}
            className="buttonPrueba"
            src="/img/UI/bestiary.png"
            alt=""
          />
        </div>
      </div>
      {showMessage && (
        <MessageBox
          message="¡Te curaste toda la vida!"
          type="success"
          onClose={handleClose}
        />
      )}
    </div>
  );
}
