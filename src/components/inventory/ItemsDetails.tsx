import { darkenHex } from "../../utils/darkenHex";
import ButtonEdited from "../UI/ButtonEdited";
import { Item } from "../../stores/types/items";
import { handleEquip } from "./handleEquip";
import { FloatingMessageProps } from "../../stores/types/others";

type AccessoryEquipped = {
  type: string;
  index: number;
} | null;

interface ItemDetailsProps {
  selectedItem: Item | null;
  selectedAccessoryEquipped: AccessoryEquipped;
  handleRead: () => void;
  setFloatingMessage: (message: FloatingMessageProps| null) => void;
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({
  selectedItem,
  selectedAccessoryEquipped,
  handleRead,
  setFloatingMessage,
}) => {
  if (!selectedItem) {
    return <p>Selecciona un objeto para ver los detalles</p>;
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
      <h2 style={{ color: darkenHex(selectedItem.color, 0, 1) }}>
        {selectedItem.name}
      </h2>
      <img className="itemIventoryImg" src={selectedItem.img} alt={selectedItem.name} />

      {typeof selectedItem.armorValue === "number" && (
        <p>
          <strong>Armadura:</strong> {selectedItem.armorValue}
        </p>
      )}
      {typeof selectedItem.damage === "number" && (
        <p>
          <strong>Daño:</strong> {selectedItem.damage} - {selectedItem.damageMax}
        </p>
      )}
      {typeof selectedItem.range === "number" && (
        <p>
          <strong>Rango de ataque:</strong> {selectedItem.range}
        </p>
      )}

      {selectedItem.actions && (
        <div style={{ marginTop: "3px" }}>
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
        </div>
      )}
    </div>
  );
};
