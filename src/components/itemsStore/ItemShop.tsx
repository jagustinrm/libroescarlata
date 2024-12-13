import React, {useState } from 'react';
import './ItemShop.css';
import useItemsStore from '../../stores/itemsStore';
import { Item } from '../../stores/types/items';
import usePlayerStore from '../../stores/playerStore';
import useInventoryStore from '../../stores/inventoryStore';
import BackButton from '../UI/BackButton';
import FloatingMessage from '../UI/floatingMessage/FloatingMessage';

const ItemShop: React.FC = () => {
  const { player, playerActions } = usePlayerStore();
  const { addItem: addItemToInventory } = useInventoryStore(); // Le tuve que cambiar el nombre al addItem
  const { items } = useItemsStore();
  const [selectedType, setSelectedType] = useState<keyof typeof items[1] | null>(null);
  const shopId = 1; // ID único para el inventario del shop (ahora es un número)
  const [hoverInfo, setHoverInfo] = useState<{ description: string; x: number; y: number } | null>(null);
  const [floatingMessage, setFloatingMessage] = useState<string | null>(null);
  const itemTypes = items[shopId] ? Object.keys(items[shopId]) : [];

  const handleBuy = (
    playerInventoryId: string,
    itemId: string,
    itemType: keyof typeof items[1],
    itemCost: number
  ) => {

    if (player.playerMaterial >= itemCost) {
      addItemToInventory(playerInventoryId, itemType, itemId);
      playerActions.setPlayerMaterial(player.playerMaterial - itemCost);
      setFloatingMessage('¡Comprado!');
    } else {
        setFloatingMessage('Te faltan materiales');
    }
  };

  const handleMouseMove = (event: React.MouseEvent, description: string) => {
    setHoverInfo({
      description,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseLeave = () => {
    setHoverInfo(null);
  };

  return (
    <div className="item-shop-container rpgui-container framed-golden-2">
      <h1>Mercado</h1>

      {/* Botones dinámicos para seleccionar tipo de ítems */}
      <div className="catalog-buttons">
        {itemTypes.map((type) => (
          <button
            className="rpgui-button catalog-button"
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
            <div
              className="item-card"
              key={item.id}
              onMouseMove={(e) => handleMouseMove(e, item.description || 'Sin descripción')}
              onMouseLeave={handleMouseLeave}
            >
              <h3 className="itemName">{item.name}</h3>
              {item.img && item.img.length > 0 ? (
                <img className="itemImg" src={item.img} alt={item.name} />
              ) : (
                <></>
              )}
              <button
                className="rpgui-button buyButton"
                onClick={() => handleBuy(player.inventoryId, item.id, selectedType, item.cost)}
                value={item.id}
              >
                {item.cost} 🛠️
              </button>
            </div>
          ))}
      </div>

      <BackButton />
      <p>Materiales: {player.playerMaterial} 🛠️</p>

      {/* Mensaje flotante */}
      {hoverInfo && (
        <div
          className="hover-tooltip"
          style={{
            position: 'fixed',
            top: hoverInfo.y + 10,
            left: hoverInfo.x + 10,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '5px',
            borderRadius: '5px',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {
          <> 
            <>{hoverInfo.description}</>
          </>
          }
        </div>
      )}

      {/* Mensaje de compra */}
      {floatingMessage && (
        <FloatingMessage
          message={floatingMessage}
          onComplete={() => setFloatingMessage(null)}
        />
      )}

    </div>
  );
};

export default ItemShop;
