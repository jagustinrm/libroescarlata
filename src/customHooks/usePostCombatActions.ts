const usePostCombatActions = (setDungeonLevel: React.Dispatch<React.SetStateAction<number>>) => {
    const handlePostCombatActions = (fightType: string, enemyHealth: number, typeEnemy: string) => {
        if (enemyHealth <= 0 && fightType === "dungeon" && typeEnemy === "boss") {
            setDungeonLevel((prevLevel) => {
                const newLevel = prevLevel + 1;
                localStorage.setItem("dungeonLevel", newLevel.toString());
                return newLevel;
            });
        }
    };

    return { handlePostCombatActions };
};

export default usePostCombatActions;
