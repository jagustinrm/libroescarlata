import { useEffect, useState} from "react";
import usePotionStore from "../../stores/potionsStore"; 
import useItemsStore from '../../stores/itemsStore';
import { useWeaponStore } from '../../stores/weaponStore';
import { Item } from '../../stores/types/items';
import useArmorStore from "../../stores/armorStore";
import CreateCustomArmor from "../../generators/customArmors/createCustomArmor";
import { deleteArmorFromFirebase } from "../../firebase/saveArmorToFirebase";
import usePlayerStore from "../../stores/playerStore";
import useInventoryStore from "../../stores/inventoryStore";
const ItemShopLoader = () => {
    const {generatedArmor, createArmor} = CreateCustomArmor()
    const [prevArmorId, setPrevArmorId] = useState('')
    const { weapons } = useWeaponStore();
    const {armors} = useArmorStore();
    const { potions } = usePotionStore();
    const { items, createItems, addItem, removeItem } = useItemsStore();
    const shopId = 1; // ID único para el inventario del shop (ahora es un número)
    const {player} = usePlayerStore();
    const {inventories} = useInventoryStore()
    useEffect(() => {
        if (!items[shopId]) {
            createItems(shopId); // Crear el inventario si no existe
        }
    
        weapons.forEach((weapon) => {
            if (!items[shopId]?.weapons.some((w: Item) => w.id === weapon.id)) {
                addItem(shopId, 'weapons', weapon); // Agregar solo si no está ya en el inventario
            }
        });
    
        potions.forEach((potion) => {
            if (!items[shopId]?.potions.some((p: Item) => p.id === potion.id)) {
                addItem(shopId, 'potions', potion); // Agregar solo si no está ya en el inventario
            }
        });
        armors.forEach((armor) => {
            if (!items[shopId]?.armors.some((a: Item) => a.id === armor.id)) {
                addItem(shopId, 'armors', armor); // Agregar solo si no está ya en el inventario
            }

            
        });

    }, [weapons, potions, items, createItems, addItem, shopId, armors]);
    
    useEffect(() => {
        if (generatedArmor) {
            if (!inventories[player.inventoryId]) {
                deleteArmorFromFirebase(prevArmorId)
            } else if (!inventories[player.inventoryId].armors.some(a => a === prevArmorId)){
                console.log(inventories[player.inventoryId].armors)
                console.log(prevArmorId)
                deleteArmorFromFirebase(prevArmorId)
            }
            removeItem(shopId, 'armors', prevArmorId)
            addItem(shopId, 'armors', generatedArmor);
            setPrevArmorId(generatedArmor.id)
        } 
    }, [generatedArmor]);
        
    useEffect(() => {


        const asyncCreateArmor = async () => {
            await createArmor();
        };
        asyncCreateArmor();
        const interval = setInterval(asyncCreateArmor, 60000); 
        return () => clearInterval(interval);
    }, []);

    return null;
}

export default ItemShopLoader


