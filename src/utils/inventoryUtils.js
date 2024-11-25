// // utils/inventoryUtils.js
// export const createInitialInventory = () => {
//     const inventory = {
//         weapons: [],
//         armors: [],
//         potions: [],
//         books: [],
//         scrolls: [],
//         others: [],
//     };
//     localStorage.setItem('inventory', JSON.stringify(inventory));
// };

// export const getInventory = () => {
//     return JSON.parse(localStorage.getItem('inventory'));
// };

// export const addItemToInventory = (category, item) => {
//     const inventory = getInventory();
//     if (inventory[category]) {
//         inventory[category].push(item);
//         localStorage.setItem('inventory', JSON.stringify(inventory));
//     } else {
//         console.error(`Categoría "${category}" no encontrada en el inventario.`);
//     }
// };

// export const loadActualInventory = async (category) => {
    
//     const inventory = getInventory();
//     let data;
//     switch (category) {
//         case 'weapons':
//             data = await fetch('/mocks/weapons.json').then(res => res.json().then(data => data.weapons));
//             break;
//         case 'armors':
//             break;
//         case 'potions':
//             break;
//         case 'books':
//             break;
//         case 'scrolls':
//             break;
//         case 'others':
//             break;
//         default:
//             console.error(`Categoría "${category}" no es válida.`);
//             return [];
//     }
 
//     const selectedItems = data.filter(item => item.id === 1);
//     return selectedItems; // 

// };


// export const resetInventory = () => {
//     createInitialInventory();
// };
