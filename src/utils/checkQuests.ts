import { QuestTree, Quest } from "../stores/types/quests";
import useQuestStore from "../stores/questStore";

export default function checkQuests(updatedEnemies: { count: number; name: string }[]) {
  // Obtener el árbol de quests desde el estado global
  const { questTree, updateQuest } = useQuestStore.getState();

  const checkAndUpdateQuest = (quest: Quest, category: keyof QuestTree) => {
    // Si la quest ya está terminada, no hacemos nada
    if (quest.finished) return;

    // Encontrar el enemigo relacionado con el objetivo de la quest
    const matchingEnemy = updatedEnemies.find((enemy) => enemy.name === quest.objective);

    if (matchingEnemy) {
      // Actualizar el progreso de la quest
      const newProgress = (quest.progress || 0) + matchingEnemy.count;

      // Si el progreso alcanza o supera el contador necesario, marcar como terminada
      const isFinished = newProgress >= quest.counter;

      updateQuest(
        quest.name,
        {
          progress: Math.min(newProgress, quest.counter), // Progreso máximo es el contador necesario
          finished: isFinished,
        },
        category
      );
    }
  };

  // Iterar sobre cada categoría de quests y verificar cada quest
  Object.keys(questTree).forEach((category) => {
    const questCategory = category as keyof QuestTree; // Asegurar el tipo
    questTree[questCategory].forEach((quest) => checkAndUpdateQuest(quest, questCategory));
  });
}
