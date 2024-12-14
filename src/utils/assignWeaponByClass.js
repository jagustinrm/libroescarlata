export function assignWeaponByClass({className, classes, 
    weapons, playerActions, inventoryStore, player}) {

    const classWeapon = classes.find(c => c.className === className)
    console.log(classWeapon)
    const weapon = weapons.find(w => w.id === classWeapon.initialWeapon[0]);
    if (weapon) {
        playerActions.setP_SelectedWeapon(weapon) 
    }
    classWeapon.initialWeapon.forEach(weaponId => {
        const weapon = weapons.find(w => w.id === weaponId);
        inventoryStore.addItem(`${player.name}_inventory`, 'weapons', weapon.id);
    });
}
