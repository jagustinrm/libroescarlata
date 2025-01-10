import React from 'react';
import { Player } from '../../stores/types/player';
import { Creature } from '../../stores/types/creatures';

interface NewEnemyClickParams {
  player: Player;
  handleMessage: (message: string, type: string, shouldClose: boolean) => void;
  setTurn: React.Dispatch<React.SetStateAction<'player' | 'enemy' | 'summon'>>;
  updateEnemy: boolean;
  setUpdateEnemy: React.Dispatch<React.SetStateAction<boolean>>;
  fightType: string;
}

interface EndBattleActionsProps {
  creatureHealth?: number;
  handleNewEnemyClick: (params: NewEnemyClickParams) => void;
  fightType: string;
  player: Player;
  handleMessage: (message: string, type: string, shouldClose: boolean) => void;
  setTurn: React.Dispatch<React.SetStateAction<'player' | 'enemy' | 'summon'>>;
  updateEnemy: boolean;
  setUpdateEnemy: React.Dispatch<React.SetStateAction<boolean>>;
  creature: Creature;
}

const EndBattleActions: React.FC<EndBattleActionsProps> = ({
  creatureHealth,
  handleNewEnemyClick,
  fightType,
  player,
  handleMessage,
  setTurn,
  updateEnemy,
  setUpdateEnemy,
  creature,
}) => {
  if (creatureHealth !== 0) return null;

  return (
    <div>
      <div className="container-endBattle fixedUI ">
        {fightType !== 'story' &&
                <button
                onClick={() =>
                  handleNewEnemyClick({
                    player,
                    handleMessage,
                    setTurn,
                    updateEnemy,
                    setUpdateEnemy,
                    fightType,
                  })
                }
                className="rpgui-button endBattleButton"
              >
                ⚔️ Seguir
              </button>
        }
        {(fightType === 'normal' || 
        creature.role === 'boss' || 
        fightType === 'story' ||
        fightType === 'travel'
        ) && (
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
