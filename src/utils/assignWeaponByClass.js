
import {addItemToInventory} from './inventoryUtils.js'

export function assignIdWeaponByClass(characterClass) {
   let weaponId = null;
    switch (characterClass) {
        case "Mago":
            weaponId = 10; // Bastón
            break;
        case "Guerrero":
            weaponId = 1; // Espada Larga
            break;
        case "Pícaro":
            weaponId = 2; // Daga
            break;
        case "Clérigo":
            weaponId = 5; // Maza
            break;
        case "Bárbaro":
            weaponId = 3; // Hacha de Batalla
            break;
        case "Bardo":
            weaponId = 2; // Daga
            break;
        case "Druida":
            weaponId = 10; // Bastón
            break;
        case "Explorador":
            weaponId = 4; // Arco Largo
            break;
        case "Paladín":
            weaponId = 9; // Martillo de Guerra
            break;
        case "Monje":
            weaponId = 10; // Bastón
            break;
        default:
            console.error(`Clase desconocida: ${characterClass}`);
            return;
    }

    // Guardar el ID del arma en el localStorage
    localStorage.setItem("charWeaponId", weaponId.toString());

    addItemToInventory('weapons', weaponId.toString())
    console.log(`ID del arma inicial asignado para ${characterClass}: ${weaponId}`);
}
