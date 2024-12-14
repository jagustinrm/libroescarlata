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
import { get, ref } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";

export default function Inventory() {
    const [actualInventory, setActualInventory] = useState<Array<Weapon | Armor | Potion> | null>(null);

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
     
        const itemNames = inventories[player.inventoryId][category]; // Nombres de los objetos
        if (!itemNames || itemNames.length === 0) {
            setActualInventory([]);
            return;
        }
       
        let selectedCategory: Array<Weapon | Armor | Potion> = [];
    
        // Filtrar según la categoría
        switch (category) {
            case 'weapons':
                {

                const weaponsJson: Weapon[] = weapons.filter((weapon: Weapon) =>
                    itemNames.includes(weapon.id));
                selectedCategory = weaponsJson;
                break;
                 }
                 case 'armors': {
                    // Filtrar las armaduras locales
                    const localArmors = armors.filter((armor: Armor) => itemNames.includes(armor.id));
                    
                    // Obtener las armaduras de la base de datos de Firebase
                    const armorsRef = ref(database, `armors`);

                    get(armorsRef).then((snapshot) => {
                        if (snapshot.exists()) {
                            // MODIFICAR ACÁ. FALTARÍA FILTRAR LAS QUE TIENE EL USUARIO. HAY QUE ARREGLAR DE NUEVO EL DELETE DE FIREBASE PORQUE NO ME MANTIENE LA ARMADURA.
                            
                            const firebaseArmors: Armor[] = Object.values(snapshot.val()).map(armor => armor)
                            console.log(firebaseArmors)
                            // Combinar las armaduras locales y las de Firebase
                            setActualInventory([...localArmors, ...firebaseArmors]);

                        } else {
                            // Si no hay armaduras en Firebase, solo se usan las locales
                            setActualInventory(localArmors);
                        }
                    }).catch((error) => {
                        console.error("Error fetching armors from Firebase:", error);
                        setActualInventory(localArmors); // Si hay un error, solo mostrar las locales
                    });
                
                    break;
                }
                
            case 'potions':
                selectedCategory = potions.filter((potion: Potion) => itemNames.includes(potion.id));
                break;
            // Agrega más categorías según sea necesario
            default:
                selectedCategory = []; // Si la categoría no tiene un store definido
                break;
        }
            setActualInventory(selectedCategory);


    };

    const handleSelectItem = (itemName: string) => {
        // MODIFICAR, NECESITO QUE TODO UTILICE ID
        const itemId = isNaN(Number(itemName)) ? itemName : Number(itemName);
        const weapon = weapons.find((weapon: Weapon) => weapon.id === itemId);
        if (weapon) {
            setSelectedItem(weapon);
            return;
        }

        // Buscar en pociones
        const potion = potions.find((potion: Potion) => potion.id === itemId);
        if (potion) {
            setSelectedItem(potion);
            return;
        }

        const armor = armors.find((armor: Armor) => armor.id === itemId);
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
                                <>
                                <li key={index} onClick={() => handleSelectItem(item.id)}>
                                    {item.name} {/* Aquí item es un objeto, no una propiedad del objeto */}
                                </li>
                                </>
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
