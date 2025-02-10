import useAccessoryStore from '../stores/accesoryStore';
import useAppStore from '../stores/appStore';
import useArmorStore from '../stores/armorStore';
import { useBookStore } from '../stores/bookStore';
import useClassStore from '../stores/classStore';
import useCreatureStore from '../stores/creatures';
import useInventoryStore from '../stores/inventoryStore';
import useItemsStore from '../stores/itemsStore';
import useOtherItemsStore from '../stores/otherItemsStore';
import { usePetStore } from '../stores/petsStore';
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
  ...useAppStore(),
  ...usePetStore(),
});

export const getGlobalState = () => ({
  ...usePlayerStore.getState(),
  ...useWeaponStore.getState(),
  ...useCreatureStore.getState(),
  ...useInventoryStore.getState(),
  ...useSpellStore.getState(),
  ...useClassStore.getState(),
  ...useArmorStore.getState(),
  ...usePotionStore.getState(),
  ...usePositionStore.getState(),
  ...useStoryStore.getState(),
  ...useOtherItemsStore.getState(),
  ...useItemsStore.getState(),
  ...useAccessoryStore.getState(),
  ...useBookStore.getState(),
  ...useScrollStore.getState(),
  ...useAppStore.getState(),
  ...usePetStore.getState(),
});

useGlobalState.getState = getGlobalState;

export default useGlobalState;
