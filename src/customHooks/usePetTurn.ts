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
import AttackAction from '../utils/attackAction.ts';

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
        AttackAction(
          adjustedDistance,
          player.selectedPet,
          creature,
          petPosition,
          enemyPosition,
          setPetPosition,
          setFloatingMessage,
          setActionMessages,
          setCreatureHealth,
          nextTurn
        )

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
