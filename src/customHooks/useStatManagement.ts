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
  
    const additionalHealth = player.p_MaxHealth + Math.floor((player.stats[key] / 10))

    switch (key) {
      case 'con':
        playerActions.setP_MaxHealth(additionalHealth)
        break
      default:
        break
    }




  }, [player.leftPoints, playerActions]);

  return { handleIncreaseStat };
};

export default useStatManagement;
