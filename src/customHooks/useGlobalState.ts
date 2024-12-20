import useArmorStore from "../stores/armorStore";
import useClassStore from "../stores/classStore";
import useCreatureStore from "../stores/creatures";
import useInventoryStore from "../stores/inventoryStore";
import usePlayerStore from "../stores/playerStore";
import useSpellStore from "../stores/spellsStore";
import { useWeaponStore } from "../stores/weaponStore";

const useGlobalState = () => ({
    ...usePlayerStore(),
    ...useWeaponStore(),
    ...useCreatureStore(),
    ...useInventoryStore(),
    ...useSpellStore(),
    ...useClassStore(),
    ...useArmorStore(),
  });

export default useGlobalState