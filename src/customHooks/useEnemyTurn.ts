import { useEffect } from 'react';
import { rollDice } from '../utils/rollDice.ts';
import { CreatureInterface } from '../components/interfaces/CreatureInterface.ts';

interface Position {
    x: number;
    y: number;
}

interface EnemyTurnProps {
    enemy: CreatureInterface | null;
    turn: string;
    enemyHealth: number;
    player: { p_LeftHealth: number, armorClass: number };
    playerActions: { setP_LeftHealth: (health: number) => void };
    setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
    switchTurn: () => void;
    playerPosition: Position;
    enemyPosition: Position;
    setEnemyPosition: React.Dispatch<React.SetStateAction<Position>>;
}

export const useEnemyTurn = ({
    enemy,
    turn,
    enemyHealth,
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
            if (turn === "enemy" && enemy && enemyHealth > 0 && player.p_LeftHealth > 0) {
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
                
                enemy &&
                turn === "enemy" &&
                enemyHealth > 0 &&
                player.p_LeftHealth > 0
            ) {
                const distanceX = Math.abs(playerPosition.x - enemyPosition.x);
                const distanceY = Math.abs(playerPosition.y - enemyPosition.y);

                if (distanceX < 10 && distanceY < 10) {
                    const enemyAttackTimeout = setTimeout(() => {
                        const totalAttack = rollDice('1d20') + enemy["attacks"][0].bonus;
                        if (totalAttack > player.armorClass) {
                            const damageDice = enemy["attacks"][0].damage;
                            const damage = rollDice(damageDice);

                            playerActions.setP_LeftHealth(Math.max(player.p_LeftHealth - damage, 0));

                            setActionMessages((prev) => [
                                ...prev,
                                `El enemigo te ha atacado con ${enemy["attacks"][0].name} y causó ${damage} puntos de daño.`,
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
            } else if (enemy && turn === "enemy" && enemyHealth > 0 && player.p_LeftHealth > 0) {
                switchTurn();
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [turn]);
};
