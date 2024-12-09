import React, { useEffect, useRef, useState } from "react";

export interface SoundPlayerProps {
  soundType: string;
  volume?: number; 
}

const SoundPlayer: React.FC<SoundPlayerProps> = ({ soundType, volume = 1 }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // const [canPlayAudio, setCanPlayAudio] = useState(false);

  // console.log("Estado inicial canPlayAudio:", canPlayAudio);

  // // Habilitar la reproducción de audio con clic inicial
  // useEffect(() => {
  //   const enableAudio = () => {

  //     setCanPlayAudio(true);
  //     document.removeEventListener("click", enableAudio);
  //   };
    
  //   // Habilita audio al hacer clic en cualquier parte del documento
  //   document.addEventListener("click", enableAudio);
  
  //   return () => document.removeEventListener("click", enableAudio);
  // }, []);

  // // Manejar hover en los botones
  // useEffect(() => {
  //   const handleHover = () => {
  //     console.log("Entré al handleHover, habilitando reproducción");
  //     setCanPlayAudio(true);
  //   };

  //   const buttons = document.querySelectorAll(".rpgui-button");
  //   buttons.forEach((button) => button.addEventListener("mouseover", handleHover));

  //   // Cleanup: Remover listeners correctamente
  //   return () => {
  //     buttons.forEach((button) => button.removeEventListener("mouseover", handleHover));
  //   };
  // }, []); // Ejecutar solo una vez al montar

  // Reproducir sonido cuando cambie `canPlayAudio`
  useEffect(() => {
   
    console.log("Referencia audioRef:", audioRef.current);
    if (
      // canPlayAudio &&
        audioRef.current) {
      try {
        // audioRef.current.pause();-
        audioRef.current.currentTime = 0;
        audioRef.current.volume = volume;
        audioRef.current.play();
      } catch (err) {
        console.error("Error al reproducir el audio:", err);
      }
    }
  }, [
    // canPlayAudio, 
    soundType, volume]);

  // Obtener archivo de sonido
  const getSoundFile = () => {

    switch (soundType) {
      case "attack":
        return "/music/sword-sound.mp3";
      case "charStep":
        return "/music/grass_step.mp3";
      case "medievalAmbient":
        return "/music/medieval-ambient.mp3";
      case "buttonSound":
        return "/music/buttonSound.mp3"
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
