import { useEffect} from "react";
import usePotionStore from "../../stores/potionsStore"; 
import useItemsStore from '../../stores/itemsStore';
import { useWeaponStore } from '../../stores/weaponStore';
import { Item } from '../../stores/types/items';
import useArmorStore from "../../stores/armorStore";

const ItemShopLoader = () => {
    const { weapons } = useWeaponStore();
    const {armors} = useArmorStore();
    const { potions } = usePotionStore();
    const { items, createItems, addItem } = useItemsStore();
     const shopId = 1; // ID único para el inventario del shop (ahora es un número)

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
    return null
}

export default ItemShopLoader