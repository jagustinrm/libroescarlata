import { useEffect } from 'react';
import usePositionStore from '../stores/positionStore.ts';
import useCreatureStore from '../stores/creatures.ts';
import usePlayerStore from '../stores/playerStore.ts';
import useTurnStore from '../stores/turnStore.ts';
import useAppStore from '../stores/appStore.ts';
import { calculateDistance } from '../utils/calculateDistance.ts';
import automaticMove from './automaticMove.ts';
import AttackAction from '../utils/attackAction.ts';

interface EnemyTurnProps {
  setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
}
export const useEnemyTurn = ({ setActionMessages }: EnemyTurnProps) => {
  const { playerPosition, enemyPosition, setEnemyPosition } =
    usePositionStore.getState();
  const { creature } = useCreatureStore.getState();
  const { setFloatingMessage } = useAppStore.getState();
  const { player, playerActions } = usePlayerStore.getState();
  const { currentCharacter, nextTurn } = useTurnStore.getState();
  
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
