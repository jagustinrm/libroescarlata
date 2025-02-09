export interface CEvent {
  id: string;
  description?: string;
  status: string;
  selectedChoice?: string; // Elección tomada
  options?: [
    {
      id: string;
      text: string;
      outcome: string;
      days?: number;
      enemies?: string[];
      requiresItem?: { name: string; cant: number; id: string }[];
    },
  ];
  // choices?: { [key: string]: string };
  conditions?: { requiresItem: number; requiresLevel: string }; // Requisito para desbloquear
  reward?: {
    items: { name: string; type: string; cant: number }[];
    materials: number;
  }; // Recompensas del evento
  worldState?: { [key: string]: string }; // Estado del mundo que cambia según el evento
}

export interface Chapter {
  id: string; // Identificador único del capítulo
  title: string; // Título del capítulo
  events: CEvent[]; // Lista de eventos asociados
  completed: boolean; // Indica si el capítulo fue completado
  dialogSequence: string;
}

export interface Story {
  id: string; // Identificador único del "Story" o historia principal
  title?: string; // Título del Story (ej. "Historia Principal", "Misiones Secundarias", etc.)
  chapters?: Chapter[]; // Lista de capítulos de la misión
  completed?: boolean; // Indica si toda la historia fue completada
}

export interface StoryProgress {
  storyId: string; // Referencia al ID de la historia
  completedChapters: number[]; // IDs de capítulos completados por el usuario
  completedEvents: string[]; // IDs de eventos completados por el usuario
  selectedChoices: { [eventId: string]: string }; // Elecciones tomadas en los eventos
  worldState: { [key: string]: string }; // Estado global del mundo en el progreso del usuario
}

export interface currentChapter {
  storyId: string;
  chapterId: string;
  currentDialogLine: number;
}

export interface StoryStore {
  stories: Story[]; // Lista de historias disponibles
  userProgress: { [userId: string]: StoryProgress[] }; // Progreso de las historias para cada usuario
  currentChapter: currentChapter;
  // Funciones para manejar el progreso
  setCurrentChapter: (currentChapter: currentChapter) => void;
  completeChapter: (userId: string, storyId: string, chapterId: number) => void;
  completeEvent: (userId: string, storyId: string, eventId: string) => void;
  selectChoice: (
    userId: string,
    storyId: string,
    eventId: string,
    choice: string,
  ) => void;

  // Funciones adicionales para cargar historias
  loadStory: (story: Story) => void;
  loadStories: (stories: Story[]) => void;
  getUserProgress: (
    userId: string,
    storyId: string,
  ) => StoryProgress | undefined;
  getStoryById: (storyId: string) => Story | undefined;
  updateWorldState: (
    userId: string,
    storyId: string,
    worldState: { [key: string]: string },
  ) => void; // Para actualizar el estado del mundo en el progreso
}
