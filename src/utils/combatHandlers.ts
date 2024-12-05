import { Dispatch, SetStateAction } from 'react';
import { rollDice } from './rollDice.ts';
import { PlayerActions } from '../stores/types/player.js';
import { Player } from '../stores/types/player.js';
import { Spell } from '../stores/types/spells';
import { Creature } from '../stores/types/creatures.ts';
import useCreatureStore from '../stores/creatures.ts';  // Importamos el store de Zustand

interface CombatHandlersProps {
    player: Player;
    playerActions: PlayerActions;
    setActionMessages: Dispatch<SetStateAction<string[]>>;
    creature: Creature | null;
    spell?: string;
    spells?: Spell[];
    charPositions?: { x: number; y: number }[];
    selectedSpell?: string;
    playerPosition?: Position;
    enemyPosition?: Position;
    handleMessage: (message: string, type: string, shouldClose: boolean) => void;
    handlePostCombatActs: (fightType: string, creature: Creature) => void;
    fightType: string;
}

interface Position {
    x: number;
    y: number;
}

export const handleAttack = ({ setActionMessages, player, creature, handleMessage, handlePostCombatActs, fightType}: CombatHandlersProps) => {
    const playerAttack = rollDice('1d20') + player.baseAttackBonus;
    if (creature && playerAttack > creature.armorClass && creature.health ) {
        const playerDamage = rollDice(player.selectedWeapon?.damage) + player.statsIncrease['str'];
        const playerMessage = `Has atacado al enemigo y causado ${playerDamage} puntos de daño.`;
        setActionMessages((prevMessages) => [...prevMessages, playerMessage]);

        // Actualizamos la salud de la criatura en Zustand
        useCreatureStore.getState().setCreatureHealth(Math.max(creature.health - playerDamage, 0))
        if (creature.health - playerDamage < 0) {
            handleMessage("¡Has ganado el combate!", "success", false)
            handlePostCombatActs(fightType, creature);
    }     
    } else {
        const playerMessage = `¡Tu ataque falló!`;
        setActionMessages((prevMessages) => [...prevMessages, playerMessage]);
    }
};

export const handleSpell = ({
    setActionMessages,
    spells,
    enemyPosition,
    playerPosition,
    selectedSpell, creature, handleMessage,
    handlePostCombatActs, fightType
}: CombatHandlersProps) => {
    const spellFullDetails = spells?.find(s => s.name === selectedSpell);
    if (playerPosition && enemyPosition && creature && creature.health) {
        const distanceX = Math.abs(playerPosition.x - enemyPosition.x);
        const distanceY = Math.abs(playerPosition.y - enemyPosition.y);

        if (spellFullDetails && distanceX < spellFullDetails.range && distanceY < spellFullDetails.range && spellFullDetails.damage) {
            const playerDamage = rollDice(spellFullDetails.damage);
            const playerMessage = `Has lanzado ${spellFullDetails.name} al enemigo y causado ${playerDamage} puntos de daño.`;
            setActionMessages((prevMessages) => [...prevMessages, playerMessage]);
            useCreatureStore.getState().setCreatureHealth(Math.max(creature.health - playerDamage, 0))

            if (creature.health - playerDamage < 0) {
                handleMessage("¡Has ganado el combate!", "success", false)
                handlePostCombatActs(fightType, creature);
            }
        }
    }
};
