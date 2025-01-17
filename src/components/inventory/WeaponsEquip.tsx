import useGlobalState from "../../customHooks/useGlobalState";
import { darkenHex } from "../../utils/darkenHex";

const WeaponEquipment = () => {
  const { player } = useGlobalState();

  const renderWeapon = (hand: "manoDerecha" | "manoIzquierda", defaultImg: string) => {
    const weapon = player.bodyParts?.[hand];
    const hasCustomImage = weapon?.img !== undefined;

    const styles = hasCustomImage
      ? {
          borderColor: darkenHex(weapon.color || "#fff", 90, 1),
          boxShadow: `0px 0px 1px 3px ${darkenHex(weapon.color || "#fff", 30, 1)}, 
                      0px 0px 0px 4px ${darkenHex(weapon.color || "#fff", 90, 1)}`,
          background: `linear-gradient(0deg, 
                      ${darkenHex(weapon.color || "#fff", 70, 0.8)} 10%, 
                      ${darkenHex(weapon.color || "#fff", 40)} 50%, 
                      ${darkenHex(weapon.color || "#fff", 10)} 70%)`,
        }
      : {};

    return (
      <img
        className={`${hand} ${hasCustomImage ? "" : "default-image"}`}
        src={weapon?.img || defaultImg}
        alt={weapon?.name || "Empty Slot"}
        style={styles}
      />
    );
  };

  return (
    <div className="rpgui-container framed-golden-2 containerWeaponEquip">
      {renderWeapon("manoDerecha", "img/armors/righthand.png")}
      {renderWeapon("manoIzquierda", "img/armors/lefthand.png")}
    </div>
  );
};

export default WeaponEquipment;
