import { CreatureInterface } from '../components/interfaces/CreatureInterface.js';
import { EnemyDeleted } from '../components/interfaces/characterProperties.js';

const usePostCombatActions = (
    setDungeonLevel: React.Dispatch<React.SetStateAction<number>>, 
    setEnemiesDeleted: React.Dispatch<React.SetStateAction<Array<EnemyDeleted>>>,
    enemiesDeleted: Array<EnemyDeleted>,
    enemy: CreatureInterface
) => {
    const handlePostCombatActions = (
        fightType: string, 
        enemyHealth: number, 
        typeEnemy: string,
    ) => {
        // Si el enemigo es derrotado
        if (enemyHealth <= 0) {
            // Incrementar el nivel de mazmorra si es un jefe
            if (fightType === "dungeon" && typeEnemy === "boss") {
                setDungeonLevel((prevLevel) => {
                    const newLevel = prevLevel + 1;
                    localStorage.setItem("dungeonLevel", newLevel.toString());
                    return newLevel;
                });
            }

            // Encontrar si el enemigo ya está en la lista
            console.log( enemy)
            const existingEnemyIndex = enemiesDeleted.findIndex((e) => e.name === enemy.name);

            if (existingEnemyIndex !== -1) {

                // Si el enemigo ya existe, incrementar el contador
                const updatedEnemies = [...enemiesDeleted];
                updatedEnemies[existingEnemyIndex].count += 1;
                setEnemiesDeleted(updatedEnemies);
                localStorage.setItem('deletedEnemies', JSON.stringify(updatedEnemies))
            } else {

                // Si el enemigo no existe, agregarlo a la lista
                setEnemiesDeleted((prevEnemies) => {
                    const updatedEnemies = [
                        ...prevEnemies,
                        {
                            name: enemy.name,
                            count: 1,
                        },
                    ];

                    localStorage.setItem('deletedEnemies', JSON.stringify(updatedEnemies))
                    return updatedEnemies;
                });

            }
        }
    };

    return { handlePostCombatActions };
};

export default usePostCombatActions;
