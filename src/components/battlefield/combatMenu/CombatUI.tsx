import React, { useState } from 'react';
import Dropdown from '../../../utils/DropDown';
import AttackAndPotions from './AttackAndPotions';
import { Weapon } from '../../../stores/types/weapons';
import { Spell } from '../../../stores/types/spells';
import { Item, Items } from '../../../stores/types/items';
import { handlePotion } from '../../../utils/handlePotion';
import ListCombatItems from './listCombatItems';
import useGlobalState from '../../../customHooks/useGlobalState';
import { executeAction } from '../../FightScene/executeAction';

interface CombatUIProps {
  opcionesArmas: Weapon[];
  opcionesSpells: Spell[];
  setActivateImage: React.Dispatch<React.SetStateAction<boolean>>;
  handleMessage: (message: string, type: string, dismissible: boolean) => void;
  pocion: string | undefined;

}

const CombatUI: React.FC<CombatUIProps> = ({
  opcionesArmas,
  opcionesSpells,
  setActivateImage,
  // executeAction,
  handleMessage,
  pocion,
}) => {

  const [selectedType, setSelectedType] = useState<keyof Items>();
  const {fightType, player, playerActions, creature, currentCharacter} = useGlobalState();
  const executeActionWithProps = (type: 'attack' | 'spell' | 'scroll', item?: Item) => {
    const res = executeAction(type, setActivateImage, handleMessage, item)
    return res;
  };

  const executeItem = (item: Item): boolean => {
    if (selectedType === 'scrolls') {
      const res = executeActionWithProps('scroll', item);
      if (!res) return false;
      return res;
    } else if (selectedType === 'potions') {
      return handlePotion({ item, handleMessage });
    }
    return false;
  };
  return (
    <div>
      <div className="rpgui-container framed attacks fixedUI">
        {/* Dropdown para armas */}
        <div>
          <Dropdown
            id="weapon-dropdown"
            options={opcionesArmas || []}
            value={player.bodyParts.manoDerecha}
            onChange={(value) => playerActions.setP_SelectedBodyPart(value)}
            disabled={
              (currentCharacter && currentCharacter.id !== 'player') ||
              creature.p_LeftHealth === 0
            }
          />
        </div>
        {/* Ataques y pociones */}
        <AttackAndPotions
          executeAction={executeActionWithProps}
          pocion={pocion}
        />

        {/* Dropdown y botón para hechizos */}
        <div className="rpgui-container rpgui-draggable">
          <div>
            <Dropdown
              id="spell-dropdown"
              options={opcionesSpells || []}
              value={player.selectedSpell}
              onChange={(value) => playerActions.setP_SelectedSpell(value)}
              disabled={
                (currentCharacter && currentCharacter.id !== 'player') ||
                creature.p_LeftHealth === 0
              }
            />
          </div>
          <button
            onClick={ () => executeActionWithProps('spell')}
            disabled={
              (currentCharacter && currentCharacter.id !== 'player') ||
              !player.selectedSpell ||
              creature.p_LeftHealth === 0 ||
              player.p_LeftHealth <= 0
            }
          >
            Lanzar hechizo
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <img
            onClick={() => setSelectedType('scrolls')}
            className="inventoryIcons rpgui-cursor-point"
            src="/img/icons/itemsIcons/scrollicon.png"
            alt=""
          />
          <img
            onClick={() => setSelectedType('potions')}
            className="inventoryIcons rpgui-cursor-point"
            src="/img/icons/itemsIcons/potionicon.png"
            alt=""
          />
        </div>
        {/* Botón para huir */}
        {fightType === 'normal' || player.p_LeftHealth === 0 ? (
          <button
            onClick={() =>
              handleMessage('¡Has huido del combate!', 'warning', true)
            }
            className="rpgui-button newDesign huir"
          >
            😨 Huir
          </button>
        ) : null}
      </div>
      <div className="rpgui-container framed listCombatItems">
        {Object.entries(player.buffs).map(([key, val]) => (
          <div key={key}>
            <img
              style={{ width: '30px' }}
              src={
                key === 'con'
                  ? `img/icons/buffsIcons/${key}s.png`
                  : `img/icons/buffsIcons/${key}.png`
              }
              alt=""
            />
            <p style={{ position: 'absolute', top: 0, left: 34 }}>
              {val.duration}
            </p>
          </div>
        ))}
      </div>
      {selectedType && (
        <div className="rpgui-container framed listCombatItems">
          <ListCombatItems
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            executeItem={executeItem}
          />
        </div>
      )}
    </div>
  );
};

export default CombatUI;
