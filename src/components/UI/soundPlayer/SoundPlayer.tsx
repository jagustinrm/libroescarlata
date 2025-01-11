import React, { useEffect, useRef } from 'react';
import { useSoundStore } from '../../../stores/soundsStore'; // Estado global para manejar el sonido

export interface SoundPlayerProps {
  soundType?: string;
  volume?: number;
  soundUrl?: string;
}

const SoundPlayer: React.FC<SoundPlayerProps> = ({
  soundType,
  volume = 0.7,
  soundUrl, 
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { stopCurrentSong } = useSoundStore();

  useEffect(() => {
    const playSound = async () => {
      if (audioRef.current) {
        const soundFile = getSoundFile();
        console.log('Reproduciendo:', soundFile);
        audioRef.current.src = soundFile;

        // Asegurarse de que el archivo esté cargado antes de intentar reproducirlo
        audioRef.current.oncanplaythrough = async () => {
          try {
            if (audioRef.current) {
              audioRef.current.volume = volume;
              await audioRef.current.play();
            }
          } catch (error) {
            console.error('Error al intentar reproducir el sonido:', error);
          }
        };

        // Si ya está listo para reproducir, intenta hacerlo
        if (audioRef.current.readyState >= 3) {
          audioRef.current.volume = volume;
          await audioRef.current.play();
        }
      }
    };

    playSound();
  }, [soundType, stopCurrentSong]);

  const getSoundFile = (): string => {
    // Si `url` está definida, tiene prioridad sobre `soundType`
    if (soundUrl) {
      return soundUrl;
    }

    switch (soundType) {
      case 'attack':
        return '/music/sword-sound.mp3';
      case 'charStep':
        return '/music/grass_step.mp3';
      case 'medievalAmbient':
        return '/music/ambient/introAmbientMusic.mp3';
      case 'buttonSound':
        return '/music/buttonSound.mp3';
      case 'battleSong':
        return '/music/ambient/fighting-tribal-song.mp3';
      case 'fireBall':
        return '/music/attacks/fireBall.wav';
      default:
        return '/path/to/default-sound.mp3';
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
