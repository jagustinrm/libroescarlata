import { Quest, QuestStore } from '../stores/types/quests';

export default function checkQuestsFinished(quests: QuestStore) {
  // Obtener las misiones completadas desde el localStorage
  const completedQuests = JSON.parse(
    localStorage.getItem('completedQuests') || '[]',
  );

  // Función para actualizar el progreso y estado de finalización de las misiones
  const updateQuests = (questCategory: Quest[]) => {
    return questCategory.map((quest) => {
      const completedQuest = completedQuests.find(
        (completed: Quest) => completed.name === quest.name,
      );

      if (completedQuest) {
        const progress = Math.min(completedQuest.progress || 0, quest.counter); // Asegura que el progreso no exceda el máximo
        const finished = completedQuest.completed || progress >= quest.counter; // Misión completada si cumple el objetivo

        return { ...quest, progress, finished };
      }

      // Si no hay progreso registrado, dejar los valores por defecto
      return { ...quest, progress: 0, finished: false };
    });
  };

  // Actualizar todas las ramas de misiones
  const updatedQuestTree = {
    history: updateQuests(quests.questTree.history),
    secondary: updateQuests(quests.questTree.secondary),
    others: updateQuests(quests.questTree.others),
  };

  // Devolver las misiones actualizadas con el progreso y el estado 'finished'
  return { ...quests, questTree: updatedQuestTree };
}
