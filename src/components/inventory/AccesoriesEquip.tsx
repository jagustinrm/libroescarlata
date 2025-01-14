import useGlobalState from "../../customHooks/useGlobalState";

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
  console.log(player)
  const rings = generateAccessories("anillo", 10, player.accessoriesParts);
  const earrings = generateAccessories("aro", 2, player.accessoriesParts);
  const amulet =
    player.accessoriesParts?.amuleto || {
      id: "default-amulet",
      img: DEFAULT_IMAGES.amulet,
      name: "Empty Slot",
    };

  const isDefaultImage = (img: string, defaultImg: string) => img === defaultImg;

  const isSelected = (type: string, index: number) =>
    selectedAccessoryEquipped?.type === type && selectedAccessoryEquipped.index === index;

  return (
    <div className="rpgui-container framed-golden-2 accessoriesContainer">
      <h2>Equipo</h2>
      <div className="accesoriesEquipment">

       {rings.map((ring, index) => (
        <img
          key={ring.id}
          className={`ring ${
            isDefaultImage(ring.img, DEFAULT_IMAGES.anillo) ? "default-image" : ""
          } ${isSelected("anillo", index) ? "selected" : ""}`}
          src={ring.img}
          alt={ring.name}
          data-index={index}
          onClick={() => setSelectedAccessoryEquipped({ type: "anillo", index })}
        />
      ))}
        
        {earrings.map((earring, index) => (
        <img
          key={earring.id}
          className={`earring-${index} ${
            isDefaultImage(earring.img, DEFAULT_IMAGES.aro) ? "default-image" : ""
          } ${isSelected("aro", index) ? "selected" : ""}`}
          src={earring.img}
          alt={earring.name}
          data-index={index}
          onClick={() => setSelectedAccessoryEquipped({ type: "aro", index })}
        />
      ))}
      <img
        key={amulet.id}
        className={`amulet ${
          isDefaultImage(amulet.img, DEFAULT_IMAGES.amulet)
            ? "default-image"
            : ""
        } ${selectedAccessoryEquipped?.type === "amuleto" ? "selected" : ""}`}
        src={amulet.img}
        alt={amulet.name}
        data-index={0} // Índice fijo para el amuleto
        onClick={() => setSelectedAccessoryEquipped({ type: "amuleto", index: 0 })}
      />
      
      </div>
    </div>
  );
};

export default AccesoriesEquipment;
