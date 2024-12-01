
export function checkLevelUp({calculateInitialHealth, player, 
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
        playerActions.addStatsLeftPoints(5)
    };

    
    if (player.playerExp >= player.p_ExpToNextLevel && player.level < 20) {
        const newLevel = player.level + 1;

        const newPlayerHealth = parseInt(player.p_MaxHealth) +  Math.floor(Math.random() * calculateInitialHealth(player.hitDie) + player.statsIncrease['con'])
        playerActions.setP_LeftHealth(newPlayerHealth)
        playerActions.setP_MaxHealth(newPlayerHealth)
        playerActions.setPlayerLevel(newLevel);  // Subir el nivel
        gainXpToNextLevel(newLevel);  // Actualizar la experiencia necesaria para el próximo nivel
        setActionMessages((prevMessages) => [
            ...prevMessages,
            `¡Has subido al nivel ${newLevel}, ¡Tu nivel de vida aumentó a ${newPlayerHealth}`
        ]);
    }




    return player.level;
}


