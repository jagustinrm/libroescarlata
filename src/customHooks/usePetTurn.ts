import { useEffect } from 'react';
import { Creature } from '../stores/types/creatures.ts';
import { calculateDistance } from '../utils/calculateDistance.ts';
import AttackAction from '../utils/attackAction.ts';
import { getGlobalState } from './useGlobalState.ts';

interface EnemyTurnProps {
  setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
  handleMessage?: (message: string, type: string, shouldClose: boolean) => void;
  handlePostCombatActs?: (fightType: string, creature: Creature) => void;
  fightType?: string;
}
export const usePetTurn = ({
  setActionMessages,
}: EnemyTurnProps) => {
  const {player, creature, setP_LeftHealth, setFloatingMessage, 
    currentCharacter, nextTurn, 
    enemyPosition, petPosition, setPetPosition, 
    playerPosition } = getGlobalState();
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
