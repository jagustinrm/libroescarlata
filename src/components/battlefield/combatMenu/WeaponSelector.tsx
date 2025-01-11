// import { Inventory } from '../../../stores/types/inventory';
// import { Weapon } from '../../../stores/types/weapons';
// import Dropdown from '../../../utils/DropDown';

// interface WeaponSelectorProps {
//   inventories: Inventory;
//   selectedWeapon: Weapon;
//   setP_SelectedBodyPart: React.Dispatch<React.SetStateAction<string>>;
//   turn: 'player' | 'enemy' | 'summon';
//   creatureHealth: number;
// }

// const WeaponSelector: React.FC<WeaponSelectorProps> = ({
//   inventories,
//   selectedWeapon,
//   setP_SelectedBodyPart,
//   turn,
//   creatureHealth,
// }) => {
//   return (
//     <div>
//       <Dropdown
//         id="spell-dropdown"
//         options={inventories.weapons || []}
//         value={selectedWeapon}
//         onChange={(value) => setP_SelectedBodyPart(value)}
//         disabled={turn !== 'player' || creatureHealth === 0}
//       />
//     </div>
//   );
// };

// export default WeaponSelector;
