import { useEffect } from 'react';
import useItemsStore from '../../stores/itemsStore';
import { Item } from '../../stores/types/items';
import { CreateCustomArmors } from '../../generators/customArmors/createCustomArmor';
// import { deleteArmorFromFirebase } from '../../firebase/saveArmorToFirebase';
import useGlobalState from '../../customHooks/useGlobalState';
import { CreateCustomWeapons } from '../../generators/customWeapons/createCustomWeapons';
import { CreateCustomAccessories } from '../../generators/customAccesories/createCustomAccesories';
import {
  createCustomScroll,
  useCreateCustomScrolls,
} from '../../generators/customScrolls/createCustomScrolls';
// import { Accessory } from '../../stores/types/accesories';

const ItemShopLoader = () => {
  // const { generatedArmor, createArmor } = CreateCustomArmor();
  const { generatedArmors, createArmors } = CreateCustomArmors();
  const { generatedWeapons, createWeapons } = CreateCustomWeapons();
  const { generatedAccessories, createAccessories } = CreateCustomAccessories();
  const { generatedScrolls, createScrolls } = useCreateCustomScrolls();
  const {
    weapons,
    armors,
    potions,
    otherItems,
    removeItems,
    accessories,
    scrolls,
    books,
  } = useGlobalState();
  const { items, createItems, addItem } = useItemsStore();
  const shopId = 1; // ID único para el inventario del shop (ahora es un número)

  useEffect(() => {
    if (!items[shopId]) {
      createItems(shopId); // Crear el inventario si no existe
    }

    weapons.forEach((weapon) => {
      if (!items[shopId]?.weapons.some((w) => w.id === weapon.id)) {
        if (weapon.playerOwner === false || !weapon.playerOwner) {
          addItem(shopId, 'weapons', weapon);
        }
      }
    });
    accessories.forEach((accesory) => {
      if (!items[shopId]?.accessories.some((a) => a.id === accesory.id)) {
        if (accesory.playerOwner === false || !accesory.playerOwner) {
          addItem(shopId, 'accessories', accesory);
        }
      }
    });
    armors.forEach((armor) => {
      if (!items[shopId]?.armors.some((a) => a.id === armor.id)) {
        if (armor.playerOwner === false || !armor.playerOwner) {
          addItem(shopId, 'armors', armor);
        }
      }
    });
    potions.forEach((potion) => {
      if (!items[shopId]?.potions.some((p: Item) => p.id === potion.id)) {
        addItem(shopId, 'potions', potion);
      }
    });

    otherItems.forEach((otherItem) => {
      if (!items[shopId]?.others.some((i: Item) => i.id === otherItem.id)) {
        addItem(shopId, 'others', otherItem);
      }
    });
    books.forEach((book) => {
      if (!items[shopId]?.books.some((i: Item) => i.id === book.id)) {
        addItem(shopId, 'books', book);
      }
    });
    scrolls.forEach((scroll) => {
      if (!items[shopId]?.scrolls.some((s: Item) => s.id === scroll.id)) {
        if (scroll.playerOwner === false || !scroll.playerOwner) {
          addItem(shopId, 'scrolls', scroll);
        }
      }
    });
  }, [
    weapons,
    potions,
    items,
    scrolls,
    createItems,
    addItem,
    shopId,
    armors,
    books,
  ]);

  useEffect(() => {
    if (generatedArmors) {
      generatedArmors.forEach((a) => {
        addItem(shopId, 'armors', a);
      });
    }
  }, [generatedArmors]);
  useEffect(() => {
    if (generatedWeapons) {
      generatedWeapons.forEach((w) => {
        addItem(shopId, 'weapons', w);
      });
    }
  }, [generatedWeapons]);
  useEffect(() => {
    if (generatedAccessories) {
      generatedAccessories.forEach((a) => {
        addItem(shopId, 'accessories', a);
      });
    }
  }, [generatedAccessories]);

  useEffect(() => {
    if (generatedScrolls) {
      generatedScrolls.forEach((s) => {
        addItem(shopId, 'scrolls', s);
      });
    }
    console.log(items[shopId]);
  }, [generatedScrolls]);

  useEffect(() => {
    const asyncRemoveItemsAndCreate = async () => {
      // Primero elimina los items existentes
      await removeItems();
      // Luego crea nuevas armaduras, armas y accesorios
      await createArmors(5);
      await createWeapons(5);
      await createAccessories(5);
      await createScrolls(5);
    };

    // Ejecuta la lógica inmediatamente al cargar el componente
    asyncRemoveItemsAndCreate();

    // Configura un intervalo que ejecuta la lógica periódicamente
    const interval = setInterval(asyncRemoveItemsAndCreate, 60000); // Cada 60 segundos

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default ItemShopLoader;
