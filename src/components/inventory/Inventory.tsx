import { useEffect, useState } from "react";
// @ts-expect-error Para que funcione
import { getInventory, loadActualInventory } from '../../utils/inventoryUtils.js';
import './Inventory.css'
import { Item, Inventory } from '../interfaces/InventoryInterface.js';


export default function Inventory() {
    const [totalInventory, setTotalInventory] = useState<Inventory | null>(null);
    const [actualInventory, setActualInventory] = useState<Array<Item> | null>(null);

    useEffect(() => {
        const inventario = getInventory();
        setTotalInventory(inventario);
    }, []);

    const handleLoadActualInventory = async (category: keyof Inventory) => {
        const result = await loadActualInventory(category); // Llama a la función desde utils
        setActualInventory(result);
    };

    return (
        <>
        <section className="secctionInventory">
            <h1>Inventario</h1>
            <div className="buttonsInventory">
            <button onClick={() => handleLoadActualInventory('weapons')}>Armas</button>
            <button>Armaduras</button>
            <button>Pociones</button>
            <button>Libros</button>
            <button>Pergaminos</button>
            <button>Otros</button>
            </div>
            <div className="containerInventory">
            <ul>
                {actualInventory?
                 actualInventory.map((i) => (
                    <li>{i.name}</li>
                ))
            :
                <p>No se encontraron</p>
            }
            </ul>
            </div>
            <a href="/home"><button>Volver</button></a>
        </section>
        </>
    );
}
