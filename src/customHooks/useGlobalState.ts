import useArmorStore from "../stores/armorStore";
import useClassStore from "../stores/classStore";
import useCreatureStore from "../stores/creatures";
import useInventoryStore from "../stores/inventoryStore";
import useOtherItemsStore from "../stores/otherItemsStore";
import usePlayerStore from "../stores/playerStore";
import usePositionStore from "../stores/positionStore";
import usePotionStore from "../stores/potionsStore";
import useSpellStore from "../stores/spellsStore";
import useStoryStore from "../stores/storyStore";
import { useWeaponStore } from "../stores/weaponStore";

const useGlobalState = () => ({
    ...usePlayerStore(),
    ...useWeaponStore(),
    ...useCreatureStore(),
    ...useInventoryStore(),
    ...useSpellStore(),
    ...useClassStore(),
    ...useArmorStore(),
    ...usePotionStore(),
    ...usePositionStore(),
    ...useStoryStore(),
    ...useOtherItemsStore(),
  });

export default useGlobalState