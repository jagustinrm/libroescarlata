import React from 'react';
import { getGlobalState } from '../../customHooks/useGlobalState';

interface NewEnemyClickParams {
  handleMessage: (message: string, type: string, shouldClose: boolean) => void;
}

interface EndBattleActionsProps {
  handleNewEnemyClick: (params: NewEnemyClickParams) => void;
  handleMessage: (message: string, type: string, shouldClose: boolean) => void;
}

const EndBattleActions: React.FC<EndBattleActionsProps> = ({
  handleNewEnemyClick,
  handleMessage,
}) => {
  const {creature, fightType, } = getGlobalState();
  const goBack = () => {
    handleMessage('¡Has vuelto sano y salvo!', 'warning', true)
  }

  if (creature.c_LeftHealth !== 0) return null;
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
              goBack()
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
