import { getGlobalState } from '../../customHooks/useGlobalState';
import { Item } from '../../stores/types/items';
import { darkenHex } from '../../utils/darkenHex';
import { handleSelectItem } from './handleSelectItem';

const InventoryList = (
  { actualInventory, setSelectedItem }: 
  { actualInventory: Array<[Item, number]> | null, setSelectedItem: any }
) => {
  console.log(actualInventory)
  const {setHoverInfo} = getGlobalState();
  return (
    <div className="containerInventory">
      <ul className="rpgui-list-imp" style={{minHeight: '150px'}}>
        {actualInventory && actualInventory.length > 0 ? (
          actualInventory.map(([item, count], index) => 
            item.color && (
              <li
                key={index}
                style={{
                  color: darkenHex(item.color, 0, 1),
                  marginTop: "2px",
                }}
                onClick={() => handleSelectItem(item.id, setSelectedItem)}
                onMouseMove={(e) =>setHoverInfo(
                  {
                    description: item.name,
                    bodyPart: item.bodyPart,
                    armorValue: item.armorValue,
                    damage: item.damage,
                    damageMax: item.damageMax,
                    levelRequirement: item.levelRequirement,
                    x: e.pageX, 
                    y: e.pageY, 
                  })}
                onMouseLeave={() => setHoverInfo(null)}
                >
                  
               {count > 1 ? `x${count}` : ""} {item.name}
              </li>
            )
          )
        ) : (
          <p>No se encontraron</p>
        )}
      </ul>
    </div>
  );
};

export default InventoryList;
