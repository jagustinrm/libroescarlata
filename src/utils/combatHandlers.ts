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
export const handleAttack = ({
    enemyHealth,setEnemyHealth,
    playerActions, player,
    setActionMessages,
    enemy,

}: CombatHandlersProps) => {
    console.log(player.selectedWeapon)
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

    // Si el enemigo aún está vivo, actualizar la salud del jugador
    if (enemyHealth > 0) {
        playerActions.setP_LeftHealth(Math.max(player.p_LeftHealth - enemyDamage, 0));
    }
    
};


// Función para manejar el botón de "Huir"
export const handleRun = ({ player, navigate }: { player: { name: string }; navigate: NavigateFunction }) => {
    alert(`¡${player.name} ha huido del combate!`);
    navigate("/home");
};

// Función para manejar el botón de "Regresar"
export const handleBack = ({ player, navigate }: { player: { name: string }; navigate: NavigateFunction }) => {
    alert(`${player.name} regresa sano y salvo a su pueblo.`);
    navigate("/home");
};


export const handleNewEnemy = ( player: string) => {
    alert(`${player} busca un nuevo enemigo...`);
   
};