import { useEffect, useState } from 'react';
import './HeaderMenu.css';
import useAppStore from '../../../stores/appStore';
import SoundPlayer from '../soundPlayer/SoundPlayer';

const HeaderMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    isMusicPlaying,
    ambientMusic,
    musicVolume,
    toggleMusic,
    setAmbientMusic,
    setMusicVolume,
  } = useAppStore();

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
            <a href="#">Ingresar</a>
          </li>
          <li>
            {' '}
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
          {/* <li><a href="#inicio">Inicio</a></li>
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
          <li><a href="#contacto">Contacto</a></li> */}
        </ul>
      </nav>
      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? 'Cerrar' : 'Menú'}
      </button>
    </header>
  );
};

export default HeaderMenu;
