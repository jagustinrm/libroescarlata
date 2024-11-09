import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FightScene.css";
// @ts-expect-error Para que funcione 
import { usePlayerStats } from '../customHooks/usePlayerStats.js';

export default function FightScene() {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>('');
    const [classC, setClassC] = useState<string | null>('');
    const [actionMessages, setActionMessages] = useState<string[]>([]);  // Estado para el mensaje de acción
    const {prevLevelXp, playerHealth, setPlayerHealth, playerXp, gainXP, playerLevel, setPlayerLevel, xpToNextLevel, gainXpToNextLevel } = usePlayerStats();
    const [playerMana, setPlayerMana] = useState<number>(100);

    // Estados para el enemigo
    const [enemyHealth, setEnemyHealth] = useState<number>(100);
    const [enemyLevel] = useState<number>(1);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
        const storedclassC = localStorage.getItem('classC');
        setClassC(storedclassC);
        checkLevelUp();
    }, [playerXp]);

    useEffect(() => {
        localStorage.setItem('playerExp', playerXp.toString());
    }, [playerXp]);

    // Función para verificar y manejar el aumento de nivel
    const checkLevelUp = () => {
        // Verificar si la experiencia actual es suficiente para subir de nivel
        if (playerXp >= xpToNextLevel) {
            const newLevel = playerLevel + 1;
            setPlayerLevel(newLevel);  // Subir el nivel
            gainXpToNextLevel(newLevel);  // Actualizar la experiencia necesaria para el próximo nivel
            setActionMessages((prevMessages) => [
                ...prevMessages,
                `¡Has subido al nivel ${newLevel}!`
            ]);
        }
    };

    // Función para manejar el ataque del jugador
    const handleAttack = () => {
        // Calcular daño del jugador y del enemigo
        const playerDamage = Math.floor(Math.random() * 20) + 10; // Daño entre 10 y 30
        const enemyDamage = Math.floor(Math.random() * 10) + 5;  // Daño entre 5 y 15
        const playerMessage = `Has atacado al enemigo y causado ${playerDamage} puntos de daño.`;
        const enemyMessage = `Te han atacado y causado ${enemyDamage} puntos de daño.`;
        setActionMessages((prevMessages) => [...prevMessages, playerMessage]);
        setActionMessages((prevMessages) => [...prevMessages, enemyMessage]);
        
        // Actualizar la vida del enemigo de manera funcional
        setEnemyHealth(prevEnemyHealth => {
            const newEnemyHealth = Math.max(prevEnemyHealth - playerDamage, 0);
            // Verificar si el enemigo ha sido derrotado
            if (newEnemyHealth <= 0) {
                gainXP(enemyLevel * 1000);  // Ganar experiencia tras derrotar al enemigo
            }
            return newEnemyHealth;
        });

        // Si el enemigo aún tiene vida, ataca de vuelta
        if (enemyHealth > 0) {
            setPlayerHealth(prev => Math.max(prev - enemyDamage, 0));
        }
    };

    // Función para manejar el botón de "Huir"
    const handleRun = () => {
        alert(`¡${username} ha huido del combate!`);
        navigate("/home"); // Redirige a la ruta "/home"
    };
    const handleBack = () => {
        alert(`${username} regresa sano y salvo a su pueblo.`);
        navigate("/home"); // Redirige a la ruta "/home"
    };

    const xpPercentage = ((playerXp - prevLevelXp) / (xpToNextLevel - prevLevelXp)) * 100;

    return (
        <div className="fight-scene">
            <div className="PlayerChar">
                <p>{username}</p>
                <p>{classC}</p>
                <p>Nivel {playerLevel}</p>
                                {/* Barra de experiencia */}
                <div className="experience-bar-container">
                    <div className="experience-bar" style={{ width: `${xpPercentage}%` }}></div>
                </div>
                <p>Experiencia: {playerXp} / {xpToNextLevel}</p>
                <p>Vida: {playerHealth}/100</p>
                <p>Maná: {playerMana}/100</p>
                <button onClick={handleAttack} disabled={enemyHealth === 0 || playerHealth === 0}>Atacar</button>
                <button onClick={handleRun}>Huir</button>
            </div>

            <div >
                <ul className="action-log">
                    {actionMessages.map((message, index) => (
                        <li key={index}>{message}</li>  // Cada mensaje es un li
                    ))}
                </ul>
                {playerHealth === 0 && <p>¡Has sido derrotado!</p>}
                {enemyHealth === 0 && 
                <div>
                    <p>¡Has derrotado al enemigo!</p>
                    <button onClick={handleBack}>Volver</button>
                </div>
                }
            </div>
            <div className="EnemyChar">
                <p>Goblin</p>
                <p>Guerrero</p>
                <p>Nivel {enemyLevel}</p>
                <p>Vida: {enemyHealth}/100</p>
                <p>Maná: 100/100</p>
            </div>
        </div>
    );
}
