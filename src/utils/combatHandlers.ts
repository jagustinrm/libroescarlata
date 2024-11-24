// src/utils/combatHandlers.ts
import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';
// @ts-expect-error Para que funcione
import { rollDice } from './rollDice.js';
import { Weapon } from '../components/interfaces/Weapon.js';
import { CreatureInterface } from '../components/interfaces/CreatureInterface.js';


interface CombatHandlersProps {
    player: { name: string }; 
    playerHealthLeft: number;
    setPlayerHealthLeft: Dispatch<SetStateAction<number>>;
    enemyHealth: number;
    setEnemyHealth: Dispatch<SetStateAction<number>>;
    enemyLevel: number;
    gainXP: (xp: number) => void;
    charActualWeapon: Weapon | null;
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

// Función para manejar la experiencia y el nivel del dungeon
const handlePostCombatActions = (
    enemyHealth: number, 
    enemyLevel: number, 
    gainXP: (xp: number) => void
): void => {
    if (enemyHealth <= 0) {
        // Ganar experiencia
        gainXP(enemyLevel * 1000);
        
    }
};

// Función para manejar el ataque del jugador
export const handleAttack = ({
    setPlayerHealthLeft,
    enemyHealth,
    setEnemyHealth,
    enemyLevel,
    gainXP,
    setActionMessages,
    charActualWeapon,
    enemy,
}: CombatHandlersProps) => {
    const playerDamage = rollDice(charActualWeapon?.damage);
    const enemyDamage = rollDice(enemy.attacks[0].damage) + parseInt(enemy.attacks[0].bonus);

    const playerMessage = `Has atacado al enemigo y causado ${playerDamage} puntos de daño.`;
    const enemyMessage = `Te han atacado con ${enemy.attacks[0].name} y causado ${enemyDamage} puntos de daño.`;

    setActionMessages((prevMessages) => [...prevMessages, playerMessage, enemyMessage]);

    // Actualizar la vida del enemigo
    setEnemyHealth((prevEnemyHealth) => {
        const newEnemyHealth = updateEnemyHealth(prevEnemyHealth, playerDamage);
     
        // Llamar a handlePostCombatActions para manejar XP y dungeon level si es necesario
        handlePostCombatActions(newEnemyHealth, enemyLevel, gainXP);

        return newEnemyHealth;
    });

    // Si el enemigo aún está vivo, actualizar la salud del jugador
    if (enemyHealth > 0) {
        setPlayerHealthLeft((prev) => Math.max(prev - enemyDamage, 0));
    }
};


// Función para manejar el botón de "Huir"
export const handleRun = ({ player, navigate }: { player: { name: string }; navigate: NavigateFunction }) => {
    console.log(player);
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