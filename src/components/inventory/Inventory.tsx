// import { useState } from "react";
// import usePlayerStore from '../../stores/playerStore';
// import useInventoryStore from '../../stores/inventoryStore'; // Importamos el store de inventario
// import './Inventory.css';
// import type { Inventory } from '../../stores/types/inventory';
// import BackButton from '../UI/BackButton';

// export default function Inventory() {
//     const [actualInventory, setActualInventory] = useState<Array<string> | null>(null); // Cambié Item por "any" si no tienes la interfaz
//     const { player } = usePlayerStore(); 
//     const { inventories } = useInventoryStore(); 
//     // Función para cargar el inventario según la categoría
//     const handleLoadActualInventory = (category: keyof Inventory) => {
//         if (!player.inventoryId || !inventories[player.inventoryId]) {
//             setActualInventory(null); 
//             return;
//         }
//         // Obtiene los ítems de la categoría seleccionada
//         const selectedCategory = inventories[player.inventoryId][category];
//         setActualInventory(selectedCategory || []);
//     };

//     return (
//         <>
//             <section className="secctionInventory">
//                 <h1>Inventario</h1>
//                 <div className="buttonsInventory">
//                     <button className="rpgui-button" onClick={() => handleLoadActualInventory('weapons')}>Armas</button>
//                     <button className="rpgui-button"  onClick={() => handleLoadActualInventory('armors')}>Armaduras</button>
//                     <button className="rpgui-button"  onClick={() => handleLoadActualInventory('potions')}>Pociones</button>
//                     <button className="rpgui-button"  onClick={() => handleLoadActualInventory('books')}>Libros</button>
//                     <button className="rpgui-button"  onClick={() => handleLoadActualInventory('scrolls')}>Pergaminos</button>
//                     <button className="rpgui-button"  onClick={() => handleLoadActualInventory('others')}>Otros</button>
//                 </div>
                
//                 <div className="containerInventory">
//                     <ul className="rpgui-list-imp">
//                         {actualInventory && actualInventory.length > 0 ? (
//                             actualInventory.map((item, index) => (
//                                 <li key={index}>{item}</li> 
//                             ))
//                         ) : (
//                             <p>No se encontraron</p>
//                         )}
//                     </ul>
                    
//                 </div>
//                 <BackButton/>
//             </section>

//         </>
//     );
// }



import { useState } from "react";
import usePlayerStore from '../../stores/playerStore';
import useInventoryStore from '../../stores/inventoryStore';
import { useWeaponStore } from "../../stores/weaponStore"; // Importamos el store de armas
import usePotionStore from "../../stores/potionsStore"; // Importamos el store de pociones
import './Inventory.css';
import type { Inventory } from '../../stores/types/inventory';
import BackButton from '../UI/BackButton';

export default function Inventory() {
    const [actualInventory, setActualInventory] = useState<Array<string> | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null); // Estado para el objeto seleccionado
    const { player } = usePlayerStore(); 
    const { inventories } = useInventoryStore(); 
    const { weapons } = useWeaponStore(); // Obtenemos las armas
    const { potions } = usePotionStore(); // Obtenemos las pociones

    const handleLoadActualInventory = (category: keyof Inventory) => {
        if (!player.inventoryId || !inventories[player.inventoryId]) {
            setActualInventory(null); 
            return;
        }
        const selectedCategory = inventories[player.inventoryId][category];
        setActualInventory(selectedCategory || []);
    };

    const handleSelectItem = (itemName: string) => {
        // Buscar en armas
        const weapon = weapons.find((weapon: any) => weapon.name === itemName);
        if (weapon) {
            setSelectedItem(weapon);
            return;
        }

        // Buscar en pociones
        const potion = potions.find((potion: any) => potion.name === itemName);
        if (potion) {
            setSelectedItem(potion);
            return;
        }

        // Si no se encuentra en ninguno, limpiar la selección
        setSelectedItem(null);
    };

    return (
        <section className="secctionInventory rpgui-container framed-golden-2">
            <h1>Inventario</h1>
            <div className="buttonsInventory">
                <button className="rpgui-button editedButtond" onClick={() => handleLoadActualInventory('weapons')}>Armas</button>
                <button className="rpgui-button editedButtond" onClick={() => handleLoadActualInventory('armors')}>Armaduras</button>
                <button className="rpgui-button editedButtond" onClick={() => handleLoadActualInventory('potions')}>Pociones</button>
                <button className="rpgui-button editedButtond" onClick={() => handleLoadActualInventory('books')}>Libros</button>
                <button className="rpgui-button editedButtond " onClick={() => handleLoadActualInventory('scrolls')}>Pergaminos</button>
                <button className="rpgui-button editedButtond" onClick={() => handleLoadActualInventory('others')}>Otros</button>
            </div>
            <div className="inventoryLayout">
                <div className="containerInventory">
                    <ul className="rpgui-list-imp">
                        {actualInventory && actualInventory.length > 0 ? (
                            actualInventory.map((item, index) => (
                                <li key={index} onClick={() => handleSelectItem(item)}>{item}</li> 
                            ))
                        ) : (
                            <p>No se encontraron</p>
                        )}
                    </ul>
                </div>
                <div className="detailsContainer">
                    {selectedItem ? (
                        <>
                            <h2>{selectedItem.name}</h2>
                            <img className="itemIventoryImg" src={selectedItem.img} alt={selectedItem.name} />
                            <p><strong>Descripción:</strong> {selectedItem.description}</p>
                            <p><strong>Costo:</strong> {selectedItem.cost} <strong>materiales</strong></p>
                            {/* Agrega más propiedades según sea necesario */}
                        </>
                    ) : (
                        <p>Selecciona un objeto para ver los detalles</p>
                    )}
                </div>
            </div>
            <BackButton />
        </section>
    );
}
