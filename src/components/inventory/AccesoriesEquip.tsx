import useGlobalState from "../../customHooks/useGlobalState";
import { darkenHex } from "../../utils/darkenHex";

const DEFAULT_IMAGES: Record<"anillo" | "aro" | "amulet", string> = {
  anillo: "img/armors/ringplaceholder.png",
  aro: "img/armors/earringplaceholder.png",
  amulet: "img/armors/necklaceplaceholder.png",
};

const generateAccessories = (type: string, count: number, playerAccessories: any) => {
  return [...Array(count)].map((_, index) =>
    playerAccessories?.[type]?.[index] || {
      id: `default-${type}-${index}`,
      img: DEFAULT_IMAGES[type as "anillo" | "aro" | "amulet"],
      name: "Empty Slot",
    }
  );
};

interface AccessoriesEquipmentProps {
  selectedAccessoryEquipped: { type: string; index: number } | null; // Objeto con `type` e `index`
  setSelectedAccessoryEquipped: (accessory: { type: string; index: number } | null) => void; // Recibe un objeto o null
}

const AccesoriesEquipment: React.FC<AccessoriesEquipmentProps> = ({
  selectedAccessoryEquipped,
  setSelectedAccessoryEquipped,
}) => {
  const { player } = useGlobalState();

  const rings = generateAccessories("anillo", 10, player.accessoriesParts);
  const earrings = generateAccessories("aro", 2, player.accessoriesParts);
  const amulet =
    player.accessoriesParts?.amuleto || {
      id: "default-amulet",
      img: DEFAULT_IMAGES.amulet,
      name: "Empty Slot",
    };

  const isDefaultImage = (img: string, defaultImg: string) => img === defaultImg;

  const isSelected = (type: string, index: number) => {

    return selectedAccessoryEquipped?.type === type && selectedAccessoryEquipped.index === index;

  }

  const renderAccessory = (
    type: string,
    item: any,
    index: number,
    defaultImg: string,
    isSelectedItem: boolean
  ) => {
    const hasCustomImage = !isDefaultImage(item.img, defaultImg);

    const styles = hasCustomImage
      ? {
          borderColor: darkenHex(item.color || "#fff", 90, 1),
          boxShadow: `0px 0px 1px 3px ${darkenHex(item.color || "#fff", 30, 1)}, 
                      0px 0px 0px 4px ${darkenHex(item.color || "#fff", 90, 1)}`,
          background: `linear-gradient(0deg, 
                      ${darkenHex(item.color || "#fff", 70, 0.8)} 10%, 
                      ${darkenHex(item.color || "#fff", 40)} 50%, 
                      ${darkenHex(item.color || "#fff", 10)} 70%)`,
        }
      : {};

    return (
      <img
        key={item.id}
        className={`${type} rpgui-cursor-point ${hasCustomImage ? "" : "default-image"} ${
          isSelectedItem ? "selected" : ""
        }`}
        src={item.img}
        alt={item.name}
        style={styles}
        onClick={() => setSelectedAccessoryEquipped({ type, index })}
      />
    );
  };

  return (
    <div className="rpgui-container framed-golden-2 accessoriesContainer">
      <h2>Equipo</h2>
      <div className="accesoriesEquipment">
        {rings.map((ring, index) =>{
          return renderAccessory("anillo", ring, index, DEFAULT_IMAGES.anillo, isSelected("anillo", index))
        }

        )}
        {earrings.map((earring, index) =>
          renderAccessory("earring-" + index, earring, index, DEFAULT_IMAGES.aro, isSelected("aro", index))
        )}
        {renderAccessory(
          "amulet",
          amulet,
          0,
          DEFAULT_IMAGES.amulet,
          selectedAccessoryEquipped?.type === "amuleto"
        )}
      </div>
    </div>
  );
};

export default AccesoriesEquipment;
