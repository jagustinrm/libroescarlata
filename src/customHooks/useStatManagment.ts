import { useCallback } from 'react';
import { use

type Stats = {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
};

const useStatManagement = () => {
  const { player, playerActions } = usePlayerStore();

  const handleIncreaseStat = useCallback((key: keyof Stats, pointsToAdd: number) => {
    if (player.leftPoints > 0) {
      playerActions.addStatsPoints(pointsToAdd, key);
      playerActions.addStatsLeftPoints(-1);
    }
  }, [player.leftPoints, playerActions]);

  return { handleIncreaseStat };
};

export default useStatManagement;
