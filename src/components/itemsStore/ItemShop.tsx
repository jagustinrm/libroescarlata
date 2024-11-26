import React, { useEffect, useState } from 'react';
import './ItemShop.css';
import { useNavigate } from 'react-router-dom';
import usePotionStore from "../../stores/potionsStore"; 
import useItemsStore from '../../stores/itemsStore';
import { Item } from '../../stores/types/items';
import { useWeaponStore } from '../../stores/weaponStore';
import usePlayerStore from '../../stores/playerStore';
import useInventoryStore from '../../stores/inventoryStore';


const ItemShop: React.FC = () => {
    const {player, playerActions} = usePlayerStore();
    const { addItem: addItemToInventory } = useInventoryStore(); // Le tuve que cambiar el nombre al addItem
    const { weapons } = useWeaponStore();
    const { potions } = usePotionStore();
    const { items, createItems, addItem } = useItemsStore();
    const [selectedType, setSelectedType] = useState<keyof typeof items[1] | null>(null);
    const shopId = 1; // ID único para el inventario del shop (ahora es un número)
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!items[shopId]) {
            createItems(shopId); // Crear el inventario si no existe
        }

        weapons.forEach((weapon) => {
            if (!items[shopId]?.weapons.some((w: Item) => w.id === weapon.id)) {
                addItem(shopId, 'weapons', weapon); // Agregar solo si no está ya en el inventario
            }
        });

        potions.forEach((potion) => {
            if (!items[shopId]?.potions.some((p: Item) => p.id === potion.id)) {
                addItem(shopId, 'potions', potion); // Agregar solo si no está ya en el inventario
            }
        });
    }, [weapons, potions, items, createItems, addItem, shopId]);

    const itemTypes = items[shopId] ? Object.keys(items[shopId]) : [];
    const handleBuy = (playerInventoryId: string, itemName: string, itemType: keyof typeof items[1], itemCost: number) => {
        if (player.playerMaterial >= itemCost) {
            addItemToInventory(playerInventoryId, itemType, itemName);
            playerActions.setPlayerMaterial(player.playerMaterial - itemCost)
        } else {
            alert("Te falta cash, amigo")
        }

    };
    

    return (
        <div className="item-shop-container">
            <h1>Item Shop</h1>

            {/* Botones dinámicos para seleccionar tipo de ítems */}
            <div className="catalog-buttons">
                {itemTypes.map((type) => (
                    <button 
                        key={type} 
                        onClick={() => setSelectedType(type as keyof typeof items[1])}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Renderizado de ítems basado en el tipo seleccionado */}
            <div className="item-grid">
                {selectedType &&
                    items[shopId]?.[selectedType]?.map((item: Item) => (
                        <div key={item.id} className="item-card">
                            <h3>{item.name}</h3>
                            <p>{item.description || 'No description available'}</p>
                            <p>Costo: {item.cost}</p>
                            <button 
                                className="buy-button"
                                onClick={() => handleBuy(player.inventoryId,
                                      item.name, selectedType, item.cost)}
                                value={item.id}
                            >
                                Comprar
                            </button>
                        </div>
                    ))}
            </div>

            {/* Botón para volver */}
            <button className="back-button" onClick={() => navigate('/home')}>
                Volver
            </button>
        </div>
    );
};

export default ItemShop;
