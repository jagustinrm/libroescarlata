import { useEffect, useState } from 'react';
import './CharacterSelector.css';
import './UI/designRpg.css';
import { assignWeaponByClass } from '../utils/assignWeaponByClass.ts';
import { assignArmorByClass } from '../utils/assignArmorByClass.js';
import { useNavigate } from 'react-router-dom';
import { Class } from '../stores/types/class.js';
import useInventoryStore from '../stores/inventoryStore';
import useItemsStore from '../stores/itemsStore.js';
import useGlobalState from '../customHooks/useGlobalState.ts';
import {useInstantSavePlayerState } from '../firebase/savePlayerStateToFirebase .tsx';
export default function CharacterSelector() {
  const { createItems } = useItemsStore();
  const navigate = useNavigate();
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const { classes, areClassesLoaded, armors, weapons, player, playerActions } =
    useGlobalState();
  const savePlayerState = useInstantSavePlayerState();
  const inventoryStore = useInventoryStore.getState();
  const [hoveredClass, setHoveredClass] = useState<Class | null>(null);
  const handleButtonClick = (classData: Class) => {
    const {
      className,
      hitDie,
      classFeatures,
      baseAttackBonus,
      img,
      manaDie,
      faceImg,
      dodgeDie,
      hitRateDie,
    } = classData;

    playerActions.setPlayerClass(className);
    playerActions.setP_MaxHealth(hitDie);
    playerActions.setP_LeftHealth(hitDie);
    playerActions.setP_MaxMana(manaDie);
    playerActions.setP_LeftMana(manaDie);
    playerActions.setDodge(dodgeDie);
    playerActions.setHitRate(hitRateDie);
    playerActions.setDodgeDie(dodgeDie);
    playerActions.setHitRateDie(hitRateDie);
    //****************** INVENTNARIO */
    playerActions.setInventory(`${player.name}_inventory`);
    inventoryStore.createInventory(`${player.name}_inventory`);
    inventoryStore.clearInventory(`${player.name}_inventory`);
    //****************** INVENTNARIO */
    playerActions.setClassFeature(classFeatures);
    playerActions.setClassImg(img);
    playerActions.setAvatarImg(faceImg);
    playerActions.setBaseAttackBonus(baseAttackBonus);
    playerActions.setHitDie(hitDie);
    playerActions.setManaDie(manaDie);
    createItems(1);
    assignWeaponByClass({
      className,
      classes,
      weapons,
      playerActions,
      inventoryStore,
      player,
    });
    assignArmorByClass({
      className,
      classes,
      armors,
      playerActions,
      inventoryStore,
      player,
    });
    playerActions.setSpell(classData.initialSpells);
    setIsPlayerReady(true);
    // type typeCompletedMQuests = {
    //   id: number;
    //   name: string;
    //   progress: number;
    //   completed: boolean;
    // };
    // const completedQuests: typeCompletedMQuests[] = [];
    // localStorage.setItem('completedQuests', JSON.stringify(completedQuests));

  };
  useEffect(() => {
    if (isPlayerReady) {
      savePlayerState(); 
      navigate('/home'); 
    }
  }, [isPlayerReady]);
  return (
    <div className="containerClassSelector">
      <div className="containerClases rpgui-container framed-golden-2">
        <div className="nameHeader">
          <h1 className="nameHeader">
            Hola, {player.name ? player.name : 'invitade'}
          </h1>
          <p>¿Cuál es tu clase?</p>
        </div>
        <div className="buttonsClasses">
          {!areClassesLoaded ? (
            <p>Cargando clases...</p>
          ) : (
            <>
              {classes.map((classItem) => (
                <img
                  className="classIcons  rpgui-cursor-point"
                  src={classItem.iconImg}
                  alt={classItem.className}
                  onMouseEnter={() => setHoveredClass(classItem)}
                  onMouseLeave={() => setHoveredClass(null)}
                  onClick={() => handleButtonClick(classItem)}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <div className="classDetailsContainer rpgui-container framed">
        {hoveredClass && (
          <div>
            <h2 className="className">{hoveredClass.className}</h2>
            <img
              src={hoveredClass.faceImg}
              alt={hoveredClass.className}
              className="classImage"
            />
            <img
              src={hoveredClass.img}
              alt={hoveredClass.className}
              className="classImage"
            />
            <div className="rpgui-container framed-grey">
              <p>{hoveredClass.description}</p>
            </div>
            <p>
              <strong>Características:</strong>{' '}
              {hoveredClass.classFeatures.join(', ')}
            </p>
            <div className="characterCaracteristics">
              <div>
                <p>
                  <strong className="redFont">Vida:</strong>{' '}
                  {hoveredClass.hitDie}
                </p>
                <p>
                  <strong className="blueFont">Espíritu:</strong>{' '}
                  {hoveredClass.manaDie}
                </p>
              </div>
              <div>
                <p>
                  <strong>Ataque:</strong> {hoveredClass.baseAttackBonus}
                </p>
                <p>
                  <strong>Armadura:</strong> {hoveredClass.armorClass}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
