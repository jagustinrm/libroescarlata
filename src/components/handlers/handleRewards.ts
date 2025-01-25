import usePlayerStore from '../../stores/playerStore';
import useQuestStore from '../../stores/questStore';
import { Quest, QuestTree } from '../../stores/types/quests';

export const handleQuestReward = (quest: Quest, category: keyof QuestTree) => {
  const { player, playerActions } = usePlayerStore.getState();
  const { updateQuest } = useQuestStore.getState();

  if (!quest.finished) {
    console.warn(`La misión no está terminada.`);
    return;
  }

  if (quest.received) {
    console.warn(`La recompensa ya fue recibida.`);
    return;
  }

  // Actualizar los materiales del jugador
  const newMaterial = player.playerMaterial + quest.reward;
  playerActions.setPlayerMaterial(newMaterial);

  // Marcar la quest como "received: true"
  updateQuest(quest.name, { received: true }, category); // Cambia "history" por la categoría correspondiente

  console.log(
    `Recompensa obtenida: ${quest.reward} materiales. Nuevos materiales: ${newMaterial}`,
  );
};
