export function assignWeaponByClass({className, classes, 
    weapons, playerActions, inventoryStore, player}) {

    const classWeapon = classes.find(c => c.className === className)
    const weapon = weapons.find(w => w.id === parseInt(classWeapon.initialWeapon[0]));
    if (weapon) {
        playerActions.setP_SelectedWeapon(weapon) 
    }
    classWeapon.initialWeapon.forEach(weaponId => {
        const weapon = weapons.find(w => w.id === parseInt(weaponId));
        inventoryStore.addItem(`${player.name}_inventory`, 'weapons', weapon.name);
    });
}
