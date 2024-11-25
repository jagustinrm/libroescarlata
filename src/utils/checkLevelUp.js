
export function checkLevelUp({calculateInitialHealth, hitDie, player, xpToNextLevel, 
    //  gainXpToNextLevel, 
     setActionMessages, setPlayerLevel, setP_MaxHealth, setP_LeftHealth, 
     setP_ExpToNextLevel, setP_ExpPrevLevel,
     expTable,
    }) {
    // Verificar si la experiencia actual es suficiente para subir de nivel
    const gainXpToNextLevel = (level) => {
        const levelSum = level + 1
        const nextLevelXp = expTable[levelSum.toString()] || expTable[20]; // Evitar que supere el nivel 20
        const prevLevelXp = level > 1 && expTable[level.toString()] || expTable[20]; 
        setP_ExpToNextLevel(nextLevelXp);
        setP_ExpPrevLevel(prevLevelXp)
    };

    
    if (player.playerExp >= player.p_ExpToNextLevel) {
        const newLevel = player.level + 1;
        const newPlayerHealth = parseInt(player.p_MaxHealth) +  Math.floor(Math.random() * calculateInitialHealth(hitDie))
        setP_LeftHealth(newPlayerHealth)
        setP_MaxHealth(newPlayerHealth)
        setPlayerLevel(newLevel);  // Subir el nivel
        gainXpToNextLevel(newLevel);  // Actualizar la experiencia necesaria para el próximo nivel
        setActionMessages((prevMessages) => [
            ...prevMessages,
            `¡Has subido al nivel ${newLevel}`
        ]);
    }




    return player.level;
}


