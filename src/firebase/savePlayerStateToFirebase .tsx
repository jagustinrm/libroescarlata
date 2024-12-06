import { database } from './firebaseConfig';
import { useEffect } from 'react';
import { ref, set, get } from 'firebase/database';
import usePlayerStore from '../stores/playerStore';
import { Player } from '../stores/types/player';

// Función para comparar propiedades específicas de dos objetos
const comparePlayerState = (player1: Player, player2:Player) => {
  // Compara solo las propiedades 'name' y 'level'

  return player1.name === player2.name &&
         player1.level === player2.level &&
         player1.playerExp === player2.playerExp 
};

// Función para guardar el estado en Firebase
const savePlayerStateToFirebase = async (playerId: string, player: Player) => {
  const playerRef = ref(database, `players/${playerId}`);
  
  // Verifica si los datos han cambiado antes de guardar
  const snapshot = await get(playerRef);
  const existingData = snapshot.val();
  
  // Compara solo 'name' y 'level'
  if (!comparePlayerState(existingData, player)) {
    // Solo guarda si ha habido cambios en esas propiedades
    await set(playerRef, player);
    console.log('Estado del jugador guardado en Firebase.');
  } else {
    console.log('No hubo cambios en name o level. No se guarda.');
  }
};

// Función para guardar el estado a intervalos de tiempo
const PlayerStateSaver = () => {
  const { player } = usePlayerStore(); 

  useEffect(() => {
    const playerId = player.name || 'guest-player'; // Usa un ID único del jugador o 'guest-player'
    
    // Configurar el intervalo de guardado (por ejemplo, cada 30 segundos)
    const intervalId = setInterval(() => {
      savePlayerStateToFirebase(playerId, player);
    }, 30000); // 30 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [player]);

  return null; // Este componente no necesita renderizar nada
};

export default PlayerStateSaver;
