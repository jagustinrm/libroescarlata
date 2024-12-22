import { useState, useEffect } from 'react';
import { rollDice } from '../utils/rollDice.ts';
import { useSearchParams } from 'react-router-dom';
// import { CreatureInterface } from '../components/interfaces/CreatureInterface.ts';
import { Creature } from '../stores/types/creatures.ts';
import useCreatureStore from '../stores/creatures';
import { Dispatch, SetStateAction } from 'react';
import { Player } from '../stores/types/player';
import usePositionStore from '../stores/positionStore.ts';
const BOSS_PROBABILITY = 0.5; // 5% de probabilidad para bosses

interface HandleNewEnemyClickParams {
  player: Player;
  handleMessage: (message: string, type: string, shouldClose: boolean) => void;
  setTurn: React.Dispatch<React.SetStateAction<'player' | 'enemy' | 'summon'>>;
  updateEnemy: boolean;
  setUpdateEnemy: Dispatch<SetStateAction<boolean>>;
}

export function useEnemyLoader(
  level: number,
  dungeonLevel: number,
  updateEnemy: boolean,
  enemy: string | null,
) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'normal';
  const { creatures, bosses, setCreature } = useCreatureStore();

  const filterByLevel = (
    entities: Creature[],
    targetLevel: number,
    isBoss: boolean,
  ) => {
    const filtered = isBoss
      ? entities.filter((entity) => entity.level === targetLevel)
      : entities.filter((entity) => entity.level <= targetLevel);

    // Si `isBoss` es verdadero pero no se encuentran bosses exactos, buscar bosses de nivel menor o igual
    if (isBoss && filtered.length === 0) {
      const fallbackFiltered = entities.filter(
        (entity) => entity.level <= targetLevel,
      );
      if (fallbackFiltered.length > 0) return fallbackFiltered;
    }

    if (filtered.length > 0) return filtered;

    throw new Error(
      `No se encontraron ${isBoss ? 'bosses' : 'criaturas normales'} para el nivel ${targetLevel}.`,
    );
  };

  const selectEnemy = () => {

    try {
      if (enemy) {
        const storyCreature = creatures.find(c => c.name === enemy)
        if (storyCreature) {
          const initialHealth = rollDice(storyCreature.hitPoints);
          setCreature({ ...storyCreature, health: initialHealth });
          setIsLoading(false);
          return
        }
        

      }
      if (type === 'dungeon') {
        const isBoss = Math.random() < BOSS_PROBABILITY;

        if (isBoss && bosses.length > 0) {
          const finalBosses = filterByLevel(bosses, dungeonLevel, true);
          const randomBoss =
            finalBosses[Math.floor(Math.random() * finalBosses.length)];
          const initialHealth = rollDice(randomBoss.hitPoints);

          setCreature({ ...randomBoss, health: initialHealth });
          return;
        }
      }

      const finalCreatures = filterByLevel(creatures, level, false);
      const randomCreature =
        finalCreatures[Math.floor(Math.random() * finalCreatures.length)];
      const initialHealth = rollDice(randomCreature.hitPoints);
      setCreature({ ...randomCreature, health: initialHealth });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewEnemyClick = ({
    player,
    handleMessage,
    setTurn,
    updateEnemy,
    setUpdateEnemy,
  }: HandleNewEnemyClickParams) => {
    const {setPlayerPosition, setEnemyPosition,} = usePositionStore.getState();
    handleMessage(`${player.name} busca un nuevo enemigo...`, 'success', false);
    setTimeout(() => {
      setTurn('player');
      setUpdateEnemy(!updateEnemy);
      setPlayerPosition({ x: 0 - 10 / 1.2, y: 45 -  20 / 1.5 });
      setEnemyPosition({ x: 45 - 10 / 1.2, y: 0 -  20 / 1.5 });
    }, 1000);
  };

  useEffect(() => {
    setIsLoading(true);

    selectEnemy();
  }, [updateEnemy]);

  return { isLoading, handleNewEnemyClick };
}
