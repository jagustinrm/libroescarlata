import React from 'react';
import Dropdown from '../../../utils/DropDown';
import AttackAndPotions from './AttackAndPotions';
import usePlayerStore from '../../../stores/playerStore';
import useCreatureStore from '../../../stores/creatures';
import { Weapon } from '../../../stores/types/weapons';
import { Spell } from '../../../stores/types/spells';

interface CombatUIProps {
  opcionesArmas: Weapon[]
  opcionesSpells: Spell[]
  turn: string;
  executeAttack: () => void;
  handleMessage: (message: string, type: string, dismissible: boolean) => void;
  pocion: string | undefined; 
  executeSpell: () => void;
  fightType: string;
}

const CombatUI: React.FC<CombatUIProps> = ({
  opcionesArmas,
  opcionesSpells,
  turn,
  executeAttack,
  handleMessage,
  pocion,
  // selectedSpell,
  // setSelectedSpell,
  executeSpell,
  fightType
}) => {
  const {player, playerActions} = usePlayerStore.getState()
  const {creature} = useCreatureStore.getState()

  console.log(player.selectedSpell)
  return (
    <div className="rpgui-container framed attacks fixedUI">
      {/* Dropdown para armas */}
      <div>
        <Dropdown
          id="weapon-dropdown"
          options={opcionesArmas || []}
          value={player.bodyParts.manoDerecha}
          onChange={(value) => playerActions.setP_SelectedBodyPart(value)}
          disabled={turn !== 'player' || creature.health === 0}
        />
      </div>

      {/* Ataques y pociones */}
      <AttackAndPotions
        executeAttack={executeAttack}
        handleMessage={handleMessage}
        pocion={pocion}
        turn = {turn}
      />

      {/* Dropdown y botón para hechizos */}
      <div className="rpgui-container rpgui-draggable">
        <div>
          <Dropdown
            id="spell-dropdown"
            options={opcionesSpells || []}
            value={player.selectedSpell }
            onChange={(value) => playerActions.setP_SelectedSpell(value)}
            disabled={turn !== 'player' || creature.health === 0}
          />
        </div>
        <button
          onClick={executeSpell}
          disabled={
            turn !== 'player' ||
            !player.selectedSpell ||
            creature.health === 0 ||
            player.p_LeftHealth <= 0
          }
        >
          Lanzar hechizo
        </button>
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
  );
};

export default CombatUI;
