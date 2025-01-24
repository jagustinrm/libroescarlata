import React from 'react';
import { handleHealing } from '../../../utils/handleHealing';
import usePlayerStore from '../../../stores/playerStore';

import usePotionStore from '../../../stores/potionsStore';
import useCreatureStore from '../../../stores/creatures';
import useTurnStore from '../../../stores/turnStore';

interface AttackAndPotionsProps {
  // selectedWeapon: string | null;
  executeAttack: () => void;
  pocion: string | undefined; // Cambiar el tipo a string | undefined
  handleMessage: (message: string, type: string, persist: boolean) => void;
  // turn: string;
}

const AttackAndPotions: React.FC<AttackAndPotionsProps> = ({
  // selectedWeapon,
  executeAttack,
  pocion,
  handleMessage,
  // turn
}) => {
  // Lógica para encontrar la poción específica
  const findPotion = (name: string) => {
    return potions.find((potion) => potion.name === name);
  };
  const { player} = usePlayerStore();

  const { potions } = usePotionStore();
  const { creature } = useCreatureStore();
  const {currentCharacter} = useTurnStore();
  return (
    <div className="attackAndPotions">
      <button
        className="rpgui-button newDesign espada"
        id="newDesign"
        onClick={executeAttack}
        disabled={ 
          creature.health === 0 || 
          player.p_LeftHealth === 0 || 
          !player.bodyParts.manoDerecha || 
           currentCharacter?.id !== "player"
        }
      >
        ⚔️
      </button>

      {pocion && (
        <button
          className="rpgui-button newDesign potionsButton"
          id="newDesign"
          // onClick={() =>
          //   handleHealing({
          //     handleMessage,
          //   })
          // }
          disabled={creature.health === 0 || player.p_LeftHealth === 0}
        >
          {
            // Buscar la poción en la lista de potions y mostrar la imagen
            findPotion('Poción de Curación Menor') ? (
              <img
                className="potionImg"
                src={findPotion('Poción de Curación Menor')?.img}
                alt="Poción de Curación Menor"
              />
            ) : null
          }
        </button>
      )}
    </div>
  );
};

export default AttackAndPotions;
