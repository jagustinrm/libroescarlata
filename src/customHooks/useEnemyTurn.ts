import { useEffect } from 'react';
import { rollDice } from '../utils/rollDice.ts';
import usePositionStore from '../stores/positionStore.ts';
import useCreatureStore from '../stores/creatures.ts';
import usePlayerStore from '../stores/playerStore.ts';


interface EnemyTurnProps {
  turn: string;
  setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
  switchTurn: () => void;
}

export const useEnemyTurn = ({
  turn,
  setActionMessages,
  switchTurn,

}: EnemyTurnProps) => {
  const {playerPosition, enemyPosition, setEnemyPosition} = usePositionStore.getState();
  const {creature} = useCreatureStore.getState();
  const {player, playerActions} = usePlayerStore.getState();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        turn === 'enemy' &&
        creature &&
        creature.health &&
        creature.health > 0 &&
        player.p_LeftHealth > 0
      ) {
        const deltaX = playerPosition.x - enemyPosition.x;
        const deltaY = playerPosition.y - enemyPosition.y;

        const stepSize = 10;

        const newX =
          Math.abs(deltaX) > stepSize
            ? enemyPosition.x + (deltaX > 0 ? stepSize : -stepSize)
            : enemyPosition.x;

        const newY =
          Math.abs(deltaY) > stepSize
            ? enemyPosition.y + (deltaY > 0 ? stepSize : -stepSize)
            : enemyPosition.y;
        setEnemyPosition({ x: newX, y: newY });
      }

      if (
        playerPosition &&
        creature &&
        turn === 'enemy' &&
        creature.health &&
        creature.health > 0 &&
        player.p_LeftHealth > 0
      ) {
        const distanceX = Math.abs(playerPosition.x - enemyPosition.x);
        const distanceY = Math.abs(playerPosition.y - enemyPosition.y);

        if (distanceX < 10 && distanceY < 10) {
          const enemyAttackTimeout = setTimeout(() => {
            const totalAttack = rollDice('1d20') + creature['attacks'][0].bonus;
            if (totalAttack > player.totalArmorClass()) {
              const damageDice = creature['attacks'][0].damage;
              const damage = rollDice(damageDice);

              playerActions.setP_LeftHealth(
                Math.max(player.p_LeftHealth - damage, 0),
              );

              setActionMessages((prev) => [
                ...prev,
                `El enemigo te ha atacado con ${creature['attacks'][0].name} y causó ${damage} puntos de daño.`,
              ]);
            } else {
              setActionMessages((prev) => [...prev, `¡El enemigo falló!`]);
            }

            switchTurn();
          }, 1000);

          return () => clearTimeout(enemyAttackTimeout);
        } else {
          switchTurn();
        }
      } else if (
        creature &&
        turn === 'enemy' &&
        creature.health &&
        creature.health > 0 &&
        player.p_LeftHealth > 0
      ) {
        switchTurn();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [turn]);
};
