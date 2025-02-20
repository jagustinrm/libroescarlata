import { getGlobalState } from "../../customHooks/useGlobalState";
import { FloatingMessageProps } from "../../stores/types/others";
import useInventoryStore from "../../stores/inventoryStore";

export const handleSell = (
    playerInventoryId: string,
    itemId: string,
    itemType: any,
    itemCost: number,
    setFloatingMessage: (message: FloatingMessageProps| null) => void
  ) => {
    const {player, playerActions} = getGlobalState();
    const {removeItem} = useInventoryStore.getState();
    removeItem(playerInventoryId, itemType, itemId)
      playerActions.setPlayerMaterial(player.playerMaterial + itemCost);
      setFloatingMessage({
        message: "Vendido!",
        onComplete: () => setFloatingMessage(null),
        position: {x: 100, y:100}
    });
    
  };