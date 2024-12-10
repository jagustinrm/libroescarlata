import { create } from "zustand";
import { SoundStore} from "./types/sounds";

export const useSoundStore = create<SoundStore>((set) => ({
    currentSong: null,
    audioElement: null,
    setCurrentSong: (song) => set({ currentSong: song }),
    setAudioElement: (element) => set({ audioElement: element }),
    stopCurrentSong: () =>
      set((state) => {
        if (state.audioElement) {
          state.audioElement.pause();
          state.audioElement.currentTime = 0; // Reinicia el audio
        }
        return { currentSong: null, audioElement: null };
      }),
  }));