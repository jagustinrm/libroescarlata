import React, { useState } from "react";
import SoundPlayer from "./soundPlayer/SoundPlayer"; // Asegúrate de importar el SoundPlayer

interface HoverSoundButtonProps {
  label: string;
  soundType: string;
  onClick?: () => void; // Define una función opcional
}

const ButtonEdited: React.FC<HoverSoundButtonProps> = ({ label, soundType, onClick }) => {
  const [playSound, setPlaySound] = useState(false);

  const handleMouseEnter = () => {
    setPlaySound(true); // Activa el sonido
  };

  const handleMouseLeave = () => {
    setPlaySound(false); // Desactiva el sonido
  };

  const handleClick = () => {
    if (onClick) {
      onClick(); // Ejecuta la función pasada como prop
    }
  };

  return (
    <div>
      <button
        className="rpgui-button"
        onMouseOver={handleMouseEnter}
        onMouseLeave={handleMouseLeave} // Maneja cuando el mouse se va
        onClick={handleClick} // Maneja el clic
      >
        {label}
      </button>
      {playSound && <SoundPlayer soundType={soundType} volume={1} />}
    </div>
  );
};

export default ButtonEdited;
