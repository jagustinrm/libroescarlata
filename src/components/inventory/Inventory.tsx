import { useState } from "react";
import usePlayerStore from '../../stores/playerStore';
import useInventoryStore from '../../stores/inventoryStore'; // Importamos el store de inventario
import './Inventory.css';
import type { Inventory } from '../../stores/types/inventory';
import BackButton from "../UI/backButton";

export default function Inventory() {
    const [actualInventory, setActualInventory] = useState<Array<string> | null>(null); // Cambié Item por "any" si no tienes la interfaz
    const { player } = usePlayerStore(); 
    const { inventories } = useInventoryStore(); 
    // Función para cargar el inventario según la categoría
    const handleLoadActualInventory = (category: keyof Inventory) => {
        if (!player.inventoryId || !inventories[player.inventoryId]) {
            setActualInventory(null); 
            return;
        }
        // Obtiene los ítems de la categoría seleccionada
        const selectedCategory = inventories[player.inventoryId][category];
        setActualInventory(selectedCategory || []);
    };

    return (
        <>
            <section className="secctionInventory">
                <h1>Inventario</h1>
                <div className="buttonsInventory">
                    <button className="rpgui-button" onClick={() => handleLoadActualInventory('weapons')}>Armas</button>
                    <button className="rpgui-button"  onClick={() => handleLoadActualInventory('armors')}>Armaduras</button>
                    <button className="rpgui-button"  onClick={() => handleLoadActualInventory('potions')}>Pociones</button>
                    <button className="rpgui-button"  onClick={() => handleLoadActualInventory('books')}>Libros</button>
                    <button className="rpgui-button"  onClick={() => handleLoadActualInventory('scrolls')}>Pergaminos</button>
                    <button className="rpgui-button"  onClick={() => handleLoadActualInventory('others')}>Otros</button>
                </div>
                
                <div className="containerInventory">
                    <ul className="rpgui-list-imp">
                        {actualInventory && actualInventory.length > 0 ? (
                            actualInventory.map((item, index) => (
                                <li key={index}>{item}</li> 
                            ))
                        ) : (
                            <p>No se encontraron</p>
                        )}
                    </ul>
                    
                </div>
                <BackButton/>
            </section>

        </>
    );
}
