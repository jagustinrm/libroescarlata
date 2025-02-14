import { useEffect } from 'react';
import { Creature } from '../stores/types/creatures.ts';
import useTurnStore from '../stores/turnStore.ts';
import { getGlobalState } from './useGlobalState.ts';
const BOSS_PROBABILITY = 0.5; // 5% de probabilidad para bosses

interface HandleNewEnemyClickParams {
  handleMessage: (message: string, type: string, shouldClose: boolean) => void;
}

export function useEnemyLoader(
  level: number,
  dungeonLevel: number,
  enemy: string | null,
) {
  const { setTurn } = useTurnStore();
  const { creatures, bosses, setCreature, creatureLoaded, fightType, setCreatureLoaded  } = getGlobalState();

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
      // Si recibe un enemy carga solamente ese enemy, no busca otro. Modo historia.
      if (enemy) {
        const storyCreature = creatures.find((c) => c.name === enemy);
        if (storyCreature) {
          const initialHealth = storyCreature.hitPoints
          setCreature({ 
            ...storyCreature, 
            health: initialHealth, 
            p_LeftHealth: initialHealth 
          });
          setCreatureLoaded(false)
          return;
        }
      }

      if (fightType === 'dungeon') {
        const isBoss = Math.random() < BOSS_PROBABILITY;

        if (isBoss && bosses.length > 0) {
          const finalBosses = filterByLevel(bosses, dungeonLevel, true);
          const randomBoss =
            finalBosses[Math.floor(Math.random() * finalBosses.length)];
          const initialHealth = randomBoss.hitPoints;

          setCreature({ ...randomBoss, health: initialHealth, p_LeftHealth: initialHealth  });
          return;
        }
      }

      const finalCreatures = filterByLevel(creatures, level, false);
      const randomCreature =
        finalCreatures[Math.floor(Math.random() * finalCreatures.length)];
      const initialHealth = randomCreature.hitPoints;
      setCreature({ ...randomCreature, health: initialHealth, p_LeftHealth: initialHealth });
    } finally {
      setCreatureLoaded(false)
    }
  };

  const handleNewEnemyClick = ({
    handleMessage,
  }: HandleNewEnemyClickParams) => {
    const { resetPositions, player, setCreatureLoaded } = getGlobalState();
    handleMessage(`${player.name} busca un nuevo enemigo...`, 'success', false);
    setTimeout(() => {
      setTurn('player');
      setCreatureLoaded(true)
      resetPositions();
      selectEnemy();
    }, 1000);
  };

  useEffect(() => {
    selectEnemy();
  }, [creatureLoaded]);

  return {  handleNewEnemyClick };
}
