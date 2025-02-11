import { getGlobalState } from "../../customHooks/useGlobalState";
import { Armor } from "../../stores/types/armor";
import { Item } from "../../stores/types/items";
import { saveItemToFirebase } from '../../firebase/saveItemToFirebase';
import { Weapon } from "../../stores/types/weapons";
import { Accessory } from "../../stores/types/accesories";
import { Scroll } from "../../stores/types/scrolls";
import { FloatingMessageProps } from "../../stores/types/others";

export const handleBuy = (
    playerInventoryId: string,
    itemId: string,
    itemType: any,
    itemCost: number,
    item: Item,
    setFloatingMessage: (message: FloatingMessageProps| null) => void
  ) => {
    const {player, playerActions,
         addItemToInventory, addNewArmor, 
         addNewWeapon, addNewAccessory, addNewScroll} = getGlobalState();

    if (player.playerMaterial >= itemCost) {
      const updatedItem = { ...item, playerOwner: true } as Item
      addItemToInventory(playerInventoryId, itemType, itemId);
      if (itemType === 'armors') {
        addNewArmor(updatedItem as Armor);
        saveItemToFirebase(
          player.name,
          (updatedItem as Armor).id,
          updatedItem as Armor,
          'armors',
        );
      } else if (itemType === 'weapons') {
        saveItemToFirebase(
          player.name,
          (updatedItem as Weapon).id,
          updatedItem as Weapon,
          'weapons',
        );
        addNewWeapon(updatedItem as Weapon);
      } else if (itemType === 'accessories') {
        saveItemToFirebase(
          player.name,
          (updatedItem as Accessory).id,
          updatedItem as Accessory,
          'accessories',
        );
        addNewAccessory(updatedItem as Accessory);
      } else if (itemType === 'scrolls') {
        saveItemToFirebase(
          player.name,
          (updatedItem as Scroll).id,
          updatedItem as Scroll,
          'scrolls',
        );
        addNewScroll(updatedItem as Scroll);
      }
      // else if (itemType === "others") {
      //   saveItemToFirebase(player.name, (updatedItem as otherItem).id, updatedItem as otherItem, "others");
      // } else if (itemType === "books") {
      //   saveItemToFirebase(player.name, (updatedItem as Book).id, updatedItem as Book, "books");
      // }
      playerActions.setPlayerMaterial(player.playerMaterial - itemCost);
      setFloatingMessage({
        message: "¡Comprado!",
        onComplete: () => setFloatingMessage(null),
        position: {x: 100, y:100}
    });
    } else {
     setFloatingMessage({
        message: "Te faltan materiales",
        onComplete: () => setFloatingMessage(null),
        position: {x: 100, y:100}
    });;
    }
  };