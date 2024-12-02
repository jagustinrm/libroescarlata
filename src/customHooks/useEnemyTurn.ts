import { useEffect } from 'react';
import { rollDice } from '../utils/rollDice.ts';

interface EnemyTurnProps {
    enemy: any; // Cambia 'any' por un tipo específico si tienes un interfaz para el enemigo
    turn: string; // Turno actual, por ejemplo: "enemy" o "player"
    enemyHealth: number;
    player: { p_LeftHealth: number };
    playerActions: { setP_LeftHealth: (health: number) => void };
    setActionMessages: React.Dispatch<React.SetStateAction<string[]>>;
    switchTurn: () => void; // Función para cambiar el turno
}

export const useEnemyTurn = ({
    enemy,
    turn,
    enemyHealth,
    player,
    playerActions,
    setActionMessages,
    switchTurn,
}: EnemyTurnProps) => {
    useEffect(() => {
        if (enemy && turn === "enemy" && enemyHealth > 0 && player.p_LeftHealth > 0) {
            const enemyAttackTimeout = setTimeout(() => {
                const damageDice = enemy["attacks"][0].damage;
                const damage = rollDice(damageDice);
                
                // Reducir salud del jugador
                playerActions.setP_LeftHealth(Math.max(player.p_LeftHealth - damage, 0));
                
                // Agregar mensaje de acción
                setActionMessages((prev) => [
                    ...prev,
                    `El enemigo te ha atacado con ${enemy["attacks"][0].name} y causó ${damage} puntos de daño.`,
                ]);
                
                // Cambiar el turno
                switchTurn();
            }, 1000);

            return () => clearTimeout(enemyAttackTimeout);
        }
    }, [enemy, turn, enemyHealth, player.p_LeftHealth, playerActions, setActionMessages, switchTurn]);
};
