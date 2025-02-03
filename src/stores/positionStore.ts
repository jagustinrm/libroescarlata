import { create } from 'zustand';

interface Position {
  x: number;
  y: number;
}

interface PositionStore {
  playerPosition: Position;
  enemyPosition: Position;
  summonPosition: Position;
  petPosition: Position;
  setPlayerPosition: (position: Position) => void;
  setEnemyPosition: (position: Position) => void;
  setSummonPosition: (position: Position) => void;
  setPetPosition: (position: Position) => void;
  resetPositions: () => void;
}

const usePositionStore = create<PositionStore>((set) => {
  const initialPlayerPosition = {
    x: 0 - 10 / 1.2, // initialX - offsetX
    y: 45 - 20 / 1.5, // initialY - offsetY
  };

  const initialEnemyPosition: Position = {
    x: 45 - 10 / 1.2, // 45 - offsetX
    y: 0 - 20 / 1.5,  // 0 - offsetY
  };

  const initialSummonPosition: Position = {
    x: initialPlayerPosition.x + 6,
    y: initialPlayerPosition.y + 4,
  };

  const initialPetPosition: Position = {
    x: initialPlayerPosition.x + 8,
    y: initialPlayerPosition.y + 12,
  };
  return {
    playerPosition: initialPlayerPosition,
    enemyPosition: initialEnemyPosition,
    summonPosition: initialSummonPosition,
    petPosition: initialPetPosition,
    setPlayerPosition: (position) =>
      set(() => ({
        playerPosition: position,
      })),
    setEnemyPosition: (position) => set(() => ({ enemyPosition: position })),
    setSummonPosition: (position) => set(() => ({ summonPosition: position })),
    setPetPosition: (position) => set(() => ({ petPosition: position })),
    resetPositions: () =>
      set(() => ({
        playerPosition: { ...initialPlayerPosition },
        enemyPosition: { ...initialEnemyPosition },
        summonPosition: { ...initialSummonPosition },
        petPosition: { ...initialPetPosition },
      })),
  };
});

export default usePositionStore;
