import { useEffect } from 'react';
import { calculateDistance } from '../utils/calculateDistance.ts';
import AttackAction from '../utils/attackAction.ts';
import { getGlobalState } from './useGlobalState.ts';

export const usePetTurn = () => {
  const {player, creature, setc_LeftHealth, setFloatingMessage, 
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
        creature.c_LeftHealth &&
        creature.c_LeftHealth > 0 &&
        player.c_LeftHealth > 0
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
          setc_LeftHealth,
          nextTurn,
          player.summonDmgIncrease() // Aumento el daño del pet?
        )
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentCharacter && currentCharacter.id]);
};
