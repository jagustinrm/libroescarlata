import React from 'react';
import {Items } from '../../stores/types/items';
import usePlayerStore from '../../stores/playerStore';
import { darkenHex } from '../../utils/darkenHex';
import { handleBuy } from './handleBuy';
import { FloatingMessageProps } from '../../stores/types/others';
import { SellItems } from './SelItems';

interface ItemGridProps {
  selectedType: keyof Items;
  items: Record<number, Items>;
  shopId: number;
  buyOrSell: string;
  handleMouseMove: (
    event: React.MouseEvent<HTMLDivElement>,
    description: string,
    bodyPart: string,
    armorValue?: number,
    damage?: number,
    damageMax?: number,
    levelRequirement?: number,
  ) => void;
  handleMouseLeave: () => void;
  setFloatingMessage: (message: FloatingMessageProps| null) => void 
}

const ItemGrid: React.FC<ItemGridProps> = ({
  selectedType,
  items,
  shopId,
  handleMouseMove,
  handleMouseLeave,
  setFloatingMessage,
  buyOrSell
}) => {
  const { player } = usePlayerStore.getState();
  const buyItems = () =>  {
    return (
      <div className="item-grid">
      {selectedType &&
        items[shopId]?.[selectedType]?.map(
          (item: any) =>
            item.color && (
              <div
                className="item-card"
                key={item.id}
                style={{
                  borderColor: darkenHex(item.color, 90, 1),
                  boxShadow: `0px 0px 1px 3px ${darkenHex(item.color, 30, 1)}, 0px 0px 0px 4px ${darkenHex(item.color, 90, 1)}`,
                  background: `linear-gradient(0deg, ${darkenHex(item.color, 70, 0.8)} 10%, ${darkenHex(item.color, 40)} 50%, ${darkenHex(item.color, 10)} 70%)`,
                }}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    item.description || 'Sin descripción',
                    item.bodyPart,
                    item.armorValue,
                    item.damage,
                    item.damageMax,
                    item.levelRequirement,
                  )
                }
                onMouseLeave={handleMouseLeave}
              >
                <h3
                  className="itemName"
                  style={{
                    color: darkenHex(item.color, 0, 1),
                    marginTop: '2px',
                  }}
                >
                  {item.name} ({item.rarity || 'Común'})
                </h3>
                {item.img && item.img.length > 0 ? (
                  <img className="itemImg" src={item.img} alt={item.name} />
                ) : null}
                <button
                  className="rpgui-button buyButton"
                  onClick={() =>
                    handleBuy(
                      player.inventoryId,
                      item.id,
                      selectedType,
                      item.cost,
                      item,
                      setFloatingMessage
                    )
                  }
                  value={item.id}
                >
                  {item.cost} 🛠️
                </button>
              </div>
            ),
        )}
    </div>
    )
  }
  return (
    buyOrSell === 'Comprar'? buyItems() : 
    <SellItems 
    selectedType= {selectedType}
    handleMouseMove = {handleMouseMove}
    handleMouseLeave = {handleMouseLeave}
    setFloatingMessage = {setFloatingMessage}
    />
  );
};

export default ItemGrid;
