import { saveItemToFirebase } from "../firebase/saveItemToFirebase";
import { Class } from "../stores/types/class";
import { InventoryStore } from "../stores/types/inventory";
import { Player, PlayerActions } from "../stores/types/player";
import { Weapon } from "../stores/types/weapons";

interface AssignWeaponsParams {
  className: string;
  classes: Class[];
  weapons: Weapon[];
  playerActions: PlayerActions;
  inventoryStore: InventoryStore;
  player: Player
}

export function assignWeaponByClass({
  className,
  classes,
  weapons,
  playerActions,
  inventoryStore,
  player,
}: AssignWeaponsParams): void {
  const classWeapon = classes.find((c) => c.className === className);

  const weapon = weapons.find((w) => w.id === classWeapon?.initialWeapon[0]);
  if (weapon) {
    playerActions.setP_SelectedBodyPart(weapon);
  }
  classWeapon?.initialWeapon.forEach((weaponId: string) => {
    const weapon = weapons.find((w) => w.id === weaponId);
    weapon && saveItemToFirebase(player.name, weapon.id, weapon, "weapons");
    weapon && inventoryStore.addItem(`${player.name}_inventory`, 'weapons', weapon.id);
  });
}
