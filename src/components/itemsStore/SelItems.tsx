import { useEffect, useState } from "react";
import { getGlobalState } from "../../customHooks/useGlobalState";
import {  Items } from "../../stores/types/items";
import { darkenHex } from "../../utils/darkenHex";
import { handleSell } from "./handleSell";
import { getItemsByCategory } from "../../utils/getItemsByCategory";

export const SellItems = ({selectedType, handleMouseMove,handleMouseLeave, setFloatingMessage}: 
    {
        selectedType: keyof Items
        handleMouseMove: any
        handleMouseLeave: any
        setFloatingMessage: any
    }) => {
    const {inventories, player} = getGlobalState();
    const inventory = inventories[player.inventoryId]
    const [actualInventory, setActualInventory] = useState<any>([]);

    useEffect(() => {
        setActualInventory(getItemsByCategory(selectedType, inventory[selectedType] ?? []))
    }, [selectedType, inventory])
    return (
        <div className="item-grid">
            {selectedType &&
                actualInventory.map(
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
                      onClick={() => handleSell(player.inventoryId, item.id, selectedType, item.cost, setFloatingMessage)}
                      value={item.id}
                    >
                      {item.cost} 🛠️
                    </button>
                  </div>
                ),
                    )
            }
        </div>

    )
}