import { useEffect } from 'react';
import useItemsStore from '../../stores/itemsStore';
import { Item } from '../../stores/types/items';
import  { CreateCustomArmors } from '../../generators/customArmors/createCustomArmor';
// import { deleteArmorFromFirebase } from '../../firebase/saveArmorToFirebase';
import useGlobalState from '../../customHooks/useGlobalState';
import { CreateCustomWeapons } from '../../generators/customWeapons/createCustomWeapons';
import { CreateCustomAccessories } from '../../generators/customAccesories/createCustomAccesories';
// import { Accessory } from '../../stores/types/accesories';

const ItemShopLoader = () => {
  // const { generatedArmor, createArmor } = CreateCustomArmor();
  const {generatedArmors, createArmors} = CreateCustomArmors()
  const {generatedWeapons, createWeapons} = CreateCustomWeapons()
  const {generatedAccessories, createAccessories} = CreateCustomAccessories();
  const {weapons, armors, potions, otherItems, removeItems, accessories} = useGlobalState();
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
        addItem(shopId, 'potions', potion); // Agregar solo si no está ya en el inventario
      }
    });

    otherItems.forEach((otherItem) => {
      if (!items[shopId]?.others.some((i: Item) => i.id === otherItem.id)) {
        addItem(shopId, 'others', otherItem); // Agregar solo si no está ya en el inventario
      }
    })  

  }, [weapons, potions, items, createItems, addItem, shopId, armors]);

  // useEffect(() => {
  //   if (generatedArmor) {
  //     const handleDeleteFromFB = async () => {
  //       await deleteArmorFromFirebase(prevArmorId);
  //     };
  //     handleDeleteFromFB();
  //     removeItem(shopId, 'armors', prevArmorId);
  //     addItem(shopId, 'armors', generatedArmor);
  //     setPrevArmorId(generatedArmor.id);
  //   }
  // }, [generatedArmor]);
  useEffect(() => {
    if (generatedArmors) {
      generatedArmors.forEach(a => {
        // removeItem(shopId, 'armors', prevArmorId);
        addItem(shopId, 'armors', a);
        // setPrevArmorId(a.id);  
      })
    }
  }, [generatedArmors])
  useEffect(() => {
    if (generatedWeapons) {
      generatedWeapons.forEach(w => {
        // removeItem(shopId, 'armors', prevArmorId);
        addItem(shopId, 'weapons', w);
        // setPrevArmorId(a.id);  
      })
    }
  }, [generatedWeapons])
  useEffect(() => {
    if (generatedAccessories) {
      generatedAccessories.forEach(a => {
        // removeItem(shopId, 'armors', prevArmorId);
        addItem(shopId, 'accessories', a);
        // setPrevArmorId(a.id);  
      })
    }
  }, [generatedAccessories])

  useEffect(() => {
    const asyncRemoveItemsAndCreate = async () => {
      // Primero elimina los items existentes
      await removeItems();
  
      // Luego crea nuevas armaduras, armas y accesorios
      await createArmors(5);
      await createWeapons(5);
      await createAccessories(5);
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
