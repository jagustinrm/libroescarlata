import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Importa useLocation
import './HeaderMenu.css';
import useAppStore from '../../../stores/appStore';
import SoundPlayer from '../soundPlayer/SoundPlayer';
import Quests from '../../quests/Quests';

const HeaderMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const {
    isMusicPlaying,
    ambientMusic,
    musicVolume,
    toggleMusic,
    setAmbientMusic,
    setMusicVolume,
  } = useAppStore();

  // Obtener la ubicación actual
  const location = useLocation();

  useEffect(() => {
    setAmbientMusic('medievalAmbient');
    setMusicVolume(0.2);
  }, [setAmbientMusic, setMusicVolume]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">El Libro Escarlata</div>
      <nav className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          {isMusicPlaying && (
            <SoundPlayer soundType={ambientMusic} volume={musicVolume} />
          )}

          <li>
            <a href="/">Desconectar</a>
          </li>
          {/* Mostrar "Misiones" solo si no estamos en la URL "/" */}
          {location.pathname !== '/' &&
            location.pathname !== '/characterSelector' && (
              <li onClick={() => setShowMissions(true)} className='rpgui-cursor-point'>
                Misiones
              </li>
            )}
          <li>
            <div className="music-controls">
              <button className="buttonSoundToggle" onClick={toggleMusic}>
                {isMusicPlaying ? (
                  <img
                    className="soundPlayerSimbol"
                    src="/img/UI/musicOnSimbol.png"
                    alt=""
                  />
                ) : (
                  <img
                    className="soundPlayerSimbol"
                    src="/img/UI/musicOffSimbol.png"
                    alt=""
                  />
                )}
              </button>
            </div>
          </li>
        </ul>
      </nav>
      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? 'Cerrar' : 'Menú'}
      </button>
      {showMissions && <Quests onClose={() => setShowMissions(false)} />}
    </header>
  );
};

export default HeaderMenu;
