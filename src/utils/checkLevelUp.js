
export function checkLevelUp({calculateInitialHealth, hitDie, player, 
     setActionMessages, playerActions,
     expTable,
    }) {
    // Verificar si la experiencia actual es suficiente para subir de nivel
    const gainXpToNextLevel = (level) => {
        const levelSum = level + 1
        const nextLevelXp = expTable[levelSum.toString()] || expTable[20]; // Evitar que supere el nivel 20
        const prevLevelXp = level > 1 && expTable[level.toString()] || expTable[20]; 
        playerActions.setP_ExpToNextLevel(nextLevelXp);
        playerActions.setP_ExpPrevLevel(prevLevelXp)
    };

    
    if (player.playerExp >= player.p_ExpToNextLevel) {
        const newLevel = player.level + 1;
        const newPlayerHealth = parseInt(player.p_MaxHealth) +  Math.floor(Math.random() * calculateInitialHealth(hitDie))
        playerActions.setP_LeftHealth(newPlayerHealth)
        playerActions.setP_MaxHealth(newPlayerHealth)
        playerActions.setPlayerLevel(newLevel);  // Subir el nivel
        gainXpToNextLevel(newLevel);  // Actualizar la experiencia necesaria para el próximo nivel
        setActionMessages((prevMessages) => [
            ...prevMessages,
            `¡Has subido al nivel ${newLevel}`
        ]);
    }




    return player.level;
}


