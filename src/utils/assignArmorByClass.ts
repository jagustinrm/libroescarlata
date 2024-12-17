import { Armor } from "../stores/types/armor";
import { Class } from "../stores/types/class";
import { InventoryStore } from "../stores/types/inventory";

interface AssignArmorParams {
    className: string;
    classes: Class[]
    armors: Armor[];
    playerActions: {
        setP_SelectedArmor: (armor: Armor) => void;
    };
    inventoryStore: InventoryStore
    player: {
        name: string;
    };
}

export function assignArmorByClass({
    className,
    classes,
    armors,
    playerActions,
    inventoryStore,
    player
}: AssignArmorParams): void {
    // Encuentra la clase correspondiente
    const classArmor = classes.find(c => c.className === className);
    if (!classArmor) {
        console.error(`Class ${className} not found.`);
        return;
    }

    // Encuentra y asigna la armadura inicial
    const initialArmorId = classArmor.initialArmor[0];
    
    const armor = armors.find(a => a.id === initialArmorId);
    
    if (armor) {
        playerActions.setP_SelectedArmor(armor); 
    } else {
        console.error(`Initial armor with ID ${initialArmorId} not found.`);
    }

    // Agrega todas las armaduras iniciales al inventario del jugador
    classArmor.initialArmor.forEach(armorId => {
        const armor = armors.find(a => a.id === armorId);
        console.log(armor)
        if (armor) {
            inventoryStore.addItem(`${player.name}_inventory`, 'armors', armor.id);
        } else {
            console.error(`Armor with ID ${armorId} not found.`);
        }
    });
}
