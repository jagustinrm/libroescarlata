import { Dispatch, SetStateAction } from "react";
import { getGlobalState } from "../../customHooks/useGlobalState";
import { Scroll } from "../../stores/types/scrolls";
import { Spell } from "../../stores/types/spells";
import { Weapon } from "../../stores/types/weapons";
import { handleCombatAction } from "../../utils/combatHandlers";
import usePostCombatActions from "../../customHooks/usePostCombatActions";

    export const executeAction = (
        type: 'attack' | 'spell' | 'scroll',
        setActivateImage: Dispatch<SetStateAction<boolean>>,
        handleMessage: (message: string, type: string, shouldClose: boolean) => void,
        item?: Weapon | Spell | Scroll,
        ) => {
      const { currentCharacter, weapons, spells, player, setSoundUrl} =getGlobalState();
      const { handlePostCombatActs } = usePostCombatActions();
      if (currentCharacter?.id !== 'player') return;
      
      const selectedItem = item ?? 
        (type === 'attack' 
          ? weapons.find((w) => player.bodyParts.manoDerecha?.name === w.name) 
          : spells.find((s) => player.selectedSpell?.name === s.name));
      
      setSoundUrl(selectedItem?.soundEffect || null);
    
      const res = handleCombatAction(type, { setActivateImage, handlePostCombatActs, handleMessage }, selectedItem);
    
      setTimeout(() => setSoundUrl(null), type === 'attack' ? 300 : 1000);
      
      return res;
    };