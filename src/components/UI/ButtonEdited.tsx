import React, { useState } from "react";
import SoundPlayer from "./soundPlayer/SoundPlayer"; // Asegúrate de importar el SoundPlayer

interface HoverSoundButtonProps {
  label: string;
  soundType: string;
  onClick?: () => void; // Define una función opcional
  onMouseEnter?: () => void; // Nueva prop
  onMouseLeave?: () => void; // Nueva prop
  width?: string; // Nueva prop para ajustar el ancho
  height?: string; // Nueva prop para ajustar la altura
}

const ButtonEdited: React.FC<HoverSoundButtonProps> = ({
  label,
  soundType,
  onClick,
  onMouseEnter,
  onMouseLeave,
  width = "", // Valor predeterminado para el ancho
  height = "", // Valor predeterminado para la altura
}) => {
  const [playSound, setPlaySound] = useState(false);

  const handleMouseEnter = () => {
    setPlaySound(true); // Activa el sonido
    if (onMouseEnter) onMouseEnter(); // Llama a la función onMouseEnter si existe
  };

  const handleMouseLeave = () => {
    setPlaySound(false); // Desactiva el sonido
    if (onMouseLeave) onMouseLeave(); // Llama a la función onMouseLeave si existe
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
        style={{ width, height }} // Aplica el ancho y la altura dinámicamente
        onMouseOver={handleMouseEnter}
        onMouseLeave={handleMouseLeave} // Maneja cuando el mouse se va
        onClick={handleClick} // Maneja el clic
      >
        {label}
      </button>
      {playSound && <SoundPlayer soundType={soundType} category="action" volume={0.05} />}
    </div>
  );
};

export default ButtonEdited;
