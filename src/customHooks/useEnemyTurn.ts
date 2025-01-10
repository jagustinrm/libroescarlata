import { useEffect } from 'react';
import usePositionStore from '../stores/positionStore.ts';
import useCreatureStore from '../stores/creatures.ts';
import usePlayerStore from '../stores/playerStore.ts';
import { isAttackSuccessful } from '../utils/calculateDodgePercentage.ts';
import { simulateAttackMovement } from '../utils/simulateAttackMovement.ts';
import { FloatingMessageProps } from '../stores/types/others';


interface EnemyTurnProps {
  turn: string;
  setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
  switchTurn: () => void;
  setFloatingMessage: React.Dispatch<React.SetStateAction<FloatingMessageProps  | null>>;
  
}

export const useEnemyTurn = ({
  turn,
  setActionMessages,
  switchTurn,
  setFloatingMessage

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
            // const totalAttack = rollDice('1d20') + creature['attacks'][0].bonus;
            simulateAttackMovement(enemyPosition, 5, setEnemyPosition);
            const success = isAttackSuccessful(
              creature.hitRatePercentage(),  // Usar 0 si hitRatePercentage no está definido
              player.dodgePercentage()       // Usar 0 si dodgePercentage no está definido
            );
            
            if (success) {
              const {damage, damageMax} = creature['attacks'][0];
              const rollDamage = Math.floor(Math.random() * (damageMax - damage + 1)) + damage
              playerActions.setP_LeftHealth(
                Math.max(player.p_LeftHealth - rollDamage, 0),
              );


              setActionMessages((prev) => [
                ...prev,
                `El enemigo te ha atacado con ${creature['attacks'][0].name} y causó ${rollDamage} puntos de daño.`,
              ]);
              setFloatingMessage({message: rollDamage.toString(), onComplete: () => setFloatingMessage(null), textColor: "red", position: playerPosition},  )

            } else {
              setFloatingMessage({message: "¡Falló!", onComplete: () => setFloatingMessage(null), textColor: "red", position: playerPosition},  )
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
