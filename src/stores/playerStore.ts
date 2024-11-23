import { create } from 'zustand';
import { PlayerStore } from './types/player';

// Crear el store de Zustand
const usePlayerStore = create<PlayerStore>((set) => ({
  player: { name: 'Initial Player' }, // Estado inicial del player

  // Acción para actualizar el nombre del jugador
  setPlayerName: (name: string) => set(() => ({ player: { name } })),
}));

export default usePlayerStore;
