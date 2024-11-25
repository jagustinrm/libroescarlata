import './CharacterSelector.css'

// @ts-expect-error Calcular vida inicial 
import {calculateInitialHealth} from '../utils/calculateInitialHealth.js'
// @ts-expect-error Armas por clase
import {assignIdWeaponByClass} from '../utils/assignWeaponByClass.js'
// @ts-expect-error Inventario
import {createInitialInventory} from '../utils/inventoryUtils.js'
import { useNavigate } from 'react-router-dom';
import {usePlayerStore} from '../stores/playerStore.js';
import ClassLoader from '../loaders/ClassLoaders.js';
import useClassStore from '../stores/classStore';

export default function CharacterSelector() {
      // Accedemos al estado de clases desde el store
    const { classes, areClassesLoaded } = useClassStore();
    const { player, addClasses, 
        setPlayerLevel, setPlayerExp, 
        setP_MaxHealth, setP_LeftHealth, 
        setP_ExpPrevLevel, setP_ExpToNextLevel
    } = usePlayerStore();
    const navigate = useNavigate();
  
    const handleButtonClick = (
        clase: string,
        hitDie: string,
        armorClass: string,
        baseAttackBonus: string,
        saves: { fortitude: string; reflex: string; will: string },
        classFeatures: string[]
    ) => {
        
        addClasses(clase);
        setPlayerLevel(1);
        setPlayerExp(0);

        //*********ACAAAAAAAAAAAAAAAAAAAAA */
        setP_ExpPrevLevel(0);
        setP_ExpToNextLevel(1000);
        localStorage.setItem('xpToNextLevel', '1000');
        localStorage.setItem('prevLevelXp', '0');
        //*********ACAAAAAAAAAAAAAAAAAAAAA */



        localStorage.setItem('dungeonLevel', '1') // NIVEL INICIAL DEL DUNGEON
        const additionalData = {
            hitDie,
            armorClass,
            baseAttackBonus,
            saves,
            classFeatures
        };
        const InitialHealth = calculateInitialHealth(hitDie).toString()
        setP_MaxHealth(InitialHealth)
        setP_LeftHealth(InitialHealth)


        localStorage.setItem('additionalData', JSON.stringify(additionalData));
        createInitialInventory()
        assignIdWeaponByClass(clase)
        type enemyCounter = {
            id: number;
            name: string;
            count: number;
        }
        const deletedEnemies: enemyCounter[] = [];
        localStorage.setItem('deletedEnemies', JSON.stringify(deletedEnemies))
        type typeCompletedMQuests = {
            id: number;
            name: string;
            progress: number;
            completed: boolean;
        }
        const completedQuests: typeCompletedMQuests[] = [];
        localStorage.setItem('completedQuests', JSON.stringify(completedQuests))



        navigate('/home');
    };

    return (
        <div className='containerClases'>
            <h1>Hola, {player.name? player.name : 'invitade'}</h1>
            <p>Elige tu clase:</p>
            <div className='buttonsClasses'>
                      {/* Llamamos a ClassLoader para cargar las clases */}
            <ClassLoader />
            {!areClassesLoaded ? 
            <p>Loading classes...</p>
            : (
            <>
              {classes.map((classItem) => (
                <button 
                className='botonesClases'
                key={classItem.className}
                onClick={() =>
                    handleButtonClick(
                        classItem.className,
                        classItem.hitDie,
                        classItem.armorClass,
                        classItem.baseAttackBonus,
                        classItem.saves,
                        classItem.classFeatures
                    )
                }>
                {classItem.className}
                </button>
              ))}
            </>
            )}    
            </div>
        </div>
    );
}
