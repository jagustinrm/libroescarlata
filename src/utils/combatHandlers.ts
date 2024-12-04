// src/utils/combatHandlers.ts
import { Dispatch, SetStateAction } from 'react';
import { rollDice } from './rollDice.ts';
import { PlayerActions } from '../stores/types/player.js';
import { Player } from '../stores/types/player.js';
import { CreatureInterface } from '../components/interfaces/CreatureInterface.ts';
interface CombatHandlersProps {
    player: Player; 
    playerActions: PlayerActions;
    enemyHealth: number;
    setEnemyHealth: Dispatch<SetStateAction<number>>;
    fightType: string;
    setActionMessages: Dispatch<SetStateAction<string[]>>;
    enemy: CreatureInterface | null
}

export const handleAttack = ({setEnemyHealth, player, setActionMessages, enemy   }: CombatHandlersProps) => {
    const playerAttack = rollDice('1d20') + player.baseAttackBonus
    if (enemy && playerAttack > enemy.armorClass) {
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
    } else {
        const playerMessage = `¡Tu ataque falló!`;
        setActionMessages((prevMessages) => [...prevMessages, playerMessage]);
    }
};
