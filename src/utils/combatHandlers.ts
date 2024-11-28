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

export const handleAttack = ({setEnemyHealth, player, setActionMessages   }: CombatHandlersProps) => {
    const playerDamage = rollDice(player.selectedWeapon?.damage);
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

export const handleNewEnemy = ( player: string) => {
    alert(`${player} busca un nuevo enemigo...`);
   
};