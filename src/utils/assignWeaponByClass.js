export function assignWeaponByClass(characterClass, classes, 
    weapons, setP_SelectedWeapon, inventoryStore, inventories, player ) {
 
    console.log(inventories[player.inventoryId])    
    const classWeapon = classes.find(c => c.className === characterClass)
    const weapon = weapons.find(w => w.id === parseInt(classWeapon.initialWeapon[0]));
    if (weapon) {
        setP_SelectedWeapon(weapon) 
    }
    classWeapon.initialWeapon.forEach(weaponId => {
        const weapon = weapons.find(w => w.id === parseInt(weaponId));
        inventoryStore.addItem('player1_inventory', 'weapons', weapon.name);
    });
}
