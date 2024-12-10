import React, { useEffect, useRef } from "react";
import { useSoundStore } from "../../../stores/soundsStore"; // Estado global para manejar el sonido
import { SongDetails } from "../../../stores/types/sounds";

export interface SoundPlayerProps {
  soundType: string;
  category: keyof SongDetails; // Especificar la categoría (ambiente, acción, etc.)
  volume?: number;
}

const SoundPlayer: React.FC<SoundPlayerProps> = ({ soundType, category, volume = 0.7 }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { audioElement, currentSong, setCurrentSong, stopCurrentSong, setAudioElement } = useSoundStore();

  useEffect(() => {
    const playSound = async () => {
      if (audioRef.current) {
        try {
          // Si hay un sonido activo en la misma categoría, lo detenemos antes
          if (audioElement && currentSong && currentSong[category] && currentSong[category] !== soundType) {
            // stopCurrentSong();
            audioElement.src = ""
          }

          // Actualizar solo la categoría específica
          setCurrentSong({ ...currentSong, [category]: soundType });

          // Guardar la referencia del audio en el estado global
          setAudioElement(audioRef.current);

          // Configurar y reproducir el nuevo sonido
          audioRef.current.currentTime = 0;
          audioRef.current.volume = volume;

          await audioRef.current.play();
        } catch (error) {
          console.error("Error al reproducir el audio:", error);
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
