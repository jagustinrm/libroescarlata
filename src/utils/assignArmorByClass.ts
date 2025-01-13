import usePlayerStore from '../stores/playerStore';
import { Accessory } from '../stores/types/accesories';
import { Armor } from '../stores/types/armor';
import { Class } from '../stores/types/class';
import { InventoryStore } from '../stores/types/inventory';
import { accessoriesParts } from '../stores/types/others';

interface AssignArmorParams {
  className: string;
  classes: Class[];
  armors: Armor[];
  playerActions: {
    setP_SelectedBodyPart: (armor: Armor) => void;
    setP_SelectedAccessories: (accesories: accessoriesParts) => void;
  };
  inventoryStore: InventoryStore;
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
  // player,
}: AssignArmorParams): void {
  // Encuentra la clase correspondiente
  const {player} = usePlayerStore.getState();
  const classArmor = classes.find((c) => c.className === className);
  if (!classArmor) {
    console.error(`Class ${className} not found.`);
    return;
  }

  // Encuentra y asigna la armadura inicial
  const initialArmorId = classArmor.initialArmor[0];

  const armor = armors.find((a) => a.id === initialArmorId);

  if (armor) {
    playerActions.setP_SelectedBodyPart(armor);
  } else {
    console.error(`Initial armor with ID ${initialArmorId} not found.`);
  }
  playerActions.setP_SelectedAccessories({
    anillo: [],  // Inicializa como un arreglo vacío para los anillos
    aro: [],     // Inicializa como un arreglo vacío para los aros
    amuleto: null, // Inicializa como null para el amuleto
  });
  // Agrega todas las armaduras iniciales al inventario del jugador
  classArmor.initialArmor.forEach((armorId) => {
    const armor = armors.find((a) => a.id === armorId);
    console.log(armor);
    if (armor) {
      inventoryStore.addItem(`${player.name}_inventory`, 'armors', armor.id);
    } else {
      console.error(`Armor with ID ${armorId} not found.`);
    }
  });
}
