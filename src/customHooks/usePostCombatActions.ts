import checkQuests from '../utils/checkQuests.ts';
// @ts-expect-error Para que funcione
import gainExp from '../utils/gainExp.js';
import { Creature } from '../stores/types/creatures.js';
import usePlayerStore from '../stores/playerStore.ts';

const usePostCombatActions = () => {
  const {player,playerActions} = usePlayerStore.getState();
  const handlePostCombatActs = (fightType: string, creature: Creature) => {
    // Si el enemigo es derrotado
    if (creature) {
      //***** */ Incrementar el nivel de mazmorra si es un jefe*******
      if (fightType === 'dungeon' && creature.role === 'boss') {
        const newLevel = player.dungeonLevel + 1;
        playerActions.setDungeonLevel(newLevel);
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
