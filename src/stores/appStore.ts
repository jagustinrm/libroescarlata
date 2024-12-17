import { create } from 'zustand';

// Define la interfaz para los estados y funciones
interface AppState {
  isMusicPlaying: boolean;
  ambientMusic: string;
  musicVolume: number;

  // Funciones para actualizar estados
  toggleMusic: () => void;
  setAmbientMusic: (music: string) => void;
  setMusicVolume: (volume: number) => void;
}

// Crea el store con tipos
const useAppStore = create<AppState>((set) => ({
  // Estados globales
  isMusicPlaying: false,
  ambientMusic: '',
  musicVolume: 0.2,

  // Funciones para actualizar estados
  toggleMusic: () =>
    set((state) => {
      return {
        isMusicPlaying: !state.isMusicPlaying,
      };
    }),
  setAmbientMusic: (music) => set({ ambientMusic: music }),
  setMusicVolume: (volume) => set({ musicVolume: volume }),
}));

export default useAppStore;
