import useGlobalState from "../../customHooks/useGlobalState";

const WeaponEquipment = () => {
  const { player } = useGlobalState();

  // Función para determinar si una parte del cuerpo tiene imagen o no
  const hasImage = (part: any) => part?.img;

  return (
    <div className="rpgui-container framed-golden-2 containerWeaponEquip">
      <img
        className={`rightHand ${!hasImage(player.bodyParts?.manoDerecha) ? 'default-image' : ''}`}
        src={player.bodyParts?.manoDerecha?.img || "img/armors/righthand.png"}
        alt={player.bodyParts?.manoDerecha?.name}
      />
      <img
        className={`leftHand ${!hasImage(player.bodyParts?.manoIzquierda) ? 'default-image' : ''}`}
        src={player.bodyParts?.manoIzquierda?.img || "img/armors/lefthand.png"}
        alt={player.bodyParts?.manoIzquierda?.name}
      />
    </div>
  );
};

export default WeaponEquipment;

