import React from 'react';
import { Player } from '../../stores/types/player';
import { Creature } from '../../stores/types/creatures';

interface NewEnemyClickParams {
  handleMessage: (message: string, type: string, shouldClose: boolean) => void;
  fightType: string;
}

interface EndBattleActionsProps {
  creatureHealth?: number;
  handleNewEnemyClick: (params: NewEnemyClickParams) => void;
  fightType: string;
  player: Player;
  handleMessage: (message: string, type: string, shouldClose: boolean) => void;
  creature: Creature;
}

const EndBattleActions: React.FC<EndBattleActionsProps> = ({
  creatureHealth,
  handleNewEnemyClick,
  fightType,
  handleMessage,
  creature,
}) => {
  if (creatureHealth !== 0) return null;

  return (
    <div>
      <div className="container-endBattle fixedUI ">
        {fightType !== 'story' && (
          <button
            onClick={() =>
              handleNewEnemyClick({
                handleMessage,
                fightType,
              })
            }
            className="rpgui-button endBattleButton"
          >
            ⚔️ Seguir
          </button>
        )}
        {(fightType === 'normal' ||
          creature.role === 'boss' ||
          fightType === 'story' ||
          fightType === 'travel') && (
          <button
            className="rpgui-button endBattleButton"
            onClick={() =>
              handleMessage('¡Has vuelto sano y salvo!', 'warning', true)
            }
          >
            Volver
          </button>
        )}
      </div>
      <div className="blackScreen"></div>
    </div>
  );
};

export default EndBattleActions;
