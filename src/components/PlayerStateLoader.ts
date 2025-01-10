import { useEffect } from 'react';
import { usePlayerStore } from '../stores/playerStore';

const PlayerStateLoader = () => {
  const { playerActions } = usePlayerStore();

  useEffect(() => {
    // Verifica si hay un 'playerState' en localStorage al cargar el componente
    const storedPlayerState = localStorage.getItem('playerState');

    if (storedPlayerState) {
      const parsedPlayerState = JSON.parse(storedPlayerState);
      playerActions.setPlayer(parsedPlayerState)
    }
  }, []);

  return null;
};

export default PlayerStateLoader;
