import { useEffect } from 'react';
import { calculateDistance } from '../utils/calculateDistance.ts';
import AttackAction from '../utils/attackAction.ts';
import { getGlobalState } from './useGlobalState.ts';

export const usePetTurn = () => {
  const {player, creature, setP_LeftHealth, setFloatingMessage, 
    currentCharacter, nextTurn, 
    enemyPosition, petPosition, setPetPosition, 
    playerPosition, setActionMessages } = getGlobalState();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        enemyPosition &&
        creature &&
        currentCharacter &&
        currentCharacter.id === 'pet' &&
        creature.p_LeftHealth &&
        creature.p_LeftHealth > 0 &&
        player.p_LeftHealth > 0
      ) {
        const adjustedDistance = calculateDistance(
          playerPosition,
          enemyPosition,
        );
        AttackAction(
          adjustedDistance,
          player.selectedPet,
          creature,
          petPosition,
          enemyPosition,
          setPetPosition,
          setFloatingMessage,
          setActionMessages,
          setP_LeftHealth,
          nextTurn,
          player.summonDmgIncrease() // Aumento el daño del pet?
        )
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentCharacter && currentCharacter.id]);
};
