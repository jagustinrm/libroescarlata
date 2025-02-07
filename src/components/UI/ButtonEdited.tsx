import React from 'react';
import { soundService } from '../../utils/soundService';

interface HoverSoundButtonProps {
  label: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  width?: string;
  height?: string;
  disabled?: boolean; // Ahora es un booleano
}

const ButtonEdited: React.FC<HoverSoundButtonProps> = ({
  label,
  onClick,
  onMouseEnter,
  onMouseLeave,
  width = '',
  disabled = false, // Valor predeterminado
}) => {
  const buttonSound = {
    name: 'buttonSound',
    source: '/music/click/buttonSound.wav',
    volume: 0.2,
    loop: false,
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      soundService.play(buttonSound);
      if (onMouseEnter) onMouseEnter();
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      if (onMouseLeave) onMouseLeave();
    }
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div className="button-edited-container rpgui-cursor-point">
      <div
        style={{
          width,
          filter: disabled ? 'grayscale(100%)' : 'none',
          pointerEvents: disabled ? 'none' : 'auto', // Evitar clics cuando está deshabilitado
          cursor: disabled ? 'not-allowed' : 'auto',
          display: disabled ? 'inline-block' : '',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`button-content ${disabled ? 'disabled' : ''}`} // Clase para personalización
      >
        <img
          className="common-button rpgui-cursor-point"
          src="/img/UI/button-common2.png"
          alt=""
        />
        <p>{label}</p>
      </div>
    </div>
  );
};

export default ButtonEdited;
