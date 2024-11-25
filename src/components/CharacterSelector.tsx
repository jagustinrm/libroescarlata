import './CharacterSelector.css'
// @ts-expect-error Calcular vida inicial 
import {calculateInitialHealth} from '../utils/calculateInitialHealth.js'
// @ts-expect-error Armas por clase
import {assignWeaponByClass} from '../utils/assignWeaponByClass.js'
// @ts-expect-error Inventario
import {createInitialInventory} from '../utils/inventoryUtils.js'

import { useNavigate } from 'react-router-dom';
import {usePlayerStore} from '../stores/playerStore.js';
import ClassLoader from '../loaders/ClassLoaders.js';
import WeaponLoader from '../loaders/WeaponLoader.js';
import useClassStore from '../stores/classStore';
import { Class } from '../stores/types/class.js';
import useInventoryStore from '../stores/inventoryStore';
export default function CharacterSelector() {
    // Accedemos al estado de clases desde el store
    const { classes, areClassesLoaded } = useClassStore();
    const { weapons } = WeaponLoader();
    const { player, addClasses, 
        setPlayerLevel, setPlayerExp, 
        setP_MaxHealth, setP_LeftHealth, 
        setP_ExpPrevLevel, setP_ExpToNextLevel,
        setP_SelectedWeapon
    } = usePlayerStore();
    const navigate = useNavigate();
    const {inventories} = useInventoryStore()
    const inventoryStore = useInventoryStore.getState()

    const handleButtonClick = (classData: Class) => {
        const { className, hitDie, armorClass, 
            baseAttackBonus, saves, classFeatures } = classData;
        
        addClasses(className);
        setPlayerLevel(1);
        setPlayerExp(0);
        setP_ExpPrevLevel(0);
        setP_ExpToNextLevel(1000);
        const InitialHealth = calculateInitialHealth(hitDie).toString();
        setP_MaxHealth(InitialHealth);
        setP_LeftHealth(InitialHealth);

        // createInitialInventory(); 
        inventoryStore.createInventory('player1_inventory');
        assignWeaponByClass(className, classes, 
            weapons, setP_SelectedWeapon, inventoryStore, inventories,
            player,
        );


        localStorage.setItem('dungeonLevel', '1');
        const additionalData = {
            hitDie,
            armorClass,
            baseAttackBonus,
            saves,
            classFeatures
        };

        localStorage.setItem('additionalData', JSON.stringify(additionalData));

        type enemyCounter = {
            id: number;
            name: string;
            count: number;
        };

        const deletedEnemies: enemyCounter[] = [];
        localStorage.setItem('deletedEnemies', JSON.stringify(deletedEnemies));

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
        <div className='containerClases'>
            <h1>Hola, {player.name ? player.name : 'invitade'}</h1>
            <p>Elige tu clase:</p>
            <div className='buttonsClasses'>
                <ClassLoader />
                {!areClassesLoaded ? 
                <p>Loading classes...</p>
                : (
                <>
                    {classes.map((classItem) => (
                        <button 
                            className='botonesClases'
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
