import { getItemsFromFirebase } from '../firebase/saveItemToFirebase';
import { Weapon } from '../stores/types/weapons';
import { Accessory } from '../stores/types/accesories';
import usePlayerStore from '../stores/playerStore';
import useAccessoryStore from '../stores/accesoryStore';
import { useWeaponStore } from '../stores/weaponStore';
import useArmorStore from '../stores/armorStore';
import { Armor } from '../stores/types/armor';
import { Scroll } from '../stores/types/scrolls';
import useScrollStore from '../stores/scrollStore';

const FirebaseItemsLoader = async () => {
  try {
    const { addNewAccessory } = useAccessoryStore.getState();
    const { addNewWeapon } = useWeaponStore.getState();
    const { addNewArmor } = useArmorStore.getState();
    const { addNewScroll } = useScrollStore.getState();
    const { player } = usePlayerStore.getState();

    // Llama a la función unificada para obtener los ítems
    const { weapons, accessories, armors, scrolls } =
      await getItemsFromFirebase(player.name);

    // Agregar armas al store
    weapons.forEach((weapon: Weapon) => {
      addNewWeapon(weapon);
    });

    // Agregar accesorios al store
    accessories.forEach((accessory: Accessory) => {
      addNewAccessory(accessory);
    });
    console.log(armors);
    armors.forEach((armor: Armor) => {
      addNewArmor(armor);
    });
    console.log(scrolls);
    scrolls.forEach((scroll: Scroll) => {
      addNewScroll(scroll);
    });

    console.log('Items cargados exitosamente.');
  } catch (error) {
    console.error('Error al cargar los ítems desde Firebase:', error);
  }
};

export default FirebaseItemsLoader;
