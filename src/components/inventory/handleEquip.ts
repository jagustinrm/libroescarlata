import { getGlobalState } from "../../customHooks/useGlobalState";
import { Accessory } from "../../stores/types/accesories";
import { Armor } from "../../stores/types/armor";
import { Item } from "../../stores/types/items";
import { FloatingMessageProps } from "../../stores/types/others";
import { Weapon } from "../../stores/types/weapons";

  export const handleEquip = (
    selectedItem: Item,
    selectedAccessoryEquipped: {
        type: string;
        index: number;
      } | null,
      setFloatingMessage: (message: FloatingMessageProps | null) => void
  ) => {
    const {playerActions} = getGlobalState();
  
    if (!selectedItem) return;

    switch (true) {
      case "armorValue" in selectedItem && "bodyPart" in selectedItem:
        playerActions.setP_SelectedBodyPart(selectedItem as Armor);
        setFloatingMessage(
            {
                message: "¡Equipado!",
                onComplete: () => setFloatingMessage(null),
                position: {x: 100, y:100}
            }
        );
        break;
  
      case "damage" in selectedItem && "bodyPart" in selectedItem:
        playerActions.setP_SelectedBodyPart(selectedItem as Weapon);
        setFloatingMessage({
            message: "¡Equipado!",
            onComplete: () => setFloatingMessage(null),
            position: {x: 100, y:100}
        });
        break;
  
      case "type" in selectedItem &&
        ["Amuleto", "Anillo", "Aro"].includes(selectedItem.type):
        if (selectedAccessoryEquipped) {
          playerActions.addP_SelectedAccesories(
            selectedItem as Accessory,
            selectedAccessoryEquipped.index
          );
          setFloatingMessage({
            message: "¡Equipado!",
            onComplete: () => setFloatingMessage(null),
            position: {x: 100, y:100}
        });
        } else {
          setFloatingMessage({
            message: "Seleccionar accesorio.",
            onComplete: () => setFloatingMessage(null),
            position: {x: 100, y:100}
        });
        }
        break;
  
      default:
        console.log("Este objeto no puede ser equipado.");
    }
  };