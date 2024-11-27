// src/utils/combatHandlers.ts
import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { rollDice } from './rollDice.ts';
import { CreatureInterface } from '../components/interfaces/CreatureInterface.js';
import { PlayerActions } from '../stores/types/player.js';
import { Player } from '../stores/types/player.js';
interface CombatHandlersProps {
    player: Player; 
    playerActions: PlayerActions;
    enemyHealth: number;
    setEnemyHealth: Dispatch<SetStateAction<number>>;
    enemy: CreatureInterface;
    fightType: string;
    typeEnemy: string;
    setActionMessages: Dispatch<SetStateAction<string[]>>;
    navigate: NavigateFunction;
}

// Función para actualizar la salud del enemigo
const updateEnemyHealth = (prevEnemyHealth: number, playerDamage: number): number => {
    return Math.max(prevEnemyHealth - playerDamage, 0);
};

// Función para manejar el ataque del jugador
export const handleAttack = ({setEnemyHealth, player, setActionMessages, enemy,    
}: CombatHandlersProps) => {
    const playerDamage = rollDice(player.selectedWeapon?.damage);
    const enemyDamage = rollDice(enemy.attacks[0].damage) + parseInt(enemy.attacks[0].bonus);

    const playerMessage = `Has atacado al enemigo y causado ${playerDamage} puntos de daño.`;
    const enemyMessage = `Te han atacado con ${enemy.attacks[0].name} y causado ${enemyDamage} puntos de daño.`;

    setActionMessages((prevMessages) => [...prevMessages, playerMessage, enemyMessage]);

    // Actualizar la vida del enemigo
    setEnemyHealth((prevEnemyHealth) => {
        const newEnemyHealth = updateEnemyHealth(prevEnemyHealth, playerDamage);

        return newEnemyHealth;
    });

    
};

export const handleNewEnemy = ( player: string) => {
    alert(`${player} busca un nuevo enemigo...`);
   
};