import {  useState } from "react";
import usePlayerStore from '../../stores/playerStore';
import useInventoryStore from '../../stores/inventoryStore';
import { useWeaponStore } from "../../stores/weaponStore"; // Importamos el store de armas
import usePotionStore from "../../stores/potionsStore"; // Importamos el store de pociones
import './Inventory.css';
import type { Inventory } from '../../stores/types/inventory';
import BackButton from '../UI/BackButton';
import { Armor } from "../../stores/types/armor";
import { Potion } from "../../stores/types/potions";
import { Weapon } from "../../stores/types/weapons";
import useArmorStore from "../../stores/armorStore";

export default function Inventory() {
    const [actualInventory, setActualInventory] = useState<Array<string> | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null); // Estado para el objeto seleccionado
    const { player } = usePlayerStore(); 
    const { inventories } = useInventoryStore(); 
    const { weapons } = useWeaponStore(); // Obtenemos las armas
    const { potions } = usePotionStore(); // Obtenemos las pociones
    const {armors} = useArmorStore();


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
  
        const weapon = weapons.find((weapon: Weapon) => weapon.name === itemName);
        if (weapon) {
            setSelectedItem(weapon);
            return;
        }

        // Buscar en pociones
        const potion = potions.find((potion: Potion) => potion.name === itemName);
        if (potion) {
            setSelectedItem(potion);
            return;
        }
        console.log(inventories)
        console.log(armors)
        const armor = armors.find((armor: Armor) => armor.id === itemName);
        if (armor) {

            setSelectedItem(armor);
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
