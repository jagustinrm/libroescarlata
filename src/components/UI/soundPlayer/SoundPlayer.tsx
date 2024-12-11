import React, { useEffect, useRef } from "react";
import { useSoundStore } from "../../../stores/soundsStore"; // Estado global para manejar el sonido
// import { SongDetails } from "../../../stores/types/sounds";

export interface SoundPlayerProps {
  soundType: string;
  // category: keyof SongDetails; // Especificar la categoría (ambiente, acción, etc.)
  volume?: number;
}

const SoundPlayer: React.FC<SoundPlayerProps> = ({ soundType, volume = 0.7 }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { stopCurrentSong } = useSoundStore();

  useEffect(() => {
    const playSound = async () => {
      if (audioRef.current) {
        const soundFile = getSoundFile();
        console.log("Reproduciendo:", soundFile);
        audioRef.current.src = soundFile;
    
        // Asegurarse de que el archivo esté cargado antes de intentar reproducirlo
        audioRef.current.oncanplaythrough = async () => {
          try {
            // Establece el volumen antes de reproducir
            if (audioRef.current) {
              audioRef.current.volume = volume;
              await audioRef.current.play();
              console.log("Reproducción iniciada con volumen:", volume);
            }
          } catch (error) {
            console.error("Error al intentar reproducir el sonido:", error);
          }
        };
    
        // Si ya está listo para reproducir, intenta hacerlo
        if (audioRef.current.readyState >= 3) {
          audioRef.current.volume = volume; // Asegurarse de establecer el volumen
          await audioRef.current.play();
        }
      }
    };
    

    playSound();
  }, [soundType, stopCurrentSong]);

  const getSoundFile = () => {
    switch (soundType) {
      case "attack":
        return "/music/sword-sound.mp3";
      case "charStep":
        return "/music/grass_step.mp3";
      case "medievalAmbient":
        return "/music/ambient/introAmbientMusic.mp3";
      case "buttonSound":
        return "/music/buttonSound.mp3";
      case "battleSong":
        return "/music/ambient/fighting-tribal-song.mp3";
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