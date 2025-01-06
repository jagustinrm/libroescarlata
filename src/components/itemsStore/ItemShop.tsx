import React, { useState } from 'react';
import './ItemShop.css';
import useItemsStore from '../../stores/itemsStore';
import { Item } from '../../stores/types/items';
import usePlayerStore from '../../stores/playerStore';
import useInventoryStore from '../../stores/inventoryStore';
import BackButton from '../UI/BackButton';
import FloatingMessage from '../UI/floatingMessage/FloatingMessage';
import { saveItemToFirebase } from '../../firebase/saveItemToFirebase';
import { useWeaponStore } from '../../stores/weaponStore';
import useAccessoryStore from '../../stores/accesoryStore';
import { Weapon } from '../../stores/types/weapons';
import { Armor } from '../../stores/types/armor';
import { Accessory } from '../../stores/types/accesories';
import useArmorStore from '../../stores/armorStore';

const ItemShop: React.FC = () => {
  const { player, playerActions } = usePlayerStore();
  const { addItem: addItemToInventory } = useInventoryStore();
  const {addNewWeapon} = useWeaponStore();
  const {addNewAccessory} = useAccessoryStore();
  const {addNewArmor} = useArmorStore();
  const { items } = useItemsStore();
  const [selectedType, setSelectedType] = useState<
    keyof (typeof items)[1] | null
  >(null);
  const shopId = 1;
  const [hoverInfo, setHoverInfo] = useState<{
    description: string;
    armorValue?: number;
    damage?: string;
    levelRequirement?: number;
    x: number;
    y: number;
  } | null>(null);
  const [floatingMessage, setFloatingMessage] = useState<string | null>(null);
  const itemTypes = items[shopId] ? Object.keys(items[shopId]) : [];

  const handleBuy = (
    playerInventoryId: string,
    itemId: string,
    itemType: keyof (typeof items)[1],
    itemCost: number,
    item: Item | Weapon | Armor | Accessory
  ) => {
    if (player.playerMaterial >= itemCost) {
      const updatedItem = { ...item, playerOwner: true } as Item | Weapon | Armor | Accessory;
     
      addItemToInventory(playerInventoryId, itemType, itemId);
      if (itemType === "armors") {
        addNewArmor(updatedItem as Armor);
        saveItemToFirebase(player.name, (updatedItem as Armor).id, updatedItem as Armor, "armors");
      } else if (itemType === "weapons") {
        saveItemToFirebase(player.name, (updatedItem as Weapon).id, updatedItem as Weapon, "weapons");
        addNewWeapon(updatedItem as Weapon);
      } else if (itemType === "accessories") {
        saveItemToFirebase(player.name, (updatedItem as Accessory).id, updatedItem as Accessory, "accessories");
        addNewAccessory(updatedItem as Accessory);
      }
      playerActions.setPlayerMaterial(player.playerMaterial - itemCost);
      setFloatingMessage('¡Comprado!');
    } else {
      setFloatingMessage('Te faltan materiales');
    }
  };

  const handleMouseMove = (
    event: React.MouseEvent,
    description: string,
    armorValue?: number,
    damage?: string,
    levelRequirement?: number,
  ) => {
    setHoverInfo({
      description,
      armorValue,
      damage,
      levelRequirement,
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
            onClick={() => setSelectedType(type as keyof (typeof items)[1])}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Renderizado de ítems basado en el tipo seleccionado */}
      <div className="item-grid">
        {selectedType &&
          items[shopId]?.[selectedType]?.map((item) => (
            <div
              className="item-card"
              style={{ borderColor: item.color }}
              key={item.id}
              onMouseMove={(e) =>
                handleMouseMove(
                  e,
                  item.description || 'Sin descripción',
                  item.armorValue && item.armorValue,
                  item.damage && item.damage,
                  item.levelRequirement,
                )
              }
              onMouseLeave={handleMouseLeave}
            >
                <h3
                  className="itemName"
                  style={{ color: item.color }}
                >
                  {item.name}
                </h3>
              {item.img && item.img.length > 0 ? (
                <img className="itemImg" src={item.img} alt={item.name} />
              ) : (
                <></>
              )}
              <button
                className="rpgui-button buyButton"
                onClick={() =>
                  handleBuy(
                    player.inventoryId,
                    item.id,
                    selectedType,
                    item.cost,
                    item
                  )
                }
                value={item.id}
              >
                {item.cost} 🛠️
              </button>
            </div>
          ))}
      </div>

      <BackButton />
      <p>Materiales: {player.playerMaterial} 🛠️</p>

      {/* Tooltip de información */}
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
          <p>{hoverInfo.description}</p>
          {typeof hoverInfo.armorValue === 'number' && (
            <p>Armadura: {hoverInfo.armorValue}</p>
          )}
          {hoverInfo.damage && <p>Daño: {hoverInfo.damage}</p>}
          {hoverInfo.levelRequirement && (
            <p>Requiere Nivel: {hoverInfo.levelRequirement}</p>
          )}
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
