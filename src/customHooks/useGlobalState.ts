import useAccessoryStore from '../stores/accesoryStore';
import useArmorStore from '../stores/armorStore';
import { useBookStore } from '../stores/bookStore';
import useClassStore from '../stores/classStore';
import useCreatureStore from '../stores/creatures';
import useInventoryStore from '../stores/inventoryStore';
import useItemsStore from '../stores/itemsStore';
import useOtherItemsStore from '../stores/otherItemsStore';
import usePlayerStore from '../stores/playerStore';
import usePositionStore from '../stores/positionStore';
import usePotionStore from '../stores/potionsStore';
import useScrollStore from '../stores/scrollStore';
import useSpellStore from '../stores/spellsStore';
import useStoryStore from '../stores/storyStore';
import { useWeaponStore } from '../stores/weaponStore';

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
  ...useItemsStore(),
  ...useAccessoryStore(),
  ...useBookStore(),
  ...useScrollStore(),
});

export default useGlobalState;
