import React, { useEffect, useRef, useState } from "react";

export interface SoundPlayerProps {
  soundType: string;
  volume?: number; 
}

const SoundPlayer: React.FC<SoundPlayerProps> = ({ soundType, volume = 1 }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [canPlayAudio, setCanPlayAudio] = useState(false); // Estado para habilitar la reproducción

  // Este useEffect es para habilitar la reproducción de audio con clic
  useEffect(() => {
    const enableAudio = () => {
      setCanPlayAudio(true);
      document.removeEventListener("click", enableAudio); // Remover evento de clic después de la primera interacción
    };
    document.addEventListener("click", enableAudio);
    return () => document.removeEventListener("click", enableAudio);
  }, []);

  // Este useEffect se encarga de activar el audio al hacer hover en los botones con la clase 'rpgui-button'
  useEffect(() => {
    const handleHover = () => {
      setCanPlayAudio(true);
    };

    const buttons = document.querySelectorAll(".rpgui-button");
    buttons.forEach(button => {
      button.addEventListener("mouseover", handleHover);
      
    });

    // Limpiar los event listeners cuando el componente se desmonte
    return () => {
      buttons.forEach(button => {
        button.removeEventListener("mouseleave", handleHover);
      });
    };
  }, []); // Este efecto solo se ejecuta una vez cuando el componente se monta
  
  useEffect(() => {
    if (canPlayAudio && audioRef.current) {
      audioRef.current.pause(); // Pausa cualquier audio previamente en reproducción
      audioRef.current.currentTime = 0; // Reinicia el tiempo
      audioRef.current.volume = volume; // Ajusta el volumen
      audioRef.current.play().catch((err) => {
        console.error("Error al reproducir el audio:", err);
      });
    }
  }, [soundType, volume, canPlayAudio]);

  // Función para determinar qué archivo de sonido usar según el `soundType`
  const getSoundFile = () => {
    switch (soundType) {
      case "attack":
        return "/music/sword-sound.mp3";
      case "charStep":
        return "/music/grass_step.mp3";
      case "button3":
        return "/path/to/sound3.mp3";
      default:
        return "/path/to/default-sound.mp3";
    }
  };

  return (
    <audio ref={audioRef}>
      <source src={getSoundFile()} type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default SoundPlayer;
