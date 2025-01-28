import React, { useState } from 'react';
import Dropdown from '../../../utils/DropDown';
import AttackAndPotions from './AttackAndPotions';
import usePlayerStore from '../../../stores/playerStore';
import useCreatureStore from '../../../stores/creatures';
import { Weapon } from '../../../stores/types/weapons';
import { Spell } from '../../../stores/types/spells';
import useTurnStore from '../../../stores/turnStore';
import { Item, Items } from '../../../stores/types/items';

import { handleHealing } from '../../../utils/handleHealing';
import ListCombatItems from './listCombatItems';

interface CombatUIProps {
  opcionesArmas: Weapon[];
  opcionesSpells: Spell[];
  // turn: string;
  executeAttack: () => void;
  handleMessage: (message: string, type: string, dismissible: boolean) => void;
  pocion: string | undefined;
  executeSpell: () => void;
  fightType: string;
  executeScroll: (item: Item) => void;
}

const CombatUI: React.FC<CombatUIProps> = ({
  opcionesArmas,
  opcionesSpells,
  executeAttack,
  handleMessage,
  pocion,
  executeSpell,
  fightType,
  executeScroll,
}) => {
  const { player, playerActions } = usePlayerStore.getState();
  const { creature } = useCreatureStore.getState();
  const { currentCharacter } = useTurnStore.getState();
  const [selectedType, setSelectedType] = useState<keyof Items>();

  const executeItem = (item: any) => {
    if (selectedType === 'scrolls') {
      executeScroll(item);
    } else if (selectedType === 'potions') {
      handleHealing({ item, handleMessage });
    }
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
              creature.health === 0
            }
          />
        </div>
        {/* Ataques y pociones */}
        <AttackAndPotions
          executeAttack={executeAttack}
          handleMessage={handleMessage}
          pocion={pocion}
          // turn = {turn}
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
                creature.health === 0
              }
            />
          </div>
          <button
            onClick={executeSpell}
            disabled={
              (currentCharacter && currentCharacter.id !== 'player') ||
              !player.selectedSpell ||
              creature.health === 0 ||
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
        <div 
        key={key} >
          <img
          style={{width: '30px'}} 
          src={`img/icons/buffsIcons/${key}.png`} alt="" />  
          <p
           style={{position: 'absolute', top: 0, left: 34}}
          >{val.duration}</p>
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
