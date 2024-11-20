// src/utils/combatHandlers.ts
import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';
// @ts-expect-error Para que funcione 
import {rollDice} from './rollDice.js'
import { Weapon } from '../components/interfaces/Weapon.js';
import {CreatureInterface} from '../components/interfaces/CreatureInterface.js'

interface CombatHandlersProps {
    playerHealthLeft: number;
    setPlayerHealthLeft: Dispatch<SetStateAction<number>>;
    enemyHealth: number;
    setEnemyHealth: Dispatch<SetStateAction<number>>
    enemyLevel: number;
    gainXP: (xp: number) => void;
    username: string;
    charActualWeapon: Weapon;
    enemy: CreatureInterface;
    setActionMessages: Dispatch<SetStateAction<string[]>>;
    navigate: NavigateFunction;
}

// Función para manejar el ataque del jugador
export const handleAttack = ({
    // playerHealthLeft,
    setPlayerHealthLeft,
    enemyHealth,
    setEnemyHealth,
    enemyLevel,
    gainXP,
    setActionMessages,
    charActualWeapon,
    enemy,
}: CombatHandlersProps) => {
    
    const playerDamage = rollDice(charActualWeapon.damage)
    
    const enemyDamage = rollDice(enemy.attacks[0].damage) + parseInt(enemy.attacks[0].bonus)

    const playerMessage = `Has atacado al enemigo y causado ${playerDamage} puntos de daño.`;
    const enemyMessage = `Te han atacado con ${enemy.attacks[0].name} y causado ${enemyDamage} puntos de daño.`;

    setActionMessages((prevMessages) => [...prevMessages, playerMessage, enemyMessage]);

    // Actualizar la vida del enemigo
    setEnemyHealth((prevEnemyHealth) => {
        const newEnemyHealth = Math.max(prevEnemyHealth - playerDamage, 0);
        if (newEnemyHealth <= 0) {
            gainXP(enemyLevel * 1000);
        }
        return newEnemyHealth;
    });

    if (enemyHealth > 0) {
        setPlayerHealthLeft((prev) => Math.max(prev - enemyDamage, 0));
    }
};

// Función para manejar el botón de "Huir"
export const handleRun = ({ username, navigate }: CombatHandlersProps) => {
    alert(`¡${username} ha huido del combate!`);
    navigate("/home");
};

// Función para manejar el botón de "Regresar"
export const handleBack = ({ username, navigate }: CombatHandlersProps) => {
    alert(`${username} regresa sano y salvo a su pueblo.`);
    navigate("/home");
};
