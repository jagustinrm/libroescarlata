// src/utils/combatHandlers.ts
import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';
// @ts-expect-error Para que funcione
import { rollDice } from './rollDice.js';
import { Weapon } from '../components/interfaces/Weapon.js';
import { CreatureInterface } from '../components/interfaces/CreatureInterface.js';
// @ts-expect-error Para que funcione 
import gainExp from './gainExp.js'


interface CombatHandlersProps {
    player: { 
        name: string
        playerExp: number;
        level: number;
        p_LeftHealth: number;
    }; 

    setPlayerExp: (playerExp: number) => void
    setP_LeftHealth: (p_LeftHealth: number) => void, 
    setP_MaxHealth: (p_MaxHealth: number) => void,
    enemyHealth: number;
    setEnemyHealth: Dispatch<SetStateAction<number>>;
    enemyLevel: number;
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

// Función para manejar el ataque del jugador
export const handleAttack = ({
    enemyHealth,
    setEnemyHealth,
    enemyLevel,
    setPlayerExp,
    setActionMessages,
    charActualWeapon,
    enemy,
    player,
    setP_LeftHealth
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
        //ESTA FUNCIÓN ESTÁ ABAJO
        handlePostCombatActions(newEnemyHealth, enemyLevel, setPlayerExp, player.playerExp)

        return newEnemyHealth;
    });

    // Si el enemigo aún está vivo, actualizar la salud del jugador
    if (enemyHealth > 0) {
        setP_LeftHealth(Math.max(player.p_LeftHealth - enemyDamage, 0));
    }
    
};

// Función para manejar la experiencia y el nivel del dungeon
const handlePostCombatActions = (
    enemyHealth: number, 
    enemyLevel: number, 
    setPlayerExp: (playerExp: number) => void,
    playerExp: number,
): void => {
    if (enemyHealth <= 0) {
        // Ganar experiencia llamando a gainExp
        gainExp(enemyLevel, setPlayerExp, playerExp);
    }

};

// ***** YA ESTÁ ESTE CODIGO *********************

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