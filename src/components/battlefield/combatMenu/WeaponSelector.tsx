import { Inventory } from "../../../stores/types/inventory";
import Dropdown from "../../../utils/DropDown";

interface WeaponSelectorProps {
    inventories: Inventory;
    selectedWeapon: string;
    setSelectedWeapon: React.Dispatch<React.SetStateAction<string>>;
    turn: "player" | "enemy"  | "summon" ;
    creatureHealth: number;
  }
  
  const WeaponSelector: React.FC<WeaponSelectorProps> = ({
    inventories,
    selectedWeapon,
    setSelectedWeapon,
    turn,
    creatureHealth,
  }) => {
    return (
      <div>
        <Dropdown
          id="spell-dropdown"
          options={inventories.weapons || []}
          value={selectedWeapon}
          onChange={(value) => setSelectedWeapon(value)}
          disabled={turn !== "player" || creatureHealth === 0}
        />
      </div>
    );
  };
  
  export default WeaponSelector;
  