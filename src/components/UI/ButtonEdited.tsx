import React, {useState} from "react";
import SoundPlayer from "./soundPlayer/SoundPlayer"; // Asegúrate de importar el SoundPlayer

interface HoverSoundButtonProps {
  label: string;
  soundType: string; 
}

const ButtonEdited: React.FC<HoverSoundButtonProps> = ({ label, soundType }) => {
  const [playSound, setPlaySound] = useState(false);

  const handleMouseEnter = () => {
    setPlaySound(true); // Activa el sonido
  };


  return (
    <div>
      <button className="rpgui-button"
        onMouseOver={handleMouseEnter}
      >
        {label}
      </button>
      {playSound && <SoundPlayer soundType={soundType} volume={1} />}
    </div>
  );
};

export default ButtonEdited;
