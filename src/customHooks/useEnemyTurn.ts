import { useEffect } from 'react';
import { rollDice } from '../utils/rollDice.ts';
import { CreatureInterface } from '../components/interfaces/CreatureInterface.ts';

interface EnemyTurnProps {
    enemy: CreatureInterface | null; // Cambia 'any' por un tipo específico si tienes un interfaz para el enemigo
    turn: string; // Turno actual, por ejemplo: "enemy" o "player"
    enemyHealth: number;
    player: { p_LeftHealth: number, armorClass: number };
    playerActions: { setP_LeftHealth: (health: number) => void };
    setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
    switchTurn: () => void; // Función para cambiar el turno
    charPositions?: { x: number; y: number }[]; 
}

export const useEnemyTurn = ({
    enemy,
    turn,
    enemyHealth,
    player,
    playerActions,
    setActionMessages,
    switchTurn,
    charPositions,
}: EnemyTurnProps) => {
    useEffect(() => {

        if (
            charPositions &&
            charPositions.length >= 2 &&
            enemy &&
            turn === "enemy" &&
            enemyHealth > 0 &&
            player.p_LeftHealth > 0
        ) {
            const distanceX = Math.abs(charPositions[0].x - charPositions[1].x);
            const distanceY = Math.abs(charPositions[0].y - charPositions[1].y);

            if (distanceX < 10 && distanceY < 10) {
                const enemyAttackTimeout = setTimeout(() => {
                    const totalAttack = rollDice('1d20') + enemy["attacks"][0].bonus;
                    if (totalAttack > player.armorClass) {
                        const damageDice = enemy["attacks"][0].damage;
                        const damage = rollDice(damageDice);

                        // Reduce player health
                        playerActions.setP_LeftHealth(Math.max(player.p_LeftHealth - damage, 0));

                        // Add action message
                        setActionMessages((prev) => [
                            ...prev,
                            `El enemigo te ha atacado con ${enemy["attacks"][0].name} y causó ${damage} puntos de daño.`,
                        ]);

                        // Switch turn
                        switchTurn();
                    } else {
                        setActionMessages((prev) => [
                            ...prev,
                            `¡El enemigo falló!`,
                        ]);
                        switchTurn();
                    }
                }, 1000);

                return () => clearTimeout(enemyAttackTimeout);
            } else {
                // Switch turn if not in range
                switchTurn();
            }
        } else if (enemy && turn === "enemy" && enemyHealth > 0 && player.p_LeftHealth > 0) {
            // Switch turn if conditions are not met
            switchTurn();
        }
    }, [turn]);
};