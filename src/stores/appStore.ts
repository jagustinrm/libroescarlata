import { create } from 'zustand';
import { FloatingMessageProps } from './types/others';

// Define la interfaz para los estados y funciones
interface AppState {
  isMusicPlaying: boolean;
  ambientMusic: string;
  musicVolume: number;
  floatingMessage: FloatingMessageProps | null
  soundUrl: string | null;
  areItemsLoaded: boolean;

  message: {
    showMessage: boolean;
    content: string;
    type: string;
  };

  toggleMusic: () => void;
  setAmbientMusic: (music: string) => void;
  setMusicVolume: (volume: number) => void;
  setFloatingMessage:(message: FloatingMessageProps | null) => void;
  setSoundUrl: (sound: string | null) => void;
  setAreItemsLoaded: (areLoaded: boolean) => void

  setMessage: (messageContent: string, messageType: string) => void;
  clearMessage: () => void;
}

// Crea el store con tipos
const useAppStore = create<AppState>((set) => ({
  // Estados globales
  isMusicPlaying: false,
  ambientMusic: '',
  musicVolume: 0.2,
  floatingMessage: null,
  soundUrl: null,
  areItemsLoaded: false,
  message: {
    showMessage: false,
    content: "",
    type: "",
  },

  // Funciones para actualizar estados

  toggleMusic: () =>
    set((state) => {
      return {
        isMusicPlaying: !state.isMusicPlaying,
      };
    }),
  setSoundUrl:(sound) => set({ soundUrl: sound }),
  setAreItemsLoaded:(areLoaded) => set({ areItemsLoaded: areLoaded }),
  setAmbientMusic: (music) => set({ ambientMusic: music }),
  setMusicVolume: (volume) => set({ musicVolume: volume }),
  setFloatingMessage:  (message) => set({ floatingMessage: message }),
  setMessage: (messageContent, messageType) =>
    set({
      message: { showMessage: true, content: messageContent, type: messageType },
    }),
  clearMessage: () =>
    set({
      message: { showMessage: false, content: "", type: "" },
    }),
}));

export default useAppStore;
