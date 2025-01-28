import { useEffect } from 'react';
import usePositionStore from '../stores/positionStore.ts';
import useCreatureStore from '../stores/creatures.ts';
import usePlayerStore from '../stores/playerStore.ts';
import { isAttackSuccessful } from '../utils/calculateStats.ts';
import { simulateAttackMovement } from '../utils/simulateAttackMovement.ts';
import { FloatingMessageProps } from '../stores/types/others';
import useTurnStore from '../stores/turnStore.ts';

interface EnemyTurnProps {
  // turn: string;
  setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
  // switchTurn: () => void;
  setFloatingMessage: React.Dispatch<
    React.SetStateAction<FloatingMessageProps | null>
  >;
  setSoundUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
}
export const useEnemyTurn = ({
  // turn,
  setActionMessages,
  // switchTurn,
  setFloatingMessage,
  setSoundUrl,
}: EnemyTurnProps) => {
  const { playerPosition, enemyPosition, setEnemyPosition } =
    usePositionStore.getState();
  const { creature } = useCreatureStore.getState();
  const { player, playerActions } = usePlayerStore.getState();
  const { currentCharacter, nextTurn } = useTurnStore.getState();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        currentCharacter &&
        currentCharacter.id === 'enemy' &&
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
        currentCharacter &&
        currentCharacter.id === 'enemy' &&
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
              creature.hitRatePercentage(), // Usar 0 si hitRatePercentage no está definido
              player.dodgePercentage(), // Usar 0 si dodgePercentage no está definido
            );
      ;
            if (success) {
              const { damage, damageMax } = creature['attacks'][0];
              const rollDamage = Math.floor(Math.random() * (damageMax - damage + 1)) + damage;
              const redDamage = player.totalDmgReduction(creature.level);
              const finalDamage = Math.floor(
                rollDamage * (1 - redDamage / 100),
              );

              playerActions.setP_LeftHealth(
                Math.max(player.p_LeftHealth - finalDamage, 0),
              );
              setSoundUrl(creature.attacks[0].soundEffect);
              setTimeout(() => {
                setSoundUrl('');
              }, 300);
              setActionMessages((prev) => [
                ...prev,
                `El enemigo te ha atacado con ${creature['attacks'][0].name} y causó ${finalDamage} puntos de daño.`,
              ]);
              setFloatingMessage({
                message: finalDamage.toString(),
                onComplete: () => setFloatingMessage(null),
                textColor: 'red',
                position: playerPosition,
              });
            } else {
              setSoundUrl('/music/attacks/weapon-swing.wav');
              setTimeout(() => {
                setSoundUrl('');
              }, 300);
              setFloatingMessage({
                message: '¡Falló!',
                onComplete: () => setFloatingMessage(null),
                textColor: 'red',
                position: playerPosition,
              });
              setActionMessages((prev) => [...prev, `¡El enemigo falló!`]);
            }

            nextTurn();
          }, 1000);

          return () => clearTimeout(enemyAttackTimeout);
        } else {
          nextTurn();
        }
      } else if (
        creature &&
        currentCharacter &&
        currentCharacter.id === 'enemy' &&
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
