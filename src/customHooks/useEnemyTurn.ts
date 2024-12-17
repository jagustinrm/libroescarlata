import { useEffect } from 'react';
import { rollDice } from '../utils/rollDice.ts';

import { Creature } from '../stores/types/creatures.ts';
import { Player } from '../stores/types/player';

interface Position {
    x: number;
    y: number;
}

interface EnemyTurnProps {
    creature: Creature | null;
    turn: string;
    player: Player
    playerActions: { setP_LeftHealth: (health: number) => void };
    setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
    switchTurn: () => void;
    playerPosition: Position;
    enemyPosition: Position;
    setEnemyPosition: React.Dispatch<React.SetStateAction<Position>>;
}

export const useEnemyTurn = ({
    creature,
    turn,
    player,
    playerActions,
    setActionMessages,
    switchTurn,
    playerPosition,
    enemyPosition,
    setEnemyPosition,

}: EnemyTurnProps) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (turn === "enemy" && creature && creature.health && creature.health > 0 && player.p_LeftHealth > 0) {
                const deltaX = playerPosition.x - enemyPosition.x;
                const deltaY = playerPosition.y - enemyPosition.y;

                const stepSize = 5;

                const newX =
                    Math.abs(deltaX) > stepSize
                        ? enemyPosition.x + (deltaX > 0 ? stepSize : -stepSize)
                        : enemyPosition.x;

                const newY =
                    Math.abs(deltaY) > stepSize
                        ? enemyPosition.y + (deltaY > 0 ? stepSize : -stepSize)
                        : enemyPosition.y;
                setEnemyPosition({x: newX, y: newY});
            }

            if (
                playerPosition &&
                
                creature &&
                turn === "enemy" &&
                creature.health &&
                creature.health > 0 &&
                player.p_LeftHealth > 0
            ) {
                const distanceX = Math.abs(playerPosition.x - enemyPosition.x);
                const distanceY = Math.abs(playerPosition.y - enemyPosition.y);

                if (distanceX < 10 && distanceY < 10) {
                    const enemyAttackTimeout = setTimeout(() => {
                        const totalAttack = rollDice('1d20') + creature["attacks"][0].bonus;
                        if (totalAttack > player.totalArmorClass()) {
                            const damageDice = creature["attacks"][0].damage;
                            const damage = rollDice(damageDice);

                            playerActions.setP_LeftHealth(Math.max(player.p_LeftHealth - damage, 0));

                            setActionMessages((prev) => [
                                ...prev,
                                `El enemigo te ha atacado con ${creature["attacks"][0].name} y causó ${damage} puntos de daño.`,
                            ]);
                        } else {
                            setActionMessages((prev) => [...prev, `¡El enemigo falló!`]);
                        }

                        switchTurn();
                    }, 1000);

                    return () => clearTimeout(enemyAttackTimeout);
                } else {
                    switchTurn();
                }
            } else if (creature && turn === "enemy" && creature.health && creature.health > 0 && player.p_LeftHealth > 0) {
                switchTurn();
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [turn]);
};
