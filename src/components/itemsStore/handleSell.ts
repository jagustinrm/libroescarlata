import { getGlobalState } from "../../customHooks/useGlobalState";
import { FloatingMessageProps } from "../../stores/types/others";
import useInventoryStore from "../../stores/inventoryStore";
import { Accessory } from "../../stores/types/accesories";

export const handleSell = (
    playerInventoryId: string,
    itemId: string,
    itemType: any,
    itemCost: number,
    setFloatingMessage: (message: FloatingMessageProps| null) => void
  ) => {
    const {player, playerActions, } = getGlobalState();
    const {removeItem} = useInventoryStore.getState();
    if (!Object.values(player.bodyParts).some(item => item?.id === itemId) 
    && !Object.values(player.accessoriesParts.anillo).some(item => (item as Accessory)?.id === itemId)
    && !Object.values(player.accessoriesParts.aro).some(item => (item as Accessory)?.id === itemId)
    && player.accessoriesParts.amuleto.id != itemId
  ) {
    // console.log(Object.values(player.bodyParts).some(item => item.id != itemId))
    removeItem(playerInventoryId, itemType, itemId)

      playerActions.setPlayerMaterial(player.playerMaterial + itemCost);
      setFloatingMessage({
        message: "¡Vendido!",
        onComplete: () => setFloatingMessage(null),
        position: {x: 100, y:100}
    });
  } else {
    setFloatingMessage({
        message: "¡Deberías desequiparte primero!",
        onComplete: () => setFloatingMessage(null),
        position: {x: 100, y:100}
    })
  }
  };