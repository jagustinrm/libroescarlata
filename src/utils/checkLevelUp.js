// src/utils/checkLevelUp.js

export function checkLevelUp({setPlayerHealthLeft, calculateInitialHealth, 
    playerHealth, setPlayerHealth, hitDie, playerXp, playerLevel, xpToNextLevel, 
    setPlayerLevel, gainXpToNextLevel, setActionMessages }) {
    // Verificar si la experiencia actual es suficiente para subir de nivel
    if (playerXp >= xpToNextLevel) {
        const newLevel = playerLevel + 1;
        const newPlayerHealth = playerHealth +  Math.floor(Math.random() * calculateInitialHealth(hitDie))
        setPlayerHealthLeft(newPlayerHealth)
        setPlayerHealth(newPlayerHealth)
        setPlayerLevel(newLevel);  // Subir el nivel
        gainXpToNextLevel(newLevel);  // Actualizar la experiencia necesaria para el próximo nivel
        setActionMessages((prevMessages) => [
            ...prevMessages,
            `¡Has subido al nivel ${newLevel}!`
        ]);
    }



    return playerLevel;
}

