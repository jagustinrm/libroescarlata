// src/utils/combatHandlers.ts
import { Dispatch, SetStateAction } from 'react';
import { rollDice } from './rollDice.ts';
import { PlayerActions } from '../stores/types/player.js';
import { Player } from '../stores/types/player.js';
import { CreatureInterface } from '../components/interfaces/CreatureInterface.ts';
import { Spell } from '../stores/types/spells';
interface CombatHandlersProps {
    player: Player; 
    playerActions: PlayerActions;
    enemyHealth: number;
    setEnemyHealth: Dispatch<SetStateAction<number>>;
    fightType: string;
    setActionMessages: Dispatch<SetStateAction<string[]>>;
    enemy: CreatureInterface | null;
    spell?: string;
    spells?: Spell[]
    charPositions?: { x: number; y: number }[]; 
    selectedSpell?: string;
}

export const handleAttack = ({setEnemyHealth, player, setActionMessages, enemy  }: CombatHandlersProps) => {
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

export const handleSpell = ({setEnemyHealth, setActionMessages, spells, charPositions, selectedSpell   }: CombatHandlersProps) => {
    const spellFullDetails = spells?.find(s => s.name === selectedSpell)
    
    const distanceX = Math.abs(charPositions[0].x - charPositions[1].x);
    const distanceY = Math.abs(charPositions[0].y - charPositions[1].y);


    if (spellFullDetails && distanceX < spellFullDetails.range && distanceY < spellFullDetails.range && spellFullDetails.damage ) {
        const playerDamage = rollDice(spellFullDetails.damage)
        const playerMessage = `Has lanzado ${spellFullDetails.name} al enemigo y causado ${playerDamage} puntos de daño.`;
        setActionMessages((prevMessages) => [...prevMessages, playerMessage]);
        setEnemyHealth((prevEnemyHealth) => {
            const newEnemyHealth = updateEnemyHealth(prevEnemyHealth, playerDamage);
            return newEnemyHealth;
        });
    
        const updateEnemyHealth = (prevEnemyHealth: number, playerDamage: number): number => {
            return Math.max(prevEnemyHealth - playerDamage, 0);
        };
    }

    

};