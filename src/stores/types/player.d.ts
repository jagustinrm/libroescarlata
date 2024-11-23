// Interfaz para el estado del player
export interface Player {
    name: string;
  }
  
  // Interfaz para el store del player
  export interface PlayerStore {
    player: Player; // Estado del jugador
    setPlayerName: (name: string) => void; // Acción para actualizar el nombre
  }
  