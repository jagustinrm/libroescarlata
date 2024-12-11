import React, { useState } from 'react';
import './CharacterSelector.css';
import './UI/designRpg.css';
// @ts-expect-error Calcular vida inicial 
import { calculateInitialHealth } from '../utils/calculateInitialHealth.js';
// @ts-expect-error Armas por clase
import { assignWeaponByClass } from '../utils/assignWeaponByClass.js';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../stores/playerStore.js';
import useClassStore from '../stores/classStore';
import { Class } from '../stores/types/class.js';
import useInventoryStore from '../stores/inventoryStore';
import { useWeaponStore } from '../stores/weaponStore.js';
import useItemsStore from '../stores/itemsStore.js';
import ButtonEdited from './UI/ButtonEdited.js';
export default function CharacterSelector() {
    const { createItems } = useItemsStore();
    const navigate = useNavigate();
    const { classes, areClassesLoaded } = useClassStore();
    const { weapons } = useWeaponStore();
    const { player, playerActions } = usePlayerStore();
    const inventoryStore = useInventoryStore.getState();

    // Estado para la clase en hover
    const [hoveredClass, setHoveredClass] = useState<Class | null>(null);

    const handleButtonClick = (classData: Class) => {
        const { className, hitDie, classFeatures, armorClass, baseAttackBonus, saves, img, manaDie, faceImg} = classData;
        playerActions.setPlayerClass(className);
        console.log(manaDie)
        const InitialHealth = calculateInitialHealth(hitDie);
        const InitialMana = calculateInitialHealth(manaDie)
        playerActions.setPlayerLevel(1);
        playerActions.setP_MaxHealth(InitialHealth);
        playerActions.setP_LeftHealth(InitialHealth);
        playerActions.setP_MaxMana(InitialMana);
        playerActions.setP_LeftMana(InitialMana);
        playerActions.setPlayerExp(0);
        playerActions.setP_ExpToNextLevel(1000);
        playerActions.setP_ExpPrevLevel(0);
        playerActions.setPlayerMaterial(100);
        //****************** INVENTNARIO */
        playerActions.setInventory(`${player.name}_inventory`);
        inventoryStore.createInventory(`${player.name}_inventory`);
        //****************** INVENTNARIO */
        playerActions.setClassFeature(classFeatures);
        playerActions.setClassImg(img)
        playerActions.setAvatarImg(faceImg)
        playerActions.setArmorClass(armorClass);
        playerActions.setBaseAttackBonus(baseAttackBonus);
        playerActions.setHitDie(hitDie);
        playerActions.setManaDie(manaDie);

        playerActions.setSaves(saves);
        createItems(1);
        playerActions.setStats({
            str: 0,
            dex: 0,
            con: 0,
            int: 0,
            wis: 0,
            cha: 0,
        });
        playerActions.setStatsIncrease({
            str: 0,
            dex: 0,
            con: 0,
            int: 0,
            wis: 0,
            cha: 0,
        });
        playerActions.setStatsLeftPoints(25);
        assignWeaponByClass({
            className,
            classes,
            weapons,
            playerActions,
            inventoryStore,
            player,
        });

            playerActions.setSpell(classData.initialSpells);


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
        <div className='containerClassSelector'>
            <div className='containerClases rpgui-container framed-golden-2'>
                <h1>Hola, {player.name ? player.name : 'invitade'}</h1>
                <p>¿Cuál es tu clase?</p>
                <div className='buttonsClasses'>
                    {!areClassesLoaded ? (
                        <p>Cargando clases...</p>
                    ) : (
                        <>
                            {classes.map((classItem) => (
                                <ButtonEdited
                                label= {classItem.className}
                                width='200px'
                                onMouseEnter={() => setHoveredClass(classItem)}
                                onMouseLeave={() => setHoveredClass(null)}
                                onClick={() => handleButtonClick(classItem)} 
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className='classDetailsContainer rpgui-container framed'>
            {hoveredClass && (
                        <div>
                        <h2 className='className'>{hoveredClass.className}</h2>
                        <img
                            src={hoveredClass.faceImg}
                            alt={hoveredClass.className}
                            className='classImage'
                        />
                        <img
                            src={hoveredClass.img}
                            alt={hoveredClass.className}
                            className='classImage'
                        />
                        <div className='rpgui-container framed-grey'>
                            <p>
                                 {hoveredClass.description}
                            </p>
                        </div>
                        <p>
                            <strong>Características:</strong>{' '}
                            {hoveredClass.classFeatures.join(', ')}
                        </p>
                        <div className='characterCaracteristics'>
                            <div>
                            <p>
                                <strong className='redFont'>Vida:</strong> {hoveredClass.hitDie}
                            </p>
                            <p>
                                <strong className='blueFont'>Espíritu:</strong> {hoveredClass.manaDie}
                            </p>
                            </div>
                            <div>
                            <p>
                                <strong>Ataque:</strong>{' '}
                                {hoveredClass.baseAttackBonus}
                            </p>
                            <p>
                                <strong>Armadura:</strong>{' '}
                                {hoveredClass.armorClass}
                            </p>
                            </div>
                        </div>
                        </div>
                )}
                </div>
        </div>
    );

}
