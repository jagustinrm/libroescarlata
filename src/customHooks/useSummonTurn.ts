import { useEffect } from 'react';
import useTurnStore from '../stores/turnStore.ts';
import { calculateDistance } from '../utils/calculateDistance.ts';
import automaticMove from './automaticMove.ts';
import { getGlobalState } from './useGlobalState.ts';
import AttackAction from '../utils/attackAction.ts';

export const useSummonTurn = () => {
  const { currentCharacter, nextTurn } = useTurnStore.getState();
  const { creature, player, enemyPosition, summon, 
    summonPosition, setSummonPosition, setFloatingMessage,
    setActionMessages, playerActions} = getGlobalState();
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
        creature.p_LeftHealth &&
        creature.p_LeftHealth > 0 &&
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
        creature.p_LeftHealth &&
        creature.p_LeftHealth > 0 &&
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
          playerActions.setP_LeftHealth,
          nextTurn,
          player.summonDmgIncrease()
        )
      } 
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentCharacter && currentCharacter.id]);
};
