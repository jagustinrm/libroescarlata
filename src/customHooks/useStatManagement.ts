import { useCallback } from 'react';
import usePlayerStore from '../stores/playerStore';
import { Stats } from '../stores/types/stats';
const useStatManagement = () => {
  const { player, playerActions } = usePlayerStore();

  const handleIncreaseStat = useCallback(
    (key: keyof Stats, pointsToAdd: number) => {
      if (player.leftPoints > 0) {
        // Incrementa puntos en la estadística
        const updatedStats = {
          ...player.stats,
          [key]: player.stats[key] + pointsToAdd,
        };
        playerActions.addStatsPoints(pointsToAdd, key);

        // Reduce el número de puntos disponibles
        playerActions.addStatsLeftPoints(-1);

        // Calcula el nuevo incremento en statsIncrease
        const prevPoints = player.statsIncrease[key];
        const additionalIncrease = Math.floor(updatedStats[key] / 5); // Usa updatedStats
        const updatedStatsIncrease = {
          ...player.statsIncrease,
          [key]: additionalIncrease,
        };
        // Actualiza el incremento si cambió
        playerActions.setStatsIncrease(updatedStatsIncrease);

        if (additionalIncrease > prevPoints) {
          switch (key) {
            case 'con':
              {
                const additionalHealth = player.level;
                playerActions.setP_MaxHealth(
                  player.p_MaxHealth + additionalHealth,
                );
              }
              break;
            case 'str':
              {
                const additionalBaseAttack = 1;
                playerActions.setBaseAttackBonus(
                  player.baseAttackBonus + additionalBaseAttack,
                );
              }
              break;
            case 'dex':
              {
                const addionalArmor = 1;
                playerActions.setArmorClass(player.armorClass + addionalArmor);
              }
              break;
            case 'int':
              {
                const additionalMana = player.level;
                playerActions.setP_MaxMana(player.p_MaxMana + additionalMana);
              }
              break;
            default:
              break;
          }
        }
      }
    },
    [player, playerActions],
  );

  return { handleIncreaseStat };
};

export default useStatManagement;
