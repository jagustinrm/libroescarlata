import { useEffect } from 'react';
import { calculateDistance } from '../utils/calculateDistance.ts';
import automaticMove from './automaticMove.ts';
import AttackAction from '../utils/attackAction.ts';
import { getGlobalState } from './useGlobalState.ts';

export const useEnemyTurn = () => {
  const {setActionMessages, creature, 
    setFloatingMessage, player, playerActions, 
    currentCharacter, nextTurn, playerPosition, enemyPosition,
    setEnemyPosition } = getGlobalState();
  useEffect(() => {
    const adjustedDistance = calculateDistance(enemyPosition, playerPosition);
    const timeout = setTimeout(() => {
      if (
        currentCharacter &&
        currentCharacter.id === 'enemy' &&
        creature &&
        creature.p_LeftHealth &&
        creature.p_LeftHealth > 0 &&
        player.p_LeftHealth > 0 &&
        adjustedDistance > Math.max(...creature.attacks.map((a) => a.range))
      ) {
        automaticMove(enemyPosition, playerPosition, setEnemyPosition);
      }

      if (
        playerPosition &&
        creature &&
        currentCharacter &&
        currentCharacter.id === 'enemy' &&
        creature.p_LeftHealth &&
        creature.p_LeftHealth > 0 &&
        player.p_LeftHealth > 0
      ) {
        AttackAction(
          adjustedDistance,
          creature,
          player,
          enemyPosition,
          playerPosition,
          setEnemyPosition,
          setFloatingMessage,
          setActionMessages,
          playerActions.setP_LeftHealth,
          nextTurn,
        )
      } 
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentCharacter && currentCharacter.id]);
};
