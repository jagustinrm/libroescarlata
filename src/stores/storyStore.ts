import { create } from "zustand";
import { Story, StoryStore } from "./types/story";

// Definir el tipo de estado antes de crear el store
const useStoryStore = create<StoryStore>((set, get) => ({
  stories: [],
  userProgress: {},

  // Cargar una historia
  loadStory: (story: Story) => set((state) => ({
    stories: [...state.stories, story],
  })),

  // Cargar varias historias
  loadStories: (stories: Story[]) => set((state) => {
    console.log(stories)
    return {
        stories: [...state.stories, ...stories],
    }
  }),

  // Obtener el progreso de un usuario en una historia
  getUserProgress: (userId: string, storyId: string) => {
    const progress = get().userProgress[userId];
    return progress?.find((p) => p.storyId === storyId);
  },

  // Obtener una historia por su ID
  getStoryById: (storyId: string) => {
    return get().stories.find((story) => story.id === storyId);
  },

  // Completar un capítulo
  completeChapter: (userId: string, storyId: string, chapterId: number) => {
    set((state) => {
      const newProgress = { ...state.userProgress }; // Copiar el estado
      if (!newProgress[userId]) {
        newProgress[userId] = []; // Si no hay progreso para el usuario, inicializarlo
      }

      const storyProgress = newProgress[userId].find((p) => p.storyId === storyId);
      if (storyProgress) {
        if (!storyProgress.completedChapters.includes(chapterId)) {
          storyProgress.completedChapters = [...storyProgress.completedChapters, chapterId]; // Añadir capítulo de forma inmutable
        }
      } else {
        newProgress[userId].push({
          storyId,
          completedChapters: [chapterId],
          completedEvents: [],
          selectedChoices: {},
          worldState: {}, // Estado global del mundo al completar un capítulo
        });
      }

      return { userProgress: newProgress };
    });
  },

  // Completar un evento
  completeEvent: (userId: string, storyId: string, eventId: string) => {
    set((state) => {
      const newProgress = { ...state.userProgress };
      const storyProgress = newProgress[userId]?.find((p) => p.storyId === storyId);

      if (storyProgress && !storyProgress.completedEvents.includes(eventId)) {
        storyProgress.completedEvents = [...storyProgress.completedEvents, eventId]; // Añadir evento de forma inmutable
        // Actualizar el estado del mundo si hay cambios en el evento
        const event = get().stories.flatMap(story => story.events).find(e => e.id === eventId);
        if (event && event.worldState) {
          storyProgress.worldState = { ...storyProgress.worldState, ...event.worldState };
        }
      }

      return { userProgress: newProgress };
    });
  },

  // Seleccionar una opción en un evento
  selectChoice: (userId: string, storyId: string, eventId: string, choice: string) => {
    set((state) => {
      const newProgress = { ...state.userProgress };
      const storyProgress = newProgress[userId]?.find((p) => p.storyId === storyId);

      if (storyProgress) {
        storyProgress.selectedChoices = { ...storyProgress.selectedChoices, [eventId]: choice }; // Actualizar la elección de forma inmutable
      } else {
        newProgress[userId] = [{
          storyId,
          completedChapters: [],
          completedEvents: [],
          selectedChoices: { [eventId]: choice },
          worldState: {}, // Estado global del mundo al seleccionar una opción
        }];
      }

      return { userProgress: newProgress };
    });
  },

  // Actualizar el estado del mundo en el progreso del usuario
  updateWorldState: (userId: string, storyId: string, worldState: { [key: string]: string }) => {
    set((state) => {
      const newProgress = { ...state.userProgress };
      const storyProgress = newProgress[userId]?.find((p) => p.storyId === storyId);

      if (storyProgress) {
        storyProgress.worldState = { ...storyProgress.worldState, ...worldState }; // Actualizar el estado global del mundo
      } else {
        newProgress[userId] = [{
          storyId,
          completedChapters: [],
          completedEvents: [],
          selectedChoices: {},
          worldState, // Estado global del mundo al actualizar
        }];
      }

      return { userProgress: newProgress };
    });
  },
}));

export default useStoryStore;
