import useGlobalState from "../../../customHooks/useGlobalState";
import { removeItemFromFirebase } from "../../../firebase/saveItemToFirebase";
import useInventoryStore from "../../../stores/inventoryStore";
import { Item, Items } from "../../../stores/types/items";

export default function ListCombatItems(
    { selectedType, setSelectedType, executeScroll}: 
    { 
        selectedType: keyof Items | undefined, 
        setSelectedType: any
        executeScroll: (item: Item) => void
    }
    
) {
    const { inventories, player, scrolls, removeScroll } = useGlobalState();
    const {removeItem} = useInventoryStore();
    const playerInventory = selectedType && inventories[player.inventoryId]?.[selectedType] || [];
    const matchingScrolls = playerInventory
        .map((item: Item) => scrolls.find((scroll) => scroll.id === item))
        .filter(Boolean); // Filtra los valores `undefined` (scrolls no encontrados)

    const executeAction = (item: Item) => {
        executeScroll(item)
        setSelectedType('')
        removeScroll(item.id)
        removeItem(player.inventoryId, "scrolls", item.id)
        removeItemFromFirebase(player.name, item.id, "scrolls")
    }    
    return (
        <div >   { /*OJO con esta clase */}
            {matchingScrolls.map((item: Item, index: number) => (
                <img
                    className="inventoryIcons"
                    key={item?.id || index} // Usa `id` como clave si existe, o índice como fallback
                    src={item?.img || ""}
                    alt={item?.name || "Scroll"}
                    onClick={() => executeAction(item)}
                />
            ))}
        </div>
    );
}
