export interface Quest {
  name: string; // Nombre de la misión
  description: string; // Descripción de la misión
  counter: number; // Cantidad de objetivos necesarios para completarla (opcional)
  objective?: string; // Nombre del objetivo (enemigo u otro elemento, opcional)
  reward: number; // Recompensa al completar la misión
  type?: string; // Tipo de misión (por ejemplo, "kill", opcional)
  finished?: boolean; // Estado de finalización de la misión
  progress?: number; // Progreso actual de la misión (opcional)
  received?: boolean; // Si la recompensa fue recibida
}

export interface QuestTree {
  history: Quest[]; // Misiones de historia principal
  secondary: Quest[]; // Misiones secundarias
  others: Quest[]; // Otras misiones (opcional)
}

export interface QuestStore {
  questTree: QuestTree; // Árbol de misiones
  areQuestsLoaded: boolean; // Indicador de si las misiones fueron cargadas
  setQuestTree: (questTree: QuestTree) => void; // Reemplaza el QuestTree actual
  addQuest: (newQuest: Quest, category: keyof QuestTree) => void; // Agrega una nueva misión a la categoría correspondiente
  updateQuest: (
    questName: string,
    updates: Partial<Quest>,
    category: keyof QuestTree,
  ) => void; // Actualiza una misión existente en una categoría específica
}
