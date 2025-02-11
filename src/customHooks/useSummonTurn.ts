import { useEffect } from 'react';
import { rollDice } from '../utils/rollDice.ts';
// import { CreatureInterface } from '../components/interfaces/CreatureInterface.ts';

import usePositionStore from '../stores/positionStore.ts';
import useCreatureStore from '../stores/creatures.ts';
import usePlayerStore from '../stores/playerStore.ts';
import useTurnStore from '../stores/turnStore.ts';
import { Summon } from '../stores/types/summons.ts';

interface SummonTurnProps {
  summon: Summon | null;
  setCreatureHealth: (health: number) => void;
  setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useSummonTurn = ({
  setActionMessages,
  summon,
  setCreatureHealth,
}: SummonTurnProps) => {
  const { enemyPosition, summonPosition, setSummonPosition } =
    usePositionStore.getState();
  const { creature } = useCreatureStore.getState();
  const { player } = usePlayerStore.getState();
  const { currentCharacter, nextTurn } = useTurnStore.getState();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        currentCharacter &&
        currentCharacter.id === 'summon' &&
        creature &&
        creature.health &&
        creature.health > 0 &&
        player.p_LeftHealth > 0
      ) {
        const deltaX = enemyPosition.x - summonPosition.x;
        const deltaY = enemyPosition.y - summonPosition.y;

        const stepSize = 5;

        const newX =
          Math.abs(deltaX) > stepSize
            ? summonPosition.x + (deltaX > 0 ? stepSize : -stepSize)
            : summonPosition.x;

        const newY =
          Math.abs(deltaY) > stepSize
            ? summonPosition.y + (deltaY > 0 ? stepSize : -stepSize)
            : summonPosition.y;
        setSummonPosition({ x: newX, y: newY });
      }

      if (
        enemyPosition &&
        summon &&
        creature &&
        currentCharacter &&
        currentCharacter.id === 'summon' &&
        creature.health &&
        creature.health > 0 &&
        player.p_LeftHealth > 0
      ) {
        const distanceX = Math.abs(enemyPosition.x - summonPosition.x);
        const distanceY = Math.abs(enemyPosition.y - summonPosition.y);

        if (distanceX < 10 && distanceY < 10) {
          const summonAttackTimeout = setTimeout(() => {
            const totalAttack = rollDice('1d20') + summon['attacks'][0].bonus;
            if (totalAttack > creature.armorClass && creature.health) {
              // const damageBase = summon['attacks'][0].damage;
              const { damage, damageMax } = summon['attacks'][0];
              // 1- Daño random min y max 2- reduccion de daño 3- incrementar los daños a- calcular 4- Calculo total con el incremento
              const rollDamage =
                Math.floor(Math.random() * (damageMax - damage + 1)) + damage;
              const redDamage = creature.totalDmgReduction(summon.level);
              const damageIncrease =
                rollDamage +
                Math.round((rollDamage * player.summonDmgIncrease()) / 100);
              const totalDamage = Math.floor(
                damageIncrease * (1 - redDamage / 100),
              );

              setCreatureHealth(Math.max(creature.health - totalDamage, 0));
              setActionMessages((prev) => [
                ...prev,
                `La invocación ha atacado con ${summon['attacks'][0].name} y causó ${totalDamage} puntos de daño.`,
              ]);
            } else {
              setActionMessages((prev) => [...prev, `¡La invocación falló!`]);
            }

            nextTurn();
          }, 1000);

          return () => clearTimeout(summonAttackTimeout);
        } else {
          nextTurn();
        }
      } else if (
        creature &&
        currentCharacter &&
        currentCharacter.id === 'summon' &&
        creature.health &&
        creature.health > 0 &&
        player.p_LeftHealth > 0
      ) {
        nextTurn();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentCharacter && currentCharacter.id]);
};
