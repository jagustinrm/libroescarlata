import React, { useState } from 'react';
import './ItemShop.css';
import { useNavigate } from 'react-router-dom';
import useItemsStore from '../../stores/itemsStore';
import { Item } from '../../stores/types/items';
import usePlayerStore from '../../stores/playerStore';
import useInventoryStore from '../../stores/inventoryStore';
// import ItemShopLoader from './ItemShopLoader.js';
const ItemShop: React.FC = () => {
    const {player, playerActions} = usePlayerStore();
    const { addItem: addItemToInventory } = useInventoryStore(); // Le tuve que cambiar el nombre al addItem
    const { items} = useItemsStore();
    const [selectedType, setSelectedType] = useState<keyof typeof items[1] | null>(null);
    const shopId = 1; // ID único para el inventario del shop (ahora es un número)
    const navigate = useNavigate();

    const itemTypes = items[shopId] ? Object.keys(items[shopId]) : [];
    const handleBuy = (playerInventoryId: string, itemName: string, 
        itemType: keyof typeof items[1], itemCost: number) => {
        if (player.playerMaterial >= itemCost) {
            addItemToInventory(playerInventoryId, itemType, itemName);
            playerActions.setPlayerMaterial(player.playerMaterial - itemCost)
        } else {
            alert("Te falta cash, amigo")
        }
    };
    
    return (
        <div className="item-shop-container">
            {/* <ItemShopLoader/> */}
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
                        <div className="item-card" key={item.id}>
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
