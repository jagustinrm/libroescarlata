// src/utils/combatHandlers.ts
import { Dispatch, SetStateAction } from 'react';
import { rollDice } from './rollDice.ts';
import { PlayerActions } from '../stores/types/player.js';
import { Player } from '../stores/types/player.js';
interface CombatHandlersProps {
    player: Player; 
    playerActions: PlayerActions;
    enemyHealth: number;
    setEnemyHealth: Dispatch<SetStateAction<number>>;
    fightType: string;
    setActionMessages: Dispatch<SetStateAction<string[]>>;
  
}

export const handleAttack = ({setEnemyHealth, player, setActionMessages   }: CombatHandlersProps) => {
    const playerDamage = rollDice(player.selectedWeapon?.damage) + player.statsIncrease['str'];
    const playerMessage = `Has atacado al enemigo y causado ${playerDamage} puntos de daño.`;
    setActionMessages((prevMessages) => [...prevMessages, playerMessage]);

    setEnemyHealth((prevEnemyHealth) => {
        const newEnemyHealth = updateEnemyHealth(prevEnemyHealth, playerDamage);
        return newEnemyHealth;
    });

    const updateEnemyHealth = (prevEnemyHealth: number, playerDamage: number): number => {
        return Math.max(prevEnemyHealth - playerDamage, 0);
    };
    
};
