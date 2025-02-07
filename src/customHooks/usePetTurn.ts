import { useEffect } from 'react';
import usePositionStore from '../stores/positionStore.ts';
import useCreatureStore from '../stores/creatures.ts';
import usePlayerStore from '../stores/playerStore.ts';
import { isAttackSuccessful } from '../utils/calculateStats.ts';
import { simulateAttackMovement } from '../utils/simulateAttackMovement.ts';
import useTurnStore from '../stores/turnStore.ts';
import { Creature } from '../stores/types/creatures.ts';
import useAppStore from '../stores/appStore.ts';
import { calculateDistance } from '../utils/calculateDistance.ts';

interface EnemyTurnProps {
  setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
  handleMessage?: (message: string, type: string, shouldClose: boolean) => void;
  handlePostCombatActs?: (fightType: string, creature: Creature) => void;
  fightType?: string;
}
export const usePetTurn = ({
  setActionMessages,
  fightType,
  handleMessage,
  handlePostCombatActs,
}: EnemyTurnProps) => {
  const { enemyPosition, petPosition, setPetPosition, playerPosition } =
    usePositionStore.getState();
  const { creature, setCreatureHealth } = useCreatureStore.getState();
  const { player } = usePlayerStore.getState();
  const { setFloatingMessage, setSoundUrl } = useAppStore.getState();
  const { currentCharacter, nextTurn } = useTurnStore.getState();
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
        const adjustedDistance = calculateDistance(
          playerPosition,
          enemyPosition,
        );
        console.log(adjustedDistance);
        console.log(player.selectedPet.attacks[0]);

        if (adjustedDistance <= player.selectedPet.attacks[0].range) {
          const petAttackTimeout = setTimeout(() => {
            // const totalAttack = rollDice('1d20') + creature['attacks'][0].bonus;
            simulateAttackMovement(petPosition, 5, setPetPosition);
            const success = isAttackSuccessful(
              creature.hitRatePercentage(), // Usar 0 si hitRatePercentage no está definido
              player.dodgePercentage(), // Usar 0 si dodgePercentage no está definido
            );

            if (success) {
              const { damage, damageMax } = player.selectedPet.attacks[0];
              const totalDamage = Math.floor(
                Math.random() * (damageMax - damage) + damage,
              );
              const redDamage = creature.totalDmgReduction(creature.level);
              const finalDamage = Math.floor(
                totalDamage * (1 - redDamage / 100),
              );

              setCreatureHealth(Math.max(player.p_LeftHealth - finalDamage, 0));

              //   setSoundUrl(creature.attacks[0].soundEffect)
              //   setTimeout(() => {
              //     setSoundUrl('');
              //   }, 300);
              setActionMessages((prev) => [
                ...prev,
                `Tu acompañante ha atacado y causó ${finalDamage} puntos de daño.`,
              ]);
              setFloatingMessage({
                message: finalDamage.toString(),
                onComplete: () => setFloatingMessage(null),
                textColor: 'red',
                position: enemyPosition,
              });

              if (
                creature.health &&
                creature.health - finalDamage <= 0 &&
                fightType
              ) {
                handleMessage?.('¡Has ganado el combate!', 'success', false);
                handlePostCombatActs?.(fightType, creature);
              }
            } else {
              setSoundUrl('/music/attacks/weapon-swing.wav');
              setTimeout(() => {
                setSoundUrl('');
              }, 300);

              setFloatingMessage({
                message: '¡Falló!',
                onComplete: () => setFloatingMessage(null),
                textColor: 'red',
                position: enemyPosition,
              });
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
        currentCharacter &&
        currentCharacter.id === 'pet' &&
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
