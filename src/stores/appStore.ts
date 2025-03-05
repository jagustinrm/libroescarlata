import { create } from 'zustand';
import { FloatingMessageProps } from './types/others';
interface HoverInfo {
  description: string;
  bodyPart: string;
  armorValue?: number;
  damage?: number;
  damageMax?: number;
  levelRequirement?: number;
  x: number;
  y: number;
}
// Define la interfaz para los estados y funciones
interface AppState {
  isMusicPlaying: boolean;
  ambientMusic: string;
  musicVolume: number;
  actionMessages: string[];
  floatingMessage: FloatingMessageProps | null;
  soundUrl: string | null;
  areItemsLoaded: boolean;

  message: {
    showMessage: boolean;
    content: string;
    type: string;
  };
  hoverInfo: HoverInfo | null;

  fightType: string;
  setFightType: (fType: string) => void;
  toggleMusic: () => void;
  setAmbientMusic: (music: string) => void;
  setMusicVolume: (volume: number) => void;
  setActionMessages: (update: (prevMessages: string[]) => string[]) => void;
  setFloatingMessage: (message: FloatingMessageProps | null) => void;
  setSoundUrl: (sound: string | null) => void;
  setAreItemsLoaded: (areLoaded: boolean) => void;
  setMessage: (messageContent: string, messageType: string) => void;
  clearMessage: () => void;
  setHoverInfo: (info: HoverInfo | null) => void;
}

// Crea el store con tipos
const useAppStore = create<AppState>((set) => ({
  // Estados globales
  isMusicPlaying: false,
  ambientMusic: '',
  musicVolume: 0.2,
  floatingMessage: null,
  actionMessages: [],
  soundUrl: null,
  areItemsLoaded: false,
  message: {
    showMessage: false,
    content: '',
    type: '',
  },
  hoverInfo: null,
  fightType: '', 
  // Funciones para actualizar estados
  setHoverInfo: (info) => set({ hoverInfo: info }),
  toggleMusic: () =>
    set((state) => {
      return {
        isMusicPlaying: !state.isMusicPlaying,
      };
    }),
  setFightType: (fType) => set({ fightType: fType }),
  setSoundUrl: (sound) => set({ soundUrl: sound }),
  setAreItemsLoaded: (areLoaded) => set({ areItemsLoaded: areLoaded }),
  setAmbientMusic: (music) => set({ ambientMusic: music }),
  setActionMessages: (update) => 
  set((state) => ({ actionMessages: update(state.actionMessages) })),
  setMusicVolume: (volume) => set({ musicVolume: volume }),
  setFloatingMessage: (message) => set({ floatingMessage: message }),
  setMessage: (messageContent, messageType) =>
    set({
      message: {
        showMessage: true,
        content: messageContent,
        type: messageType,
      },
    }),
  clearMessage: () =>
    set({
      message: { showMessage: false, content: '', type: '' },
    }),
}));

export default useAppStore;
