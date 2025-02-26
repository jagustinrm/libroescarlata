import { Dispatch, SetStateAction } from 'react';
import useGlobalState from '../../../customHooks/useGlobalState';
import { removeItemFromFirebase } from '../../../firebase/saveItemToFirebase';
import useInventoryStore from '../../../stores/inventoryStore';
import { Item, Items } from '../../../stores/types/items';

export default function ListCombatItems({
  selectedType,
  setSelectedType,
  executeItem,
}: {
  selectedType: keyof Items;
  setSelectedType: Dispatch<SetStateAction<keyof Items | undefined>>;
  executeItem: (item: Item) => boolean;
}) {
  const { inventories, player, scrolls, potions } = useGlobalState();
  const { removeItem } = useInventoryStore();
  const playerInventory =
    (selectedType && inventories[player.inventoryId]?.[selectedType]) || [];
  const collections = {
    scrolls,
    potions,
  };
  const matchingItems = playerInventory
    .map((item: Item) =>
      collections[selectedType as keyof typeof collections]?.find(
        (obj) => obj.id === item,
      ),
    )
    .filter(Boolean);

  const executeAction = async (item: Item, selectedType: keyof Items) => {
    const wasItemUsed = executeItem(item);
    if (wasItemUsed) {
      setSelectedType(undefined);
      removeItem(player.inventoryId, selectedType, item.id);

      await removeItemFromFirebase(player.name, item.id, selectedType);
    }
  };
  return (
    <div>
      {matchingItems.length > 0 ? (
        matchingItems.map((item: Item, index: number) => (
          <img
            className="inventoryIcons"
            key={item?.id || index} // Usa `id` como clave si existe, o índice como fallback
            src={item?.img || ''}
            alt={item?.name || 'Item'}
            onClick={() => executeAction(item, selectedType)}
          />
        ))
      ) : (
        <p onClick={() => setSelectedType(undefined)}>No hay objetos</p>
      )}
    </div>
  );
}
