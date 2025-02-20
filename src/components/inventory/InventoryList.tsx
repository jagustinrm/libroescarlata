import { Item } from '../../stores/types/items';
import { darkenHex } from '../../utils/darkenHex';
import { handleSelectItem } from './handleSelectItem';

const InventoryList = (
  { actualInventory, setSelectedItem }: 
  { actualInventory: Array<[Item, number]> | null, setSelectedItem: any }
) => {
  console.log(actualInventory);

  return (
    <div className="containerInventory">
      <ul className="rpgui-list-imp">
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
              >
                {item.name} {count > 1 ? `x${count}` : ""}
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
