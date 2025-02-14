import React from 'react';
import { getGlobalState } from '../../customHooks/useGlobalState';

interface NewEnemyClickParams {
  handleMessage: (message: string, type: string, shouldClose: boolean) => void;
}

interface EndBattleActionsProps {
  creatureHealth?: number;
  handleNewEnemyClick: (params: NewEnemyClickParams) => void;
  handleMessage: (message: string, type: string, shouldClose: boolean) => void;
}

const EndBattleActions: React.FC<EndBattleActionsProps> = ({
  creatureHealth,
  handleNewEnemyClick,
  handleMessage,
}) => {
  if (creatureHealth !== 0) return null;
  const {creature, fightType} = getGlobalState();
  return (
    <div>
      <div className="container-endBattle fixedUI ">
        {fightType !== 'story' && (
          <button
            onClick={() =>
              handleNewEnemyClick({
                handleMessage,
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
