// import Dropdown from "../../../utils/DropDown";
// import { Spell } from "../../../stores/types/spells";


// interface SpellSelectorProps {
//     spells: Spell[];
//     selectedSpell: string;
//     setSelectedSpell: React.Dispatch<React.SetStateAction<string>>;
//     turn: "player" | "enemy";
//     creatureHealth: number;
//     executeSpell: () => void;
//   }
  
//   const SpellSelector: React.FC<SpellSelectorProps> = ({

//     spells,
//     selectedSpell,
//     setSelectedSpell,
//     turn,
//     creatureHealth,
//     executeSpell,
//   }) => {
//     return (
//       <div className="rpgui-container rpgui-draggable">
//         <div>
//           <Dropdown
//                 id="spell-dropdown"
//                 options={inventories[player.inventoryId].weapons || []}
//                 value={selectedWeapon}
//                 onChange={(value) => setSelectedWeapon(value)}
//                 disabled={turn !== "player" || creature.health === 0}
//           />
//         </div>
//         <button
//           onClick={executeSpell}
//           disabled={turn !== "player" || !selectedSpell || creatureHealth === 0}
//         >
//           Lanzar hechizo
//         </button>
//       </div>
//     );
//   };
  
//   export default SpellSelector;
  