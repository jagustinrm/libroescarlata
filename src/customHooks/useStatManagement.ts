import { useCallback } from 'react';
import usePlayerStore from '../stores/playerStore';
import { Stats } from '../stores/types/stats';


const useStatManagement = () => {
  const { player, playerActions } = usePlayerStore();

  const handleIncreaseStat = useCallback((key: keyof Stats, pointsToAdd: number) => {
    if (player.leftPoints > 0) {
      playerActions.addStatsPoints(pointsToAdd, key);
      playerActions.addStatsLeftPoints(-1);
    }
    
    const prevPoints = player.statsIncrease[key]
    const additionalPlus = [...player.statsIncrease, Math.floor((player.stats[key] / 5))] // Si aumenta en 1 cuando llega  5 puntos
    playerActions.setStats(additionalPlus) // acá tengo que modificar con setStats
    
    if (player.statsIncrease[key] > prevPoints ) {
      const increasePoints = () => {
        const additionalHealth = player.level
        playerActions.setP_MaxHealth(player.p_MaxHealth + additionalHealth)
      }

      switch (key) {
        case 'con':
          increasePoints()
          break
        default:
          break
      }
    }
    






  }, [player.leftPoints, playerActions]);

  return { handleIncreaseStat };
};

export default useStatManagement;
