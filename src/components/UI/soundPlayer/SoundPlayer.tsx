import React, { useEffect, useRef } from 'react';

interface SoundPlayerProps {
  soundType: string;
  volume?: number; // Añadimos una propiedad opcional para el volumen
}

const SoundPlayer: React.FC<SoundPlayerProps> = ({ soundType, volume =1 }) => {
  // Usamos un useRef para evitar crear un nuevo audio cada vez que cambia el sonido
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause(); // Pausa el audio antes de cambiar el archivo
      audioRef.current.currentTime = 0; // Reinicia el tiempo del audio
      audioRef.current.volume = volume; // Ajusta el volumen
      audioRef.current.play(); // Reproduce el nuevo audio
    }
  }, [soundType, volume]); // Reproduce el sonido y ajusta el volumen cuando cambia el tipo de sonido o el volumen

  const getSoundFile = () => {
    switch (soundType) {
      case 'attack':
        return '/music/sword-sound.mp3';
      case 'button2':
        return '/path/to/sound2.mp3';
      case 'button3':
        return '/path/to/sound3.mp3';
      default:
        return '/path/to/default-sound.mp3';
    }
  };

  return (
    <audio ref={audioRef} >
      <source src={getSoundFile()} type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default SoundPlayer;
