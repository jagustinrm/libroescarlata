import { CreatureInterface } from '../components/interfaces/CreatureInterface.js';
// import { EnemyDeleted } from '../components/interfaces/characterProperties.js';
import {QuestData} from '../components/interfaces/QuestsInt.js';
// @ts-expect-error Para que funcione 
import checkQuests from '../utils/checkQuests.js'
// @ts-expect-error Para que funcione 
import gainExp from '../utils/gainExp.js'
import { Player, PlayerActions } from '../stores/types/player.js';

const usePostCombatActions = (
    setDungeonLevel: React.Dispatch<React.SetStateAction<number>>, 
    enemy: CreatureInterface | null,
    quests: QuestData, 
    playerActions: PlayerActions,
    player: Player

) => {
    const handlePostCombatActs = (
        fightType: string, 
        enemyHealth: number, 
        typeEnemy: string,
    ) => {
        // Si el enemigo es derrotado
        if ( enemy && enemyHealth <= 0) {
            
            //***** */ Incrementar el nivel de mazmorra si es un jefe*******
            if (fightType === "dungeon" && typeEnemy === "boss") {
                setDungeonLevel((prevLevel) => {
                    const newLevel = prevLevel + 1;
                    localStorage.setItem("dungeonLevel", newLevel.toString());
                    return newLevel;
                });
            }
            gainExp(enemy.level, playerActions.setPlayerExp, player.playerExp);
            playerActions.setPlayerMaterial(player.playerMaterial + enemy.level * 100)

            //****** */ Actualizar lista de enemigos derrotados ********

            const existingEnemyIndex = player.enemiesDeleted.findIndex((e) => e.name === enemy.name);

            if (existingEnemyIndex !== -1) {

                const updatedEnemies = [...player.enemiesDeleted];
                updatedEnemies[existingEnemyIndex].count += 1;
                playerActions.setEnemiesDeleted(updatedEnemies);
                
                // *******Corroborar si terminó la misión****
                
            } else {
                // Si el enemigo no existe, agregarlo a la lista
                playerActions.setEnemiesDeleted([...player.enemiesDeleted, { name: enemy.name, count: 1 }]);    
                // checkQuests(quests)
            }
            checkQuests(quests, player.enemiesDeleted)

        }
    };
    return { handlePostCombatActs };
};

export default usePostCombatActions;
