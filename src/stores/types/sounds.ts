export interface SongDetails {
  ambient?: string;
  action?: string;
  [key: string]: string | undefined; // Propiedades dinámicas
}

export interface SoundStore {
  currentSong: SongDetails | null;
  audioElement: HTMLAudioElement | null; // Almacena la referencia del elemento audio
  setCurrentSong: (song: SongDetails) => void;
  setAudioElement: (element: HTMLAudioElement) => void;
  stopCurrentSong: () => void;
}