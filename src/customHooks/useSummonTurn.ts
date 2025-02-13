import { useEffect } from 'react';
import useTurnStore from '../stores/turnStore.ts';
import { calculateDistance } from '../utils/calculateDistance.ts';
import automaticMove from './automaticMove.ts';
import { simulateAttackMovement } from '../utils/simulateAttackMovement.ts';
import { isAttackSuccessful } from '../utils/calculateStats.ts';
import { getGlobalState } from './useGlobalState.ts';
import useAppStore from '../stores/appStore.ts';

interface SummonTurnProps {
  setCreatureHealth: (health: number) => void;
  setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useSummonTurn = ({
  setActionMessages,
  setCreatureHealth,
}: SummonTurnProps) => {
  const { currentCharacter, nextTurn } = useTurnStore.getState();
  const { creature, player, enemyPosition, summon, 
    summonPosition, setSummonPosition, setSoundUrl} = getGlobalState();
  useEffect(() => {
    const adjustedDistance = calculateDistance(
      summonPosition,
      enemyPosition,
    );
    const timeout = setTimeout(() => {
      if (
        currentCharacter &&
        currentCharacter.id === 'summon' &&
        summon &&
        creature.health &&
        creature.health > 0 &&
        player.p_LeftHealth > 0 &&
        adjustedDistance > Math.max(...summon.attacks.map((a) => a.range))
      ) {
        automaticMove(summonPosition, enemyPosition, setSummonPosition);
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
        if (adjustedDistance <= Math.max(...creature.attacks.map((a) => a.range))) {
          const summonAttackTimeout = setTimeout(() => {
            simulateAttackMovement(summonPosition, 5, setSummonPosition);
            const success = isAttackSuccessful(
              summon.hitRatePercentage(), 
              creature.dodgePercentage(),
            );

            if (success) {
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
              
              creature.health && setCreatureHealth(Math.max(creature.health - totalDamage, 0));
              setSoundUrl(summon.attacks[0].soundEffect);
              setTimeout(() => {
                setSoundUrl('');
              }, 300);
              
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
