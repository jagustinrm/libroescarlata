import { saveItemToFirebase } from '../firebase/saveItemToFirebase';
import usePlayerStore from '../stores/playerStore';
// import { Accessory } from '../stores/types/accesories';
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
  const { player } = usePlayerStore.getState();
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
    anillo: [],
    aro: [],
    amuleto: null,
  });
  // Agrega todas las armaduras iniciales al inventario del jugador
  classArmor.initialArmor.forEach((armorId) => {
    const armor = armors.find((a) => a.id === armorId);
    if (armor) {
      const armorOwned = { ...armor, playerOwner: true };
      inventoryStore.addItemToInventory(
        `${player.playerId}_inventory`,
        'armors',
        armorOwned.id,
      );
      saveItemToFirebase(player.playerId, armorOwned.id, armorOwned, 'armors');
    } else {
      console.error(`Armor with ID ${armorId} not found.`);
    }
  });
}
