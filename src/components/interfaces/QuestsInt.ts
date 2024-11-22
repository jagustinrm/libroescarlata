// Interfaz para una misión individual
interface Quest {
    name: string; // Nombre de la misión
    description: string; // Descripción de la misión
    counter: number; // Cantidad de objetivos necesarios para completarla
    objective: string; // Nombre del objetivo (enemigo u otro elemento)
    reward: number; // Recompensa al completar la misión
    type: string; // Tipo de misión (por ejemplo, "kill")
    finished: boolean; // Estado de finalización de la misión
    progress: number;
}

// Interfaz para las categorías de misiones
interface QuestTree {
    history: Quest[]; // Misiones de historia principal
    secondary: Quest[]; // Misiones secundarias
    others: Quest[]; // Otras misiones (opcional)
}

// Interfaz para el objeto completo de misiones
export interface QuestData {
    questTree: QuestTree; // Árbol de misiones
}
