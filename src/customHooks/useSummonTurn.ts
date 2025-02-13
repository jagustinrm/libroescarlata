import { useEffect } from 'react';
import useTurnStore from '../stores/turnStore.ts';
import { calculateDistance } from '../utils/calculateDistance.ts';
import automaticMove from './automaticMove.ts';
import { getGlobalState } from './useGlobalState.ts';
import AttackAction from '../utils/attackAction.ts';

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
    summonPosition, setSummonPosition, setFloatingMessage} = getGlobalState();
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
        AttackAction(
          adjustedDistance,
          summon,
          creature,
          summonPosition,
          enemyPosition,
          setSummonPosition,
          setFloatingMessage,
          setActionMessages,
          setCreatureHealth,
          nextTurn,
          player.summonDmgIncrease()
        )
      } 
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentCharacter && currentCharacter.id]);
};
