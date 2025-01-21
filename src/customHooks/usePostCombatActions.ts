
import checkQuests from '../utils/checkQuests.ts';
// @ts-expect-error Para que funcione
import gainExp from '../utils/gainExp.js';
import { Player, PlayerActions } from '../stores/types/player.js';
import { Creature } from '../stores/types/creatures.js';
import { QuestTree } from '../stores/types/quests.js';

const usePostCombatActions = (
  setDungeonLevel: React.Dispatch<React.SetStateAction<number>>,
  // creature: CreatureInterface | null,
  // creature: Creature | null,
  quests: QuestTree,
  playerActions: PlayerActions,
  player: Player,
) => {
  const handlePostCombatActs = (fightType: string, creature: Creature) => {
    // Si el enemigo es derrotado
    if (creature) {
      //***** */ Incrementar el nivel de mazmorra si es un jefe*******
      if (fightType === 'dungeon' && creature.role === 'boss') {
        setDungeonLevel((prevLevel) => {
          const newLevel = prevLevel + 1;
          localStorage.setItem('dungeonLevel', newLevel.toString());
          return newLevel;
        });
      }
      gainExp(creature.level, playerActions.setPlayerExp, player.playerExp);

      playerActions.setPlayerMaterial(
        player.playerMaterial + creature.level * 100,
      );

      //****** */ Actualizar lista de enemigos derrotados ********

      const existingEnemyIndex = player.enemiesDeleted.findIndex(
        (e) => e.name === creature.name,
      );

      if (existingEnemyIndex !== -1) {
        const updatedEnemies = [...player.enemiesDeleted];
        updatedEnemies[existingEnemyIndex].count += 1;
        playerActions.setEnemiesDeleted(updatedEnemies);
        checkQuests(updatedEnemies);
        // *******Corroborar si terminó la misión****
      } else {
        // Si el enemigo no existe, agregarlo a la lista
        const updatedEnemies = [
          ...player.enemiesDeleted,
          { name: creature.name, count: 1 },
        ];
        playerActions.setEnemiesDeleted(updatedEnemies);
        checkQuests(updatedEnemies);
      }
    }
  };
  return { handlePostCombatActs };
};

export default usePostCombatActions;
