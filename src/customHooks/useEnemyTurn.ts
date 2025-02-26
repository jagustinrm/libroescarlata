import { useEffect } from 'react';
import { calculateDistance } from '../utils/calculateDistance.ts';
import automaticMove from './automaticMove.ts';
import AttackAction from '../utils/attackAction.ts';
import { getGlobalState } from './useGlobalState.ts';
import useCreatureStore from '../stores/creatures.ts';
import { checkForConditions } from '../utils/checkForConditions.ts';
import { reduceDurationFromConditions } from '../utils/reduceDurationFromConditions.ts';






export const useEnemyTurn = () => {

  const {setActionMessages, creature, 
    setFloatingMessage, player, playerActions, 
    currentCharacter, nextTurn, playerPosition, enemyPosition,
    setEnemyPosition } = getGlobalState();

  useEffect(() => {
    const adjustedDistance = calculateDistance(enemyPosition, playerPosition);
    const checkConditions = checkForConditions() // Chequea si tiene alguna condición. Ej: "stun".
    const timeout = setTimeout(() => {
      if (    currentCharacter && currentCharacter.id === 'enemy' && 
         creature &&
        creature.c_LeftHealth &&
        creature.c_LeftHealth > 0 &&
        player.c_LeftHealth > 0 && 
        checkConditions) {
        reduceDurationFromConditions()
        nextTurn()
        return
      }
      if (
        currentCharacter &&
        currentCharacter.id === 'enemy' &&
        creature &&
        creature.c_LeftHealth &&
        creature.c_LeftHealth > 0 &&
        player.c_LeftHealth > 0 &&
        adjustedDistance > Math.max(...creature.attacks.map((a) => a.range)) 
    
        
      ) {

        automaticMove(enemyPosition, playerPosition, setEnemyPosition);
      }

      if (
        playerPosition &&
        creature &&
        currentCharacter &&
        currentCharacter.id === 'enemy' &&
        creature.c_LeftHealth &&
        creature.c_LeftHealth > 0 &&
        player.c_LeftHealth > 0       
        
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
          playerActions.setc_LeftHealth,
          nextTurn,
        )
        reduceDurationFromConditions()





      } 


    }, 500);

    return () => clearTimeout(timeout);
  }, [currentCharacter && currentCharacter.id]);
};
