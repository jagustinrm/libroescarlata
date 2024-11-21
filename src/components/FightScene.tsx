import { useSearchParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FightScene.css";
// @ts-expect-error Para que funcione 
import { usePlayerStats } from '../customHooks/usePlayerStats.js';
// @ts-expect-error Para que funcione 
import { useEnemyLoader } from "../customHooks/useEnemyLoader.js";
// @ts-expect-error Para que funcione 
import {checkLevelUp} from '../utils/checkLevelUp.js'
// @ts-expect-error Para que funcione 
import {calculateInitialHealth} from '../utils/calculateInitialHealth.js'
import { handleAttack} from '../utils/combatHandlers';
import { Weapon } from "./interfaces/Weapon.js";

export default function FightScene() {
    const [searchParams] = useSearchParams();
    const fightType = searchParams.get("type") || "normal";

    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [classC, setClassC] = useState<string | null>('');
    const [actionMessages, setActionMessages] = useState<string[]>([]);  // Estado para el mensaje de acción
    const {prevLevelXp, playerHealth, setPlayerHealth, playerXp, 
        gainXP, playerLevel, setPlayerLevel, xpToNextLevel, 
        gainXpToNextLevel, playerHealthLeft, setPlayerHealthLeft, 
        hitDie } = usePlayerStats();
    const [charActualWeapon, setCharActualWeapon] = useState<Weapon | null>(null);

    const [pet, setPet] = useState<string | null>('')
    
    // const [playerMana, setPlayerMana] = useState<number>(100);


    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername ?? "");
        const storedclassC = localStorage.getItem('classC');
        setClassC(storedclassC);
        const pet = localStorage.getItem('pet')
        setPet(pet)
        const weapon = localStorage.getItem('charActualWeapon');
        setCharActualWeapon(weapon ? JSON.parse(weapon) : null);
        handleCheckLevelUp(); // Verificar subida de nivel
        localStorage.setItem('playerExp', playerXp.toString());
        localStorage.setItem('playerHealthLeft', playerHealthLeft.toString())

    }, [playerXp, playerHealthLeft]);
    
    const handleCheckLevelUp = () => {
        checkLevelUp({
            playerXp,
            playerLevel,
            xpToNextLevel,
            setPlayerLevel,
            gainXpToNextLevel,
            setActionMessages,
            hitDie,
            playerHealth,
            setPlayerHealth,
            calculateInitialHealth,
            playerHealthLeft,
            setPlayerHealthLeft
        });
    };

    // Estados para el enemigo

    const { enemy, isLoading, error, typeEnemy } = useEnemyLoader(playerLevel);
    console.log(typeEnemy)
    // Inicializamos los estados sin depender directamente de `enemy`
    const [enemyHealth, setEnemyHealth] = useState<number>(0);
    const [enemyLevel, setenemyLevel] = useState<number>(1);
    
    // Efecto para actualizar los estados cuando `enemy` esté disponible
    useEffect(() => {
        if (enemy) {
            setEnemyHealth(enemy.health);
            setenemyLevel(enemy.level);

        }
    }, [enemy]);

    if (isLoading) {
        return <p>Cargando enemigo...</p>;
    }
    
    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleRun = () => {
        alert(`¡${username} ha huido del combate!`);
        navigate("/home"); 
    };
    const handleBack = () => {
        alert(`${username} regresa sano y salvo a su pueblo.`);
        navigate("/home"); 
    };
    const handleNewEnemy = () => {
        alert(`${username} busca un nuevo enemigo...`);
        window.location.reload();
    }

    const xpPercentage = ((playerXp - prevLevelXp) / (xpToNextLevel - prevLevelXp)) * 100;
    const healthPercentage = (playerHealthLeft / playerHealth) * 100;
   
    return (
        <div className="fight-scene">
            <div className="PlayerChar">
                <p>{username}</p>
                <p>{classC}</p>
                <p>Nivel {playerLevel}</p>


            {/* Barra de vida */}
            <div className="health-bar-container">
                <div className="health-bar" style={{ width: `${healthPercentage}%` }}></div>
                <span className="health-text">{playerHealthLeft} / {playerHealth}</span>
            </div>
                
                {/* <p>Maná: {playerMana}/100</p> */}
                            {/* Barra de experiencia */}
            <div className="experience-bar-container">
                <div className="experience-bar" style={{ width: `${xpPercentage}%` }}></div>
                <span className="experience-text">{playerXp} / {xpToNextLevel}</span>
            </div>
                <button onClick={() =>
                    handleAttack({
                        username,
                        navigate,
                        playerHealthLeft,
                        setPlayerHealthLeft,
                        enemyHealth,
                        setEnemyHealth,
                        enemyLevel,
                        gainXP,
                        setActionMessages,
                        charActualWeapon,
                        enemy
                    })
                } disabled={enemyHealth === 0 || playerHealthLeft === 0}>
                    ⚔️ Atacar
                </button>
                {pet? <p>Mascota: {pet}</p> : <></>}

                {fightType === 'normal' || playerHealthLeft === 0 ?  <button onClick={handleRun}> 😨 Huir</button> : <></>}
            </div>

            <div >
                <ul className="action-log">
                    {actionMessages.map((message, index) => (
                        <li key={index}>{message}</li>  // Cada mensaje es un li
                    ))}
                </ul>
                {playerHealthLeft === 0 && <p>¡Has sido derrotado!</p>}
                {enemyHealth === 0 && 
                <div>
                    <p>¡Has derrotado al enemigo!</p>
                    <button onClick={handleNewEnemy}> ⚔️ Buscar otro enemigo</button>
                    {fightType === 'normal'?  <button onClick={handleBack}> 😨 Volver</button> : <></>}
                    

                </div>
                }
            </div>
            <div className="EnemyChar">
                {typeEnemy === 'boss'? <h1 className="bossSign">BOSS</h1> : <></>}
                {enemy ? (
                    <div>
                        <h3>{enemy.name}</h3>
                        <img className="imgEnemy" src={enemy.img} alt={enemy.name} />
                        <p>Nivel: {enemy.level}</p>
                        <p>Vida: {enemyHealth}</p>
                            
                        {/* <p>Maná: {currentEnemy.mana}</p> */}
                    </div>
                ) : (
                    <p>No hay enemigo seleccionado.</p>
                )}
            </div>
        </div>
    );
}

