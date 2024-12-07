import React from 'react';
import { Player } from '../../stores/types/player';
import { Creature } from '../../stores/types/creatures';
interface NewEnemyClickParams {
    player: Player
    handleMessage: (message: string, type: string, shouldClose: boolean) => void;
    setTurn:  React.Dispatch<React.SetStateAction<"player" | "enemy">>;
    updateEnemy: boolean;
    setUpdateEnemy: React.Dispatch<React.SetStateAction<boolean>>;
    setPlayerPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
    setEnemyPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

interface EndBattleActionsProps {
    creatureHealth?: number;
    handleNewEnemyClick: (params: NewEnemyClickParams) => void;
    fightType: string;
    player: Player 
    handleMessage: (message: string, type: string, shouldClose: boolean) => void;
    setTurn:  React.Dispatch<React.SetStateAction<"player" | "enemy">>;
    updateEnemy: boolean;
    setUpdateEnemy: React.Dispatch<React.SetStateAction<boolean>>;
    setPlayerPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
    setEnemyPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
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
    setPlayerPosition,
    setEnemyPosition,
    creature
}) => {
    if (creatureHealth !== 0) return null;

    return (
        <div>
            <div className="container-endBattle">
                <button
                    onClick={() =>
                        handleNewEnemyClick({
                            player,
                            handleMessage,
                            setTurn,
                            updateEnemy,
                            setUpdateEnemy,
                            setPlayerPosition,
                            setEnemyPosition,
                        })
                    }
                    className="rpgui-button endBattleButton"
                >
                    ⚔️ Seguir
                </button>
                {fightType === 'normal' || creature.role === 'boss' && (
                    <button
                        className="rpgui-button endBattleButton"
                        onClick={() =>
                            handleMessage("¡Has vuelto sano y salvo!", "warning", true)
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
