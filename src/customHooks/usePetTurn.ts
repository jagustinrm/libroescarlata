import { useEffect } from 'react';
import usePositionStore from '../stores/positionStore.ts';
import useCreatureStore from '../stores/creatures.ts';
import usePlayerStore from '../stores/playerStore.ts';
import { isAttackSuccessful } from '../utils/calculateDodgePercentage.ts';
import { simulateAttackMovement } from '../utils/simulateAttackMovement.ts';
import { FloatingMessageProps } from '../stores/types/others';
import useTurnStore from '../stores/turnStore.ts';


interface EnemyTurnProps {
  setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
  setFloatingMessage: React.Dispatch<React.SetStateAction<FloatingMessageProps  | null>>;
  setSoundUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
}
export const usePetTurn = ({
  setActionMessages,
  setFloatingMessage,
  setSoundUrl
}: EnemyTurnProps) => {
  const {enemyPosition, petPosition, setPetPosition} = usePositionStore.getState();
  const {creature, setCreatureHealth} = useCreatureStore.getState();
  const {player} = usePlayerStore.getState();
  const {currentCharacter, nextTurn } = useTurnStore.getState();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        enemyPosition &&
        creature &&
        currentCharacter && 
        currentCharacter.id === 'pet' &&
        creature.health &&
        creature.health > 0 &&
        player.p_LeftHealth > 0
      ) {
        const distanceX = Math.abs(enemyPosition.x - petPosition.x);
        const distanceY = Math.abs(enemyPosition.y - petPosition.y);

        if (distanceX < 20 && distanceY < 20) {
           
          const petAttackTimeout = setTimeout(() => {
            // const totalAttack = rollDice('1d20') + creature['attacks'][0].bonus;
            simulateAttackMovement(petPosition, 5, setPetPosition);
            const success = isAttackSuccessful(
              creature.hitRatePercentage(),  // Usar 0 si hitRatePercentage no está definido
              player.dodgePercentage()       // Usar 0 si dodgePercentage no está definido
            );
           
            if (success) {
              const damage = player.selectedPet.attack.melee

              const rollDamage = Math.floor(Math.random() * (damage + 1)) + damage
              setCreatureHealth(
                Math.max(player.p_LeftHealth - rollDamage, 0),
              );
            //   setSoundUrl(creature.attacks[0].soundEffect)
            //   setTimeout(() => {
            //     setSoundUrl('');
            //   }, 300);
              setActionMessages((prev) => [
                ...prev,
                `Tu acompañante ha atacado y causó ${rollDamage} puntos de daño.`,
              ]);
              setFloatingMessage({message: rollDamage.toString(), onComplete: () => setFloatingMessage(null), textColor: "red", position: enemyPosition},  )

            } else {
              setSoundUrl('/music/attacks/weapon-swing.wav')
              setTimeout(() => {
                setSoundUrl('');
              }, 300);
              setFloatingMessage({message: "¡Falló!", onComplete: () => setFloatingMessage(null), textColor: "red", position: enemyPosition},  )
              setActionMessages((prev) => [...prev, `¡Tu acompañante falló!`]);
            }

            nextTurn();
          }, 1000);

          return () => clearTimeout(petAttackTimeout);
        } else {
          nextTurn();
        }
      } else if (
        creature &&
        currentCharacter && currentCharacter.id === 'pet' &&
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
