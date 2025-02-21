import React from 'react';
import usePlayerStore from '../../../stores/playerStore';
import usePotionStore from '../../../stores/potionsStore';
import useCreatureStore from '../../../stores/creatures';
import useTurnStore from '../../../stores/turnStore';
import { Item } from '../../../stores/types/items';

interface AttackAndPotionsProps {
  executeAction: (type: 'attack' | 'spell' | 'scroll', item?: Item) => void;
}

const AttackAndPotions: React.FC<AttackAndPotionsProps> = ({
  executeAction,
}) => {
  // Lógica para encontrar la poción específica
  const { player } = usePlayerStore();
  const { creature } = useCreatureStore();
  const { currentCharacter } = useTurnStore();
  return (
    <div className="attackAndPotions">
      <button
        className="rpgui-button newDesign espada"
        id="newDesign"
        onClick={() => executeAction('attack')}
        disabled={
          creature.p_LeftHealth === 0 ||
          player.p_LeftHealth === 0 ||
          !player.bodyParts.manoDerecha ||
          currentCharacter?.id !== 'player'
        }
      >
        ⚔️
      </button>
    </div>
  );
};

export default AttackAndPotions;
