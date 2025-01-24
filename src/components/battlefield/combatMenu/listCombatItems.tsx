import useGlobalState from "../../../customHooks/useGlobalState";
import { removeItemFromFirebase } from "../../../firebase/saveItemToFirebase";
import useInventoryStore from "../../../stores/inventoryStore";
import { Item, Items } from "../../../stores/types/items";

export default function ListCombatItems(
    { selectedType, setSelectedType, executeItem}: 
    { 
        selectedType: keyof Items, 
        setSelectedType: any
        executeItem: (item: Item) => void
    }
    
) {
    const { inventories, player, scrolls, removeScroll, potions } = useGlobalState();
    const { removeItem } = useInventoryStore();
    const playerInventory = selectedType && inventories[player.inventoryId]?.[selectedType] || [];
    const collections = {
      scrolls,
      potions,
    };
    const matchingItems = playerInventory
    .map((item: Item) => collections[selectedType as keyof typeof collections]?.find((obj) => obj.id === item))
    .filter(Boolean);


    const executeAction = (item: Item, selectedType: keyof Items) => {
        executeItem(item)
        setSelectedType('')
        removeScroll(item.id)
        removeItem(player.inventoryId, selectedType, item.id)
        removeItemFromFirebase(player.name, item.id, selectedType)
    }    
    return (
        <div >   
            {matchingItems.length > 0 ?
             matchingItems.map((item: Item, index: number) => (
                <img
                    className="inventoryIcons"
                    key={item?.id || index} // Usa `id` como clave si existe, o índice como fallback
                    src={item?.img || ""}
                    alt={item?.name || "Item"}
                    onClick={() => executeAction(item, selectedType)}
                />
            ))
            :
            <p onClick= {() =>  setSelectedType('')}>No hay objetos</p>
            }
        </div>
    );
}
