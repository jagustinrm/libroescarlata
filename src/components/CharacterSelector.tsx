import './CharacterSelector.css'
import './UI/designRpg.css'
// @ts-expect-error Calcular vida inicial 
import {calculateInitialHealth} from '../utils/calculateInitialHealth.js'
// @ts-expect-error Armas por clase
import {assignWeaponByClass} from '../utils/assignWeaponByClass.js'
import { useNavigate } from 'react-router-dom';
import {usePlayerStore} from '../stores/playerStore.js';
// import ClassLoader from '../loaders/ClassLoaders.js';
// import PotionsLoader from '../loaders/PotionsLoader.js';
// import WeaponLoader from '../loaders/NewWeaponLoader.js';
import useClassStore from '../stores/classStore';
import { Class } from '../stores/types/class.js';
import useInventoryStore from '../stores/inventoryStore';
import { useWeaponStore } from '../stores/weaponStore.js';
import useItemsStore from '../stores/itemsStore.js';
export default function CharacterSelector() {
    const {createItems} = useItemsStore();
    const navigate = useNavigate();
    const { classes, areClassesLoaded } = useClassStore();
    const {weapons} = useWeaponStore();
    const { player, playerActions} = usePlayerStore();
    const {inventories} = useInventoryStore()
    const inventoryStore = useInventoryStore.getState()
    const handleButtonClick = (classData: Class) => {
        const { className, hitDie, classFeatures, armorClass, baseAttackBonus, saves} = classData;
        playerActions.setPlayerClass(className);
        const InitialHealth = calculateInitialHealth(hitDie)
        playerActions.setPlayerLevel(1);
        playerActions.setP_MaxHealth(InitialHealth);
        playerActions.setP_LeftHealth(InitialHealth);
        playerActions.setPlayerExp(0)
        playerActions.setP_ExpToNextLevel(1000)
        playerActions.setP_ExpPrevLevel(0)
        playerActions.setPlayerMaterial(100)
        inventoryStore.createInventory('player1_inventory');
        playerActions.setClassFeature(classFeatures)
        playerActions.setArmorClass(armorClass)
        playerActions.setBaseAttackBonus(baseAttackBonus)
        playerActions.setHitDie(hitDie)
        playerActions.setSaves(saves)
        createItems(1)
        playerActions.setStats({
                str: 0,
                dex: 0,
                con: 0,
                int: 0,
                wis: 0,
                cha: 0,
        })
        playerActions.setStatsIncrease({
            str: 0,
            dex: 0,
            con: 0,
            int: 0,
            wis: 0,
            cha: 0,
        })
        playerActions.setStatsLeftPoints(25)
        assignWeaponByClass(className, classes, 
                weapons, playerActions.setP_SelectedWeapon, inventoryStore, inventories,
                player,
        );
        playerActions.setSpell(["Bola de fuego"])
        localStorage.setItem('dungeonLevel', '1');

        type typeCompletedMQuests = {
            id: number;
            name: string;
            progress: number;
            completed: boolean;
        };
        const completedQuests: typeCompletedMQuests[] = [];
        localStorage.setItem('completedQuests', JSON.stringify(completedQuests));
        navigate('/home');
    };

    return (
        <div className='containerClases  rpgui-container framed-golden-2'>
            {/* <WeaponLoader/>
            <PotionsLoader/>
            <ClassLoader /> */}
            <h1>Hola, {player.name ? player.name : 'invitade'}</h1>

            <p>Elige tu clase:</p>
            <div className='buttonsClasses'>

                {!areClassesLoaded ? 
                <p>Loading classes...</p>
                : (
                <>
                    {classes.map((classItem) => (
                        <button 
                            className='rpgui-button'
                            key={classItem.className}
                            onClick={() => handleButtonClick(classItem)}
                        >
                            {classItem.className}
                        </button>
                    ))}
                </>
                )}    
            </div>
        </div>
    );
}
