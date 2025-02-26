import { getGlobalState } from "../../customHooks/useGlobalState";
import { Creature } from "../../stores/types/creatures";


export const selectEnemy = (
  level: number,
  dungeonLevel: number,
  enemy: string | null,
) => {
    const { creatures, bosses, setCreature, fightType, setCreatureLoaded, creatureLoaded  } = getGlobalState();
    const BOSS_PROBABILITY = 100; 
    try {
      // Si recibe un enemy carga solamente ese enemy, no busca otro. Modo historia.
      if (enemy) {
        const storyCreature = creatures.find((c) => c.name === enemy);
        if (storyCreature) {
          const initialHealth = storyCreature.hitPoints
          setCreature({ 
            ...storyCreature, 
            health: initialHealth, 
            c_LeftHealth: initialHealth 
          });
          setCreatureLoaded(true)
          console.log(creatureLoaded)
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

          setCreature({ ...randomBoss, health: initialHealth, c_LeftHealth: initialHealth  });
          return;
        }
      }

      const finalCreatures = filterByLevel(creatures, level, false);
      const randomCreature =
        finalCreatures[Math.floor(Math.random() * finalCreatures.length)];
      const initialHealth = randomCreature.hitPoints;
      setCreature({ ...randomCreature, health: initialHealth, c_LeftHealth: initialHealth });
    } finally {
      setCreatureLoaded(true)
    }
  };

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
  