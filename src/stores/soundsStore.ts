// import { create } from 'zustand';

// // Definición de los tipos de datos para las propiedades del sonido
// // export type SoundType = 'ambiente' | 'combate' | 'acciones' | 'botones';

// type Spatialization = {
//   position: { x: number; y: number; z: number };
//   radius: number;
// };

// type Sound = {
//   id: string; // Identificador único del sonido (basado en el nombre)
//   name: string; // Nombre del sonido
//   type: string;
//   volume: number; // Rango: 0 a 1
//   loop: boolean;
//   maxDuration?: number; // En segundos, opcional
//   priority?: number; // Mayor prioridad, mayor importancia
//   fadeIn?: number; // Milisegundos
//   fadeOut?: number; // Milisegundos
//   startTime?: number; // Segundo inicial
//   pitch?: number; // 1 por defecto
//   channel?: string; // Canal o grupo al que pertenece el sonido
//   spatialization?: Spatialization; // Información de posición espacial
//   playbackRate?: number; // Velocidad de reproducción
//   isMuted: boolean; // Silencio
//   tag?: string; // Etiqueta identificadora
//   crossfadeWith?: string; // ID del sonido para crossfade
//   source: string; // Ruta o URL del archivo
//   url?: string; // URL opcional para cargar el sonido
//   lang?: string; // Idioma asociado
//   isPlaying?: boolean; // Propiedad que indica si el sonido está reproduciéndose
// };

// type SoundStore = {
//   sounds: Sound[];
//   currentSound: Sound[]; // Lista con un único sonido actualmente en reproducción
//   playSound: (soundData: { name: string; type: string; volume: number; loop: boolean; source: string }) => void;
//   stopSound: (id: string) => void;
//   muteSound: () => void;
//   crossfade: (fromId: string, toId: string, duration: number) => void;
// };

// // Implementación del store con Zustand
// export const useSoundStore = create<SoundStore>((set, get) => ({
//   sounds: [],
//   currentSound: [],

//   playSound: ({ name, type, volume, loop, source }) => {
//     const id = name; // El id es el nombre del sonido
//     const soundToPlay = get().sounds.find((sound) => sound.id === id);

//     if (soundToPlay) {
//       // Detener otros sonidos del mismo tipo que estén reproduciéndose
//       set((state) => ({
//         sounds: state.sounds.map((sound) =>
//           sound.type === type && sound.id !== id
//             ? { ...sound, isPlaying: false }
//             : sound
//         ),
//         currentSound: [soundToPlay], // Reemplazar `currentSound` con el nuevo sonido
//       }));

//       // Activar el nuevo sonido
//       set((state) => ({
//         sounds: state.sounds.map((sound) =>
//           sound.id === soundToPlay.id
//             ? { ...sound, isPlaying: true }
//             : sound
//         ),
//       }));
//     } else {
//       // Si el sonido no existe, crearlo
//       const newSound: Sound = {
//         id,
//         name,
//         type,
//         volume,
//         loop,
//         source,
//         isMuted: false,
//         isPlaying: true,
//       };

//       set((state) => ({
//         sounds: [...state.sounds, newSound],
//         currentSound: [newSound], // Reemplazar `currentSound` con el nuevo sonido
//       }));
//     }
//   },

//   stopSound: (id) => {
//     set((state) => ({
//       sounds: state.sounds.map((sound) =>
//         sound.id === id ? { ...sound, isPlaying: false } : sound
//       ),
//       currentSound: state.currentSound.filter((sound) => sound.id !== id), // Remover si coincide
//     }));
//   },

//   muteSound: () => {
//     set((state) => ({
//       sounds: state.sounds.map((sound) => ({ ...sound, isMuted: true })),
//     }));
//   },

//   crossfade: (fromId, toId, duration) => {
//     const fromSound = get().sounds.find((s) => s.id === fromId);
//     const toSound = get().sounds.find((s) => s.id === toId);

//     if (fromSound && toSound) {
//       console.log(
//         `Crossfading from ${fromSound.source} to ${toSound.source} over ${duration}ms`
//       );
//       // Implementar lógica real de crossfade aquí
//     }
//   },
// }));

import { create } from 'zustand';
import { SoundStore } from './types/sounds';

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
