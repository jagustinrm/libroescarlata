import { darkenHex } from "../../utils/darkenHex";
import ButtonEdited from "../UI/ButtonEdited";
import { Item, Items } from "../../stores/types/items";
import { handleEquip } from "./handleEquip";
import { FloatingMessageProps } from "../../stores/types/others";
import { getGlobalState } from "../../customHooks/useGlobalState";
import { Inventory } from "../../stores/types/inventory";
import useInventoryStore from "../../stores/inventoryStore";

type AccessoryEquipped = {
  type: string;
  index: number;
} | null;

interface ItemDetailsProps {
  selectedItem: Item | null;
  selectedAccessoryEquipped: AccessoryEquipped;
  handleRead: () => void;
  setFloatingMessage: (message: FloatingMessageProps| null) => void;
  actualCategory: keyof Inventory;
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({
  selectedItem,
  selectedAccessoryEquipped,
  handleRead,
  setFloatingMessage,
  actualCategory
}) => {
  const { player, } = getGlobalState();
  const {removeItem} = useInventoryStore.getState();
  const handleDelete = (id: string, type: keyof Items, itemId: string) => {
    removeItem(id, type, itemId)

  }

  if (!selectedItem) {
    return <p className="detailsContainer" style={{ margin: '0px', boxSizing: 'border-box', padding: '10px' }}>Seleccioná un objeto.</p>;
  }

  return (
    <div
      className="detailsContainer"
      style={{
        borderColor: darkenHex(selectedItem.color, 90, 1),
        boxShadow: `0px 0px 1px 3px ${darkenHex(selectedItem.color, 30, 1)}, 0px 0px 0px 4px ${darkenHex(selectedItem.color, 90, 1)}`,
        background: `linear-gradient(0deg, ${darkenHex(selectedItem.color, 70, 0.8)} 10%, ${darkenHex(selectedItem.color, 40)} 50%, ${darkenHex(selectedItem.color, 10)} 70%)`,
       
      }}
    >
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px', width: '100%', marginRight: '10px', justifyContent: 'space-evenly', minHeight: '100%'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',  height: '100%', minWidth: '50%'}}>
        <h2 style={{ color: darkenHex(selectedItem.color, 0, 1) }}>
        {selectedItem.name}
        </h2>
        <img className="itemIventoryImg" src={selectedItem.img} alt={selectedItem.name} style={{minWidth: '50%'}} />
      </div>

        <div style={{ marginTop: "3px", display:'flex', flexDirection: 'column', gap: '30px' }}>
        {selectedItem.actions && (
         
          <ButtonEdited
            label={
              (selectedItem.actions.equippable && "Equipar") ||
              (selectedItem.actions.readable && "Leer") ||
              ""
            }
            width="130px"
            height="40px"
            onClick={() =>
              selectedItem.actions.equippable
                ? handleEquip(selectedItem, selectedAccessoryEquipped, setFloatingMessage)
                : selectedItem.actions.readable
                ? handleRead()
                : undefined
            }
          />    
          )}
           <ButtonEdited
            label={
              "Eliminar"
            }
            width="130px"
            height="40px"
            onClick={() => handleDelete(player.inventoryId, actualCategory, selectedItem.id) }
          />
    
        </div>

      </div>


    </div>
  );
};
