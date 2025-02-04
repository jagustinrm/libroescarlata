import { useCallback } from 'react';
import usePlayerStore from '../stores/playerStore';
import { Stats } from '../stores/types/stats';
const useStatManagement = () => {
  const { player, playerActions } = usePlayerStore();

  const handleIncreaseStat = useCallback(
    (key: keyof Stats, pointsToAdd: number) => {
      if (player.leftPoints > 0) {
        playerActions.addStatsPoints(pointsToAdd, key);
        playerActions.addStatsLeftPoints(-1);
      }
    },
    [player, playerActions],
  );

  return { handleIncreaseStat };
};

export default useStatManagement;
